use cosmwasm_schema::write_api;
use tournament::{TournamentExecuteMsg, TournamentEmpty};

fn main() {
    write_api! {
        instantiate: TournamentEmpty,
        execute: TournamentExecuteMsg,
    }
} 