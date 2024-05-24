import React, {useState} from 'react'
import { Redirect} from 'react-router-dom'

import ImageLight from '../assets/img/login-light.jpg'
import ImageDark from '../assets/img/login-dark.jpg'
import { Label, Input, Button } from '@windmill/react-ui'
import axiosInstance from "../axiosInstance";
import {useToasts} from "react-toast-notifications";
import { useHistory } from "react-router-dom";

function Login() {
  const token=localStorage.getItem("token");
  const { addToast } = useToasts();
  const history = useHistory();
  const [login,setLogin]= useState({
    username:'',
    password:''
  })
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLogin({
      ...login,
      [name]: value,
    });
  };

  const submitLogin= async (event)=>{
    event.preventDefault();
    var body ={
      username: login.username,
      password: login.password
    }
    try {
      const response = await axiosInstance.post("/api/v1/auth/login", body);
      var token = response.data.token;
      addToast("Login success", { appearance: "success", autoDismiss: true });
      localStorage.setItem("token", token);
      history.push("/app");
    } catch (error) {
      addToast("Invalid credentials", { appearance: "error", autoDismiss: true });
    }
  }

  return token? (<Redirect to="/app"></Redirect>) :(
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Login</h1>
              <Label>
                <span>Username</span>
                <Input className="mt-1"
                       type="text"
                       placeholder="Username"
                       name="username"
                       value={login.username}
                       onChange={handleInputChange}
                />
              </Label>

              <Label className="mt-4">
                <span>Password</span>
                <Input className="mt-1"
                       type="password"
                       placeholder="***************"
                       name="password"
                       value={login.password}
                       onChange={handleInputChange}
                />
              </Label>

              <Button className="mt-4" onClick={submitLogin}>
                Log in
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Login
