import axios from "axios";
import Instance from '../../context/Instance'
import { loginFailure, loginStart, loginSuccess, logout } from "./AuthActions";

export const login = async (user, dispatch) => {
    console.log("-------------");
    console.log(user);
    let msgLogin = document.getElementsByClassName("msgLogin")[0]
    let textLogin = document.getElementsByClassName("textLogin")[0]
    let loadingLogin = document.getElementsByClassName("icnSpinner")[0]
    dispatch(loginStart());
    try {
        const res = await Instance.post("/auth/login/", user)
        
        console.log("---------------------");
        console.log(res);
        console.log(res.data);

        res.data.isAdmin && dispatch(loginSuccess(res.data))
        msgLogin.style.display = "none"
    } catch (err) {
        console.log("ERROR")
        console.log(err)
        msgLogin.style.display = "block"
        msgLogin.innerHTML = err.response.code
        textLogin.innerHTML = "LOGIN"
        loadingLogin.style = "display: none; margin: auto;"
        dispatch(loginFailure());
    }
}

export const logout_ = async (dispatch) => {
    dispatch(logout());
}