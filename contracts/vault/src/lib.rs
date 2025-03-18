use cosmwasm_std::{
    entry_point, DepsMut, Env, MessageInfo, Response, StdResult, Uint128, BankMsg, Coin, CosmosMsg
};
use cw_storage_plus::{Map, Item};
use serde::{Deserialize, Serialize};
use cosmwasm_schema::schemars;

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

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, schemars::JsonSchema)]
pub struct VaultEmpty {}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, schemars::JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum VaultExecuteMsg {
    Deposit {},
    Withdraw {
        amount: u128,
    },
    TransferOwnership {
        new_owner: String,
    },
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: VaultEmpty,
) -> StdResult<Response> {
    Ok(Response::new().add_attribute("method", "instantiate"))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: VaultExecuteMsg,
) -> StdResult<Response> {
    match msg {
        VaultExecuteMsg::Deposit {} => {
            Ok(Response::new()
                .add_attribute("method", "deposit"))
        }
        VaultExecuteMsg::Withdraw { amount } => {
            Ok(Response::new()
                .add_attribute("method", "withdraw")
                .add_attribute("amount", amount.to_string()))
        }
        VaultExecuteMsg::TransferOwnership { new_owner } => {
            Ok(Response::new()
                .add_attribute("method", "transfer_ownership")
                .add_attribute("new_owner", new_owner))
        }
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