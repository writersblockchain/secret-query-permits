use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use secret_toolkit::storage::Keymap;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]

pub struct Card {
    pub name: String, 
    pub email: String, 
    pub whitelist: Vec<String>, 
}

pub static USER_CARDS: Keymap<u8, Card> = Keymap::new(b"user cards");

pub const CARD_PERMITS: &str = "card_permits";
