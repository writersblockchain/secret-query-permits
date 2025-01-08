use crate::msg::{CardResponse, ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::CARD_PERMITS;
use crate::state::{Card, USER_CARDS};
use cosmwasm_std::{
    entry_point, to_binary, Addr, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError,
    StdResult,
};
use secret_toolkit::permit::validate;
use secret_toolkit::permit::Permit;

#[entry_point]
pub fn instantiate(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> StdResult<Response> {
    Ok(Response::default())
}

#[entry_point]
pub fn execute(deps: DepsMut, env: Env, info: MessageInfo, msg: ExecuteMsg) -> StdResult<Response> {
    match msg {
        ExecuteMsg::Create { card, index } => try_create_card(deps, info, card, index),
        ExecuteMsg::Burn { index } => try_burn_card(deps, env, info, index),
    }
}

pub fn try_create_card(
    deps: DepsMut,
    info: MessageInfo,
    card: Card,
    index: u8,
) -> StdResult<Response> {
    //add_suffix needs byte array, this is called pre-fixing
    USER_CARDS
        .add_suffix(info.sender.as_bytes())
        .insert(deps.storage, &index, &card)?;

    Ok(Response::default())
}

pub fn try_burn_card(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    index: u8,
) -> StdResult<Response> {
    let user_exists = USER_CARDS
        .add_suffix(info.sender.as_bytes())
        .get(deps.storage, &index);
    match user_exists {
        Some(_) => USER_CARDS
            .add_suffix(info.sender.as_bytes())
            .remove(deps.storage, &index)?,
        None => {}
    }

    Ok(Response::default())
}

#[entry_point]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetCard {
            wallet,
            permit,
            index,
        } => to_binary(&query_card(deps, env, wallet, permit, index)?),
    }
}

fn query_card(
    deps: Deps,
    env: Env,
    wallet: Addr,
    permit: Permit,
    index: u8,
) -> StdResult<CardResponse> {
    let contract_address = env.contract.address;

    let viewer = validate(
        deps,
        CARD_PERMITS,
        &permit,
        contract_address.to_string(),
        None,
    )?;

    let card_exists = USER_CARDS
        .add_suffix(wallet.as_bytes())
        .get(deps.storage, &index);

    match card_exists {
        Some(card) => {
            if card.whitelist.contains(&viewer) {
                Ok(CardResponse { card: card })
            } else {
                Err(StdError::generic_err("Not authorized"))
            }
        }
        None => Err(StdError::generic_err("Need query permit!")),
    }
}
