import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGOUT
} from "../actions/authAction";

const initState = {
    token: null,
    error: null,
};

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                token: action.payload.token,
                error: null
            }
        case LOGIN_FAIL:
            return {
                ...state,
                token: null,
                error: action.payload.error,
            };
        case REGISTER_SUCCESS:
            return {
                ...state,
                token: null,
                error: null,
            };
        case REGISTER_FAIL:
        return {
            ...state,
            token: null,
            error: action.payload.error,
        };
        case LOGOUT:
            return {
                ...state,
                token: null,
                error: null
            }
        default:
            return state;
    }
};

export default authReducer;