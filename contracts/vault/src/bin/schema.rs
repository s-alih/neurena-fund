use cosmwasm_schema::write_api;
use vault::{VaultExecuteMsg, VaultEmpty};

fn main() {
    write_api! {
        instantiate: VaultEmpty,
        execute: VaultExecuteMsg,
    }
} 