import React, {useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux'
import "./index.css";
import { IoMdArrowDropright } from "react-icons/io"
import {tabClicked} from "../../features/navigationTab/navigationTabSlice"
import {listSeasons} from "../../features/season/seasonSlice"

function SubHeader(props){
    const {page, initialTabs, firstTab} = props

    const tabState = useSelector((state) => state.navigationTab.currentTab)
    const dispatch = useDispatch()

    useEffect(() => {
        if(tabState===''){
            document.getElementById(`${firstTab}Arrow`).style.display = 'block'
            dispatch(listSeasons(firstTab))
        }else{
            initialTabs.forEach(tab => {
                document.getElementById(`${tab}Arrow`).style.display = (tab===tabState) ? 'block' : 'none'
            });
            dispatch(listSeasons(tabState))
        }
    })

    let tabs = initialTabs.map(tab => {
        return(
            <div className="pageTabDiv" key={tab}>
                <button className="pageTab" onClick={() => dispatch(tabClicked(tab))}>{tab}</button>
                <div className="currentTabDownArrowDiv"><div className="currentTabDownArrow" id={`${tab}Arrow`}></div></div>
            </div>
        )
    })
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