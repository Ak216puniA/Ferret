import React from "react";
import { useSelector } from 'react-redux'
import "./index.css";
import { IoMdArrowDropright } from "react-icons/io"
import HomeTabs from "../home_tabs";

function SubHeader(props){
    const {page, initialTabs} = props
    // const subHeaderTabs = initialTabs

    const seasonTabState = useSelector((state) => state.seasonTab)
    // const dispatch = useDispatch()

    // useEffect(() => {
    //     if(seasonTabState.currentSeason===-1){
    //         if(seasonTabState.currentTab===''){
    //             document.getElementById(`${subHeaderTabs[0]}Arrow`).style.display = 'block'
    //             dispatch(listSeasons(subHeaderTabs[0]))
    //         }else{
    //             subHeaderTabs.forEach(tab => {
    //                 document.getElementById(`${tab}Arrow`).style.display = (tab===seasonTabState.currentTab) ? 'block' : 'none'
    //             });
    //             dispatch(listSeasons(seasonTabState.currentTab))
    //         }
    //     }else{
    //         console.log("yah")
    //     }
    // })

    // let tabs = subHeaderTabs.length>0 ? subHeaderTabs.map(tab => {
    //     return(
    //         <div className="pageTabDiv" key={tab}>
    //             <button className="pageTab" onClick={() => dispatch(tabClicked(tab))}>{tab}</button>
    //             <div className="currentTabDownArrowDiv"><div className="currentTabDownArrow" id={`${tab}Arrow`}></div></div>
    //         </div>
    //     )
    // }) : []

    const tabs = seasonTabState.currentSeason===-1 ? <HomeTabs homeTabs={initialTabs}/> : []
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