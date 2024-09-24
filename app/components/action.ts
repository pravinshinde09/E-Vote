export const SET_FIELD = 'SET_FIELD';
export const RESET_STATE = 'RESET_STATE';

import { State } from "../utils/reducer";

type SetFieldAction = {
    type: typeof SET_FIELD;
    payload: Partial<State>;
}

type ResetStateAction = {
    type: typeof RESET_STATE;
}

export type ActionTypes = SetFieldAction | ResetStateAction;

export const setField = (payload: Partial<State>): SetFieldAction => ({
    type: SET_FIELD,
    payload,
});

export const resetState = (): ResetStateAction => ({
    type: RESET_STATE,
});
