import React from 'react'
import './index.css';
import { useSelector, useDispatch } from 'react-redux'
import { openCreateSeasonDialog } from '../../features/season/seasonSlice'
import { useNavigate } from "react-router-dom";
import CreateSeasonDialog from '../create_season_dialog';

function SeasonTableRow(props){
    let navigate = useNavigate()
    
    const routeChange = (season_id) => {
        const url = `/season/${season_id}`
        navigate(url)
    }

    const {season, index} = props
    return (
        <div className='seasonRow'>
            <div className={`seasonIndex singleElementRowFlex`}>{index}</div>
            <div className={`seasonName  singleElementRowFlex`} onClick={() => routeChange(season.id)}>{`Recruitment season ${season.name}`}</div>
            <div className={`seasonStartEnd  singleElementRowFlex`}>{season.start}</div>
            <div className={`seasonStartEnd  singleElementRowFlex`}>{season.end}</div>
        </div>
    )
}

function HomeContent(props){
    const {contentHeading} = props

    const seasonState = useSelector((state) => state.season)
    const dispatch = useDispatch()

    const seasonTableHeading = {
        name : 'Recruitment Season',
        start : 'Start Date',
        end : 'End Date'
    }

    const seasons = seasonState.season_list
    let seasonTable = (
        seasons.length>0 ? 
        seasons.map((season, index) => <SeasonTableRow key={season.id} season={season} index={index+1}/>) : 
        <div></div>
    )

    return (
    <div className='homepageContent'>
        <div className='contentTriangleDiv'>
            <div className='topLeftCornerDark'></div>
            <div className='topRightCornerDark'></div>
        </div>
        <div className='contentDiv'>
            <div className='contentHeading'>{contentHeading}</div>
            <div>
                <div className='seasonHeadingRow'>
                    <div className={`seasonIndex singleElementRowFlex`}>S.No.</div>
                    <div className={`seasonNameHeading  singleElementRowFlex`}>{seasonTableHeading.name}</div>
                    <div className={`seasonStartEnd  singleElementRowFlex`}>{seasonTableHeading.start}</div>
                    <div className={`seasonStartEnd  singleElementRowFlex`}>{seasonTableHeading.end}</div>
                </div>
                {seasonTable}
            </div>
        </div>
        <div className='createSeasonButtonDiv'>
            <button className='createSeasonButton' onClick={() => dispatch(openCreateSeasonDialog())}>Create Season</button>
        </div>
        <CreateSeasonDialog />
    </div>
    )
}

export default HomeContent

