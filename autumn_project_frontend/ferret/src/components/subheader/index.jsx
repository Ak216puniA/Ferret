import React from "react";
import "./index.css";
import { IoMdArrowDropright } from "react-icons/io"
import HomeTabs from "../home_tabs";
import SeasonTabs from "../season_tabs";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listRounds } from "../../features/seasonTab/seasonTabSlice";
import QuestionSectionTabs from "../question_section_tabs";

function SubHeader(props){
    const {page, initialTabs} = props

    const {season_id} = useParams()
    const seasonSubHeaderState = useSelector((state) => state.seasonSubHeader.open_questions)
    const seasonTabState = useSelector((state) => state.seasonTab.current_sections)
    const dispatch = useDispatch()

    const tabs = season_id>0 ? 
    (seasonSubHeaderState ? <QuestionSectionTabs section_tabs={seasonTabState}/> : <SeasonTabs />)  : 
    <HomeTabs homeTabs={initialTabs}/>

    useEffect(() => {
        if(season_id>0) dispatch(listRounds(season_id))
    }, [])
    
    return(
        <div className="inPageBar">
            <div className="topRightCornerLight"></div>
            <div className="inPageNavBar">
                <div className="currentPageDiv">
                    <div className={"centerContent currentPageArrow"}><IoMdArrowDropright size={38}/></div>
                    <div className="largeText">{page}</div>
                </div>
                <div className="tabDiv">
                    <div className="bottomLeftCornerDark"></div>
                    <div className="pageTabs">
                        {tabs}
                    </div>
                    <div className="bottomRightCornerDark"></div>
                </div>
            </div>
            <div className="topLeftCornerLight"></div>
        </div>
    ) 
}

export default SubHeader