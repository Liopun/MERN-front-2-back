import axios from "axios";

import { setAlert } from "./alert.js";
import { 
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_PROFILE
} from "./types.js";

export const loadUser = () => async (dispatch) => {
    try {
        const res = await axios.get('/api/auth/current');
        dispatch({ type: USER_LOADED, payload: res.data });
    } catch (err) {
        dispatch({ type: AUTH_ERROR });
    }
};

export const registerUser = ({ name, email, password }) => async (dispatch) => {
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const body = JSON.stringify({ name, email, password });

    try {
        const res = await axios.post('/api/auth/register', body, options);

        dispatch(setAlert(res.data.message, 'success'));
        dispatch({ type: REGISTER_SUCCESS });
        // dispatch(loadUser());
    } catch (err) {
        const errors = err.errors;
        
        if (errors) errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        dispatch({
            type: REGISTER_FAIL
        });
    }
};

export const loginUser = (email, password) => async (dispatch) => {
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post('/api/auth/login', body, options);

        dispatch({ type: LOGIN_SUCCESS, payload: res.data });
        dispatch(loadUser());
    } catch (err) {
        const errors = err.errors;
        
        if (errors) errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        dispatch({
            type: LOGIN_FAIL
        });
    }
};

export const logoutUser = () => (dispatch) => {
    dispatch({ type: CLEAR_PROFILE });
    dispatch({ type: LOGOUT });
};