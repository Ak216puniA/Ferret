import { Divider } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import './index.css'

function RoundInfo(props) {
    const { roundData, index, length } = props

    const sectionWiseMarks = roundData.length>1 ?
    roundData.map((section,index) => {
        if(index>0) return <div key={index} className='roundInfoSectionMarks'>{`${section[0]} : ${section[1]}`}</div>
    }) :
    []

    const roundInfoSectionDivider = index<length-1 ?
    <Divider 
    style={{
        width:'100%', 
        backgroundColor: '#F5B041',
        margin: '8px 0px 12px 0px'
    }}
    /> :
    <></>

    return (
        <div className='roundInfoDiv'>
            <div className='roundInfoHeading'>{roundData[0][0]['round_id']['name']}</div>
            <div className='roundInfoRoundMarks'>{`[ ${roundData[0][1]} ]`}</div>
            <div className='roundInfoSectionMarksDiv'>
                {sectionWiseMarks}
            </div>
            <div className='roundInfoRemarksDiv'>
                <div>Remarks :</div>
                <div>{roundData[0][0]['remark']}</div>
            </div>
            {roundInfoSectionDivider}
        </div>
    )
}

function InterviewRoundPrevRoundsInfo() {
    const interviewPanelState = useSelector((state) => state.interviewPanel.candidatePrevRoundInfo)
    const [showInfo, setShowInfo] = useState(false)

    let roundInfoButton = showInfo===true ?
    <button
    className={`panelRoundInfoButton panelHideRoundInfoButton`}
    onClick={() => setShowInfo(false)}
    >
        Hide Previous Rounds' Status
    </button> :
    <button
    className={`panelRoundInfoButton panelShowRoundInfoButton`}
    onClick={() => setShowInfo(true)}
    >
        Show Previous Rounds' Status
    </button>

    const candidateRoundsInfoContent = showInfo===true && interviewPanelState.length>0?
    interviewPanelState.map((roundData,index) => <RoundInfo key={roundData[0][0]['id']} roundData={roundData} index={index} length={interviewPanelState.length}/>) :
    []

    const candidateRoundInfo = showInfo===true ?
    <>
        <div className='candidateRoundInfoContentDiv'>
            {candidateRoundsInfoContent}
        </div>
        <Divider 
        style={{
            width:'100%', 
            backgroundColor: '#00BCC5',
            margin: '8px 0px 12px 0px'
        }}
        />
    </> :
    <></>

    return (
        <>
            {roundInfoButton}
            {candidateRoundInfo}
        </>
    )
}

export default InterviewRoundPrevRoundsInfo