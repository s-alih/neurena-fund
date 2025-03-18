use cosmwasm_std::{
    entry_point, DepsMut, Env, MessageInfo, Response, StdResult, Uint128, BankMsg, Coin, CosmosMsg
};
use cw_storage_plus::{Map, Item};
use serde::{Deserialize, Serialize};

pub struct Vault<'a> {
    pub balances: Map<'a, &'a str, Uint128>,
    pub total_supply: Item<'a, Uint128>,
}

impl<'a> Vault<'a> {
    pub const fn new() -> Self {
        Self {
            balances: Map::new("balances"),
            total_supply: Item::new("total_supply"),
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum VaultExecuteMsg {
    Deposit {},
    Withdraw { amount: Uint128 },
    Transfer { to: String, amount: Uint128 },
}

#[derive(Serialize, Deserialize)]
pub struct VaultEmpty {}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: VaultEmpty,
) -> StdResult<Response> {
    Ok(Response::new())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: VaultExecuteMsg,
) -> StdResult<Response> {
    match msg {
        VaultExecuteMsg::Deposit {} => execute_deposit(deps, env, info),
        VaultExecuteMsg::Withdraw { amount } => execute_withdraw(deps, env, info, amount),
        VaultExecuteMsg::Transfer { to, amount } => execute_transfer(deps, env, info, to, amount),
    }
}

fn execute_deposit(deps: DepsMut, _env: Env, info: MessageInfo) -> StdResult<Response> {
    let vault = Vault::new();
    let sender = info.sender.to_string();
    let deposit_amount = info.funds.iter().map(|c| c.amount.u128()).sum::<u128>();

    vault.balances.save(deps.storage, sender.as_str(), &Uint128::new(deposit_amount))?;

    Ok(Response::new()
        .add_attribute("action", "deposit")
        .add_attribute("investor", sender))
}

fn execute_withdraw(deps: DepsMut, _env: Env, info: MessageInfo, amount: Uint128) -> StdResult<Response> {
    let vault = Vault::new();
    let sender = info.sender.to_string();
    let balance = vault.balances.load(deps.storage, sender.as_str())?;

    if balance < amount {
        return Ok(Response::new()
            .add_attribute("error", "insufficient_funds"));
    }

    let msg = CosmosMsg::Bank(BankMsg::Send {
        to_address: sender.clone(),
        amount: vec![Coin {
            denom: "inj".to_string(),
            amount: balance,
        }],
    });

    vault.balances.remove(deps.storage, sender.as_str());

    Ok(Response::new()
        .add_message(msg)
        .add_attribute("action", "withdraw")
        .add_attribute("investor", sender))
}

fn execute_transfer(deps: DepsMut, _env: Env, info: MessageInfo, to: String, amount: Uint128) -> StdResult<Response> {
    let vault = Vault::new();
    let sender = info.sender.to_string();

    let sender_balance = vault.balances.load(deps.storage, sender.as_str())?;
    let recipient_balance = vault.balances.load(deps.storage, to.as_str()).unwrap_or(Uint128::zero());

    if sender_balance < amount {
        return Ok(Response::new()
            .add_attribute("error", "insufficient_funds"));
    }

    vault.balances.save(deps.storage, sender.as_str(), &(sender_balance - amount))?;
    vault.balances.save(deps.storage, to.as_str(), &(recipient_balance + amount))?;

    Ok(Response::new()
        .add_attribute("action", "transfer")
        .add_attribute("from", sender)
        .add_attribute("to", to)
        .add_attribute("amount", amount.to_string()))
} 
