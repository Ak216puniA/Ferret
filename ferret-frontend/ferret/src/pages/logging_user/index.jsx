import React from "react";
import { useEffect } from 'react';
import { Navigate } from "react-router-dom";
import axios from "axios";
import { IS_USER_AUTHENTICATED } from "../../urls";
import { CircularProgress } from "@mui/material";
import { useState } from "react";

function LoggingUser() {

    const [userAuthenticated, setUserAuthenticated] = useState(localStorage.getItem('authenticated')==null ? false : localStorage.getItem('authenticated'));

    useEffect(() => {
        axios
        .get(
            `${IS_USER_AUTHENTICATED}`,
            {
            withCredentials: true
            }
        )
        .then((response) => {
            localStorage.setItem('authenticated', response.data['authenticated'])
            localStorage.setItem('username', response.data['username'])
            localStorage.setItem('name', response.data['name'])
            localStorage.setItem('email', response.data['email'])
            localStorage.setItem('year', response.data['year'])
            localStorage.setItem('userpart', response.data['userpart'])
            setUserAuthenticated(response.data['authenticated'])
            return response.data
        })
        .catch((error) => {
            console.log(error.message)
        })
        },[]
    )

    if(userAuthenticated){
        return <Navigate to="/home" replace={true} />
    }else{
        return <CircularProgress />
    }
}

export default LoggingUser