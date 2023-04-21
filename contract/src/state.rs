use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use secret_toolkit::storage::{Item, Keymap};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]

pub struct Card {}

pub static USER_CARDS: Keymap<u8, Card> = Keymap::new(b"user cards");

pub const PREFIX_REVOKED_PERMITS: &str = "revoked_permits";
