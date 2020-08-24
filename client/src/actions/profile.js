import axios from "axios";
import { setAlert } from "./alert";

import {
    GET_PROFILE,
    GET_PROFILES,
    UPDATE_PROFILE,
    PROFILE_ERROR,
    CLEAR_PROFILE,
    ACCOUNT_DELETED,
    GET_REPOS,
} from './types';

export const getCurrentProfile = () => async (dispatch) => {
    try {
      const res = await axios.get('/api/profile/me');
      dispatch({ type: GET_PROFILE, payload: res.data });
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.msg, status: err.status },
      });
    }
};
  
export const getProfiles = () => async (dispatch) => {
    dispatch({ type: CLEAR_PROFILE });
    try {
      const res = await axios.get('/api/profile');
      dispatch({ type: GET_PROFILES, payload: res.data });
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.msg, status: err.status }
      });
    }
};
  
export const getProfileById = (userId) => async (dispatch) => {
    try {
      const res = await axios.get(`/api/profile/user/${userId}`);
      dispatch({ type: GET_PROFILE, payload: res.data });
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.msg, status: err.status },
      });
    }
};
  
export const getGithubRepos = (username) => async (dispatch) => {
    try {
      const res = await axios.get(`/api/profile/github/${username}`);
      dispatch({ type: GET_REPOS, payload: res.data });
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.msg, status: err.status },
      });
    }
};
  
export const createProfile = (input, history, edit = false) => async (dispatch) => {
    const options = {
        headers: {
          'Content-Type': 'application/json',
        },
    };

    try {
        const res = await axios.post('/api/profile', input, options);
        dispatch({ type: GET_PROFILE, payload: res.data });
        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));
    
        if(!edit) history.push('/dashboard');
    } catch (err) {
        const errors = err.errors;
    
        if (errors) errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.msg, status: err.status },
        });
    }
};
  
export const addExperience = (input, history) => async (dispatch) => {
    const options = {
        headers: {
          'Content-Type': 'application/json',
        }
    };
  
    try {
        const res = await axios.put('/api/profile/experience', input, options);
    
        dispatch({ type: UPDATE_PROFILE, payload: res.data });
        dispatch(setAlert('Experience Added!', 'success'));
        history.push('/dashboard');
    } catch (err) {
        const errors = err.errors;
    
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
    
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.msg, status: err.status },
        });
    }
};
  
export const addEducation = (input, history) => async (dispatch) => {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      }
    };

    try {
        const res = await axios.put('/api/profile/education', input, options);
    
        dispatch({ type: UPDATE_PROFILE, payload: res.data });
        dispatch(setAlert('Education Added!', 'success'));
        history.push('/dashboard');
    } catch (err) {
        const errors = err.errors;
    
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
    
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.msg, status: err.status },
        });
    }
};
  
export const deleteExperience = (id) => async (dispatch) => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });
        dispatch(setAlert('Experience Removed!', 'success'));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.msg, status: err.status },
        });
    }
};
  
export const deleteEducation = (id) => async (dispatch) => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`);

        dispatch({ type: UPDATE_PROFILE, payload: res.data });
        dispatch(setAlert('Education Removed!', 'success'));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.msg, status: err.status },
        });
    }
};
  
export const deleteAccount = () => async (dispatch) => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      try {
        await axios.delete('/api/profile/');
        dispatch({ type: CLEAR_PROFILE });
        dispatch({ type: ACCOUNT_DELETED });
        dispatch(setAlert('Your account has been permanently deleted!'));
      } catch (err) {
        dispatch({
          type: PROFILE_ERROR,
          payload: { msg: err.msg, status: err.status },
        });
      }
    }
};