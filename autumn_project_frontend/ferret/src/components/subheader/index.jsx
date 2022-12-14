import React from "react";
import "./index.css";
import { IoMdArrowDropright } from "react-icons/io"
import HomeTabs from "../home_tabs";
import RoundTabs from "../round_tabs";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listRounds, resetRoundTabState } from "../../features/roundTab/roundTabSlice";
import SectionTabs from "../section_tabs";
import { resetSeasonRoundContentState } from "../../features/seasonRoundContent/seasonRoundContentSlice";
import { resetQuestionsState } from "../../features/question/questionSlice";
import { resetSectionTabState } from "../../features/sectionTab/sectionTabSlice";
import { resetInterviewPanelState } from "../../features/interviewPanel/interviewPanelSlice";
import InterviewPanelsTabs from "../interview_panels_tabs";

function SubHeader(props){
    const {season_id} = useParams()
    const {page, initialTabs, noTabs} = props

    const roundTabState = useSelector((state) => state.roundTab.current_sections)
    const dispatch = useDispatch()
    let navigate = useNavigate()

    const routeChange = (address) => {
        if(address[1]==='home'){
            dispatch(resetRoundTabState())
            dispatch(resetSeasonRoundContentState())
            dispatch(resetQuestionsState())
            dispatch(resetSectionTabState())
            dispatch(resetInterviewPanelState())
            localStorage.setItem('questions','close')
        }
        if(address[0]!=='Questions'){
            localStorage.setItem('questions','close')
            dispatch(resetQuestionsState())
        }
        const url = `/${address[1]}`
        console.log(url)
        navigate(url)
    }

    const pageHeading = page.length>0 ?
    page.map((link,index) => <div className="subHeaderLinkDiv" key={index} onClick={() => routeChange(link)}>{link[0]} /</div>) :
    <></>

    const tabs = noTabs===true ?
    <InterviewPanelsTabs seasonId={season_id}/> :
    (
        season_id>0 ? 
        (
            localStorage.getItem('questions')==='open' ? 
            <SectionTabs section_tabs={roundTabState}/> : 
            <RoundTabs />
        ) : 
        <HomeTabs homeTabs={initialTabs}/>
    )

    const dashboardLink = noTabs===true ? 
    <div className="panelDashboardNavigationDiv">
        <div className="subHeaderLinkDiv" onClick={() => routeChange(page[1])}>Dashboard</div>
        <div className="centerContent"><IoMdArrowDropright size={28}/></div>
    </div> :
    <></>

    useEffect(() => {
        if(season_id>0) dispatch(listRounds(season_id))
    },[])
    
    return(
        <div className="inPageBar">
            <div className="topRightCornerLight"></div>
            <div className="inPageNavBar">
                <div className="currentPageDiv">
                    <div className={"centerContent currentPageArrow"}><IoMdArrowDropright size={38}/></div>
                    <div className="subHeaderPageHeadingDiv">{pageHeading}</div>
                </div>
                <div className="tabDiv">
                    <div className="bottomLeftCornerDark"></div>
                    <div className="pageTabs">
                        {tabs}
                    </div>
                    <div className="bottomRightCornerDark"></div>
                    {dashboardLink}
                </div>
            </div>
            <div className="topLeftCornerLight"></div>
        </div>
    ) 
}

export default SubHeader