import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

const initialState = [];

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case SET_ALERT:
            return [...state, payload]; // mutable: add on top of the state there
        case REMOVE_ALERT:
            return state.filter((alert) => alert.id !== payload); // remove alert by id
        default:
            return state;
    }
}