import axiosInstance from '../../axiosInstance';

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";
export const LOGOUT = "LOGOUT";

export const loginUser = (username, password, addToast) => async (dispatch) => {
    var body = {
        username: username,
        password: password
    }
    try {
        const response = await axiosInstance.post("/api/v1/auth/login", body);
        var token = response.data.token;
        addToast("Login success", { appearance: "success", autoDismiss: true });
        localStorage.setItem("token", token);
        dispatch({ type: LOGIN_SUCCESS, payload: { token } });
    } catch (error) {
        addToast("Invalid credentials", { appearance: "error", autoDismiss: true });
        dispatch({ type: LOGIN_FAIL, payload: { error: 'Invalid credentials' } });

    }
}

export const registerUser = (username, password, email, addToast) => async (dispatch) => {
    var body = {
        username: username,
        password: password,
        email: email
    }
    const response = await axiosInstance.post("/api/v1/auth/register", body)
    .then(response => {
        let message = response.data;
        addToast("Register success, please try to login", { appearance: "success", autoDismiss: true });
        dispatch({ type: REGISTER_SUCCESS, payload: { message } });
    })
    .catch(error =>{
        if (error.response) {
            let message= error.response.data.message;
            addToast(message, { appearance: "error", autoDismiss: true });
            dispatch({ type: REGISTER_FAIL, payload: { error: message } });
        }
        else{
            addToast("Register fail", { appearance: "error", autoDismiss: true });
            dispatch({ type: REGISTER_FAIL, payload: { error: 'Register fail' } });
        }
    });
    
}
export const logOutUser = (addToast) => async (dispatch) => {
    addToast("Logout success", { appearance: "success", autoDismiss: true });
    var token = null;
    localStorage.setItem("token", token);
    dispatch({ type: LOGOUT, payload: { token } });
}