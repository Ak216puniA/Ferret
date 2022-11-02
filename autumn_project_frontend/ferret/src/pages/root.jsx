import React from "react";
import { Navigate } from "react-router-dom";

function Root() {
    return <Navigate to="/login" replace={true} />
}

export default Root