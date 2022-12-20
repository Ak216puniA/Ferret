import React from 'react'
import './index.css';
import { useSelector, useDispatch } from 'react-redux'
import { endSeason, openCreateSeasonDialog, openEndSeasonConfirmationDialog } from '../../features/season/seasonSlice'
import { useNavigate } from "react-router-dom";
import CreateSeasonDialog from '../create_season_dialog';
import EndSeasonConfirmationDialog from '../end_season_confirmation_dialog';

function SeasonTableRow(props){
    const {season, index} = props
    const dispatch = useDispatch()
    let navigate = useNavigate()

    const endSeasonButtonClickHandler = () => {
        dispatch(
            openEndSeasonConfirmationDialog({
                open: true,
                seasonId: season.id
            })
        )
    }
    
    const routeChange = (season_id) => {
        const url = `/season/${season_id}`
        navigate(url)
    }

    const yearWiseEndSeason = localStorage.getItem('year')>2 && season.end!==null ?
    <>{season.end}</> :
    <button className='homeContentEndSeasonButton' onClick={endSeasonButtonClickHandler}>End Season</button>

    return (
        <div className='seasonRow'>
            <div className={`seasonIndex singleElementRowFlex`}>{index}</div>
            <div className={`seasonName  singleElementRowFlex`} onClick={() => routeChange(season.id)}>{`Recruitment season ${season.name}`}</div>
            <div className={`seasonStartEnd  singleElementRowFlex`}>{season.start}</div>
            <div className={`seasonStartEnd  singleElementRowFlex`}>{yearWiseEndSeason}</div>
        </div>
    )
}

function HomeContent(props){
    const {contentHeading} = props
    const seasonState = useSelector((state) => state.season)
    const dispatch = useDispatch()

    const dialogCloseHandler = () => {
        dispatch(
            openEndSeasonConfirmationDialog({
                open: false,
                seasonId: 0
            })
        )
    }

    const agreeActionClickHandler = () => {
        const today = new Date().toISOString().slice(0, 10)
        dispatch(
            endSeason({
                seasonId: seasonState.endSeasonId,
                end: today
            })
        )
    }

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

    const yearWiseCreateSeason = localStorage.getItem('year')>2 ? 
    <div className='createSeasonButtonDiv'>
        <button className='createSeasonButton' onClick={() => dispatch(openCreateSeasonDialog())}>Create Season</button>
    </div> :
    <></>

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
        {yearWiseCreateSeason}
        <CreateSeasonDialog />
        <EndSeasonConfirmationDialog
        open={seasonState.openConfirmationDialog}
        dialogCloseHandler={dialogCloseHandler}
        agreeActionClickHandler={agreeActionClickHandler}
        />
    </div>
    )
}

export default HomeContent

