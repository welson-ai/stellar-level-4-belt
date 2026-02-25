#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype,
    token, Address, Env, symbol_short,
};

#[contracttype]
pub enum DataKey {
    ReserveA,
    ReserveB,
    TotalLiquidity,
    TokenA,
    TokenB,
}

pub struct LiquidityPool;

#[contractimpl]
impl LiquidityPool {
    pub fn initialize(env: Env, token_a: Address, token_b: Address) {
        env.storage().persistent().set(&DataKey::TokenA, &token_a);
        env.storage().persistent().set(&DataKey::TokenB, &token_b);
        env.storage().persistent().set(&DataKey::ReserveA, &0i128);
        env.storage().persistent().set(&DataKey::ReserveB, &0i128);
        env.storage().persistent().set(&DataKey::TotalLiquidity, &0i128);
    }

    pub fn add_liquidity(env: Env, user: Address, amount_a: i128, amount_b: i128) -> i128 {
        user.require_auth();

        let token_a: Address = env.storage().persistent().get(&DataKey::TokenA).unwrap();
        let token_b: Address = env.storage().persistent().get(&DataKey::TokenB).unwrap();

        // INTER-CONTRACT CALL: transfer token A from user to pool
        token::TokenClient::new(&env, &token_a)
            .transfer(&user, &env.current_contract_address(), &amount_a);

        // INTER-CONTRACT CALL: transfer token B from user to pool
        token::TokenClient::new(&env, &token_b)
            .transfer(&user, &env.current_contract_address(), &amount_b);

        let reserve_a: i128 = env.storage().persistent().get(&DataKey::ReserveA).unwrap_or(0);
        let reserve_b: i128 = env.storage().persistent().get(&DataKey::ReserveB).unwrap_or(0);
        let total: i128 = env.storage().persistent().get(&DataKey::TotalLiquidity).unwrap_or(0);

        let lp_minted = if total == 0 {
            let product = amount_a * amount_b;
            let mut x = product;
            let mut y = (x + 1) / 2;
            while y < x {
                x = y;
                y = (product / y + y) / 2;
            }
            x
        } else {
            let a = amount_a * total / reserve_a;
            let b = amount_b * total / reserve_b;
            if a < b { a } else { b }
        };

        env.storage().persistent().set(&DataKey::ReserveA, &(reserve_a + amount_a));
        env.storage().persistent().set(&DataKey::ReserveB, &(reserve_b + amount_b));
        env.storage().persistent().set(&DataKey::TotalLiquidity, &(total + lp_minted));

        env.events().publish(
            (symbol_short!("add_liq"),),
            (user, amount_a, amount_b, lp_minted),
        );

        lp_minted
    }

    pub fn swap(env: Env, user: Address, amount_in: i128, a_to_b: bool) -> i128 {
        user.require_auth();

        let token_a: Address = env.storage().persistent().get(&DataKey::TokenA).unwrap();
        let token_b: Address = env.storage().persistent().get(&DataKey::TokenB).unwrap();
        let reserve_a: i128 = env.storage().persistent().get(&DataKey::ReserveA).unwrap_or(0);
        let reserve_b: i128 = env.storage().persistent().get(&DataKey::ReserveB).unwrap_or(0);

        // 0.3% fee
        let amount_in_with_fee = amount_in * 997 / 1000;

        let (amount_out, new_reserve_a, new_reserve_b) = if a_to_b {
            let out = amount_in_with_fee * reserve_b / (reserve_a + amount_in_with_fee);
            // INTER-CONTRACT CALL
            token::TokenClient::new(&env, &token_a)
                .transfer(&user, &env.current_contract_address(), &amount_in);
            token::TokenClient::new(&env, &token_b)
                .transfer(&env.current_contract_address(), &user, &out);
            (out, reserve_a + amount_in, reserve_b - out)
        } else {
            let out = amount_in_with_fee * reserve_a / (reserve_b + amount_in_with_fee);
            token::TokenClient::new(&env, &token_b)
                .transfer(&user, &env.current_contract_address(), &amount_in);
            token::TokenClient::new(&env, &token_a)
                .transfer(&env.current_contract_address(), &user, &out);
            (out, reserve_a - out, reserve_b + amount_in)
        };

        env.storage().persistent().set(&DataKey::ReserveA, &new_reserve_a);
        env.storage().persistent().set(&DataKey::ReserveB, &new_reserve_b);

        env.events().publish(
            (symbol_short!("swap"),),
            (user, amount_in, amount_out, a_to_b),
        );

        amount_out
    }

    pub fn remove_liquidity(env: Env, user: Address, lp_tokens: i128) -> (i128, i128) {
        user.require_auth();

        let token_a: Address = env.storage().persistent().get(&DataKey::TokenA).unwrap();
        let token_b: Address = env.storage().persistent().get(&DataKey::TokenB).unwrap();
        let reserve_a: i128 = env.storage().persistent().get(&DataKey::ReserveA).unwrap_or(0);
        let reserve_b: i128 = env.storage().persistent().get(&DataKey::ReserveB).unwrap_or(0);
        let total: i128 = env.storage().persistent().get(&DataKey::TotalLiquidity).unwrap_or(0);

        let amount_a = lp_tokens * reserve_a / total;
        let amount_b = lp_tokens * reserve_b / total;

        // INTER-CONTRACT CALL: send tokens back to user
        token::TokenClient::new(&env, &token_a)
            .transfer(&env.current_contract_address(), &user, &amount_a);
        token::TokenClient::new(&env, &token_b)
            .transfer(&env.current_contract_address(), &user, &amount_b);

        env.storage().persistent().set(&DataKey::ReserveA, &(reserve_a - amount_a));
        env.storage().persistent().set(&DataKey::ReserveB, &(reserve_b - amount_b));
        env.storage().persistent().set(&DataKey::TotalLiquidity, &(total - lp_tokens));

        env.events().publish(
            (symbol_short!("rem_liq"),),
            (user, amount_a, amount_b),
        );

        (amount_a, amount_b)
    }

    pub fn get_reserves(env: Env) -> (i128, i128) {
        let reserve_a: i128 = env.storage().persistent().get(&DataKey::ReserveA).unwrap_or(0);
        let reserve_b: i128 = env.storage().persistent().get(&DataKey::ReserveB).unwrap_or(0);
        (reserve_a, reserve_b)
    }

    pub fn get_total_liquidity(env: Env) -> i128 {
        env.storage().persistent().get(&DataKey::TotalLiquidity).unwrap_or(0)
    }
}
