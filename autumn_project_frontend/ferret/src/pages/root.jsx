import React from "react";
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";

function Root() {
    const authState = useSelector((state) => state.logout.authenticated)
    return authState ? <Navigate to="/home" replace={true} /> : <Navigate to="/login" replace={true} />
}

export default Root