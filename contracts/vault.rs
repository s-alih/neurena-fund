use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint128, BankMsg, CosmosMsg
};
use cw_storage_plus::{Map, Item};

pub struct Vault {
    pub deposits: Map<String, Uint128>, // Investor -> Deposit amount
    pub current_agent: Item<Option<String>>, // AI agent managing the vault
}

#[entry_point]
pub fn instantiate(deps: DepsMut, _env: Env, _info: MessageInfo, _msg: ()) -> StdResult<Response> {
    let vault = Vault {
        deposits: Map::new("deposits"),
        current_agent: Item::new("current_agent"),
    };
    Ok(Response::new())
}

// Investors deposit funds
#[entry_point]
pub fn execute_deposit(deps: DepsMut, info: MessageInfo) -> StdResult<Response> {
    let sender = info.sender.to_string();
    let deposit_amount = info.funds.iter().map(|c| c.amount.u128()).sum();

    vault.deposits.update(deps.storage, &sender, |balance| -> StdResult<_> {
        Ok(balance.unwrap_or(Uint128::zero()) + Uint128::new(deposit_amount))
    })?;

    Ok(Response::new().add_attribute("action", "deposit").add_attribute("investor", sender))
}

// Assign vault access to the winning AI agent
#[entry_point]
pub fn execute_assign_winner(deps: DepsMut, agent_id: String) -> StdResult<Response> {
    vault.current_agent.save(deps.storage, &Some(agent_id.clone()))?;
    Ok(Response::new().add_attribute("action", "assign_winner").add_attribute("agent", agent_id))
}

// Withdraw profits
#[entry_point]
pub fn execute_withdraw(deps: DepsMut, info: MessageInfo) -> StdResult<Response> {
    let sender = info.sender.to_string();
    let balance = vault.deposits.load(deps.storage, &sender)?;

    let msg = CosmosMsg::Bank(BankMsg::Send {
        to_address: sender.clone(),
        amount: vec![cosmwasm_std::Coin { denom: "inj".to_string(), amount: balance }],
    });

    vault.deposits.remove(deps.storage, &sender);

    Ok(Response::new().add_message(msg).add_attribute("action", "withdraw").add_attribute("investor", sender))
}
