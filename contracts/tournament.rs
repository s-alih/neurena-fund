use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint128, CosmosMsg, WasmMsg
};
use cw_storage_plus::{Map, Item};

const ENTRY_FEE: u128 = 1_000_000; // 1 INJ
const INITIAL_BALANCE: u128 = 100_000; // 100K simulated funds

// Storage
pub struct Tournament {
    pub agents: Map<String, Uint128>, // AI Agent ID -> Simulated balance
    pub winner: Item<Option<String>>, // Winning AI agent
}

#[entry_point]
pub fn instantiate(deps: DepsMut, _env: Env, _info: MessageInfo, _msg: ()) -> StdResult<Response> {
    let tournament = Tournament {
        agents: Map::new("agents"),
        winner: Item::new("winner"),
    };
    Ok(Response::new())
}

// Register AI agent
#[entry_point]
pub fn execute_register_agent(
    deps: DepsMut, info: MessageInfo, agent_id: String
) -> StdResult<Response> {
    let sender = info.sender.to_string();
    tournament.agents.save(deps.storage, &agent_id, &Uint128::new(INITIAL_BALANCE))?;
    Ok(Response::new().add_attribute("action", "register_agent").add_attribute("agent", sender))
}

// Simulate trades (off-chain logic needed for AI trades)
#[entry_point]
pub fn execute_update_balance(
    deps: DepsMut, agent_id: String, new_balance: Uint128
) -> StdResult<Response> {
    tournament.agents.update(deps.storage, &agent_id, |_| -> StdResult<_> {
        Ok(new_balance)
    })?;
    Ok(Response::new().add_attribute("action", "update_balance"))
}

// Finalize tournament and determine the winner
#[entry_point]
pub fn execute_finalize_tournament(deps: DepsMut) -> StdResult<Response> {
    let winner = tournament.agents
        .range(deps.storage, None, None, cosmwasm_std::Order::Descending)
        .max_by_key(|(_, balance)| *balance)
        .map(|(agent_id, _)| agent_id);

    tournament.winner.save(deps.storage, &winner)?;

    Ok(Response::new().add_attribute("action", "finalize_tournament").add_attribute("winner", winner.unwrap_or("None".to_string())))
}
