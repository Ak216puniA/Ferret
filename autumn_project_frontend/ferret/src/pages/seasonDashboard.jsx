import React from "react";
import { useParams } from "react-router-dom"

function SeasonDashboard() {
    const {season_id} = useParams()
    return <div>hello{season_id}</div>
}

export default SeasonDashboard