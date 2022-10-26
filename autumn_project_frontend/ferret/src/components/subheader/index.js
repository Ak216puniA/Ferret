import React, {useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux'
import "./index.css";
import { IoMdArrowDropright } from "react-icons/io"
import {tabClicked} from "../../features/navigationTab/navigationTabSlice"

// class SubHeader extends Component{
//     constructor(props) {
//         super(props)

//         this.state = {
//             all_tabs : (this.props.all_tabs.length>0) ? this.props.all_tabs : null
//         }

//         this.changeTab = this.changeTab.bind(this)
//     }

//     componentDidMount() {
//         document.getElementById(`${this.state.all_tabs[0]}Arrow`).style.display = 'block'
//     }

//     changeTab() {
//         let targetTab = document.activeElement.innerHTML
//         this.state.all_tabs.forEach(tab => {
//             document.getElementById(`${tab}Arrow`).style.display = (tab===targetTab) ? 'block' : 'none'
//         });
//     }

//     render(){
//         let {all_tabs} = this.state
//         const {page} = this.props
//         let tabs = all_tabs.map(tab => {
//             return(
//                 <div className="pageTabDiv" key={tab}>
//                     <button className="pageTab" onClick={this.changeTab}>{tab}</button>
//                     <div className="currentTabDownArrowDiv"><div className="currentTabDownArrow" id={`${tab}Arrow`}></div></div>
//                 </div>
//             )
//         })
//         return(
//             <div className="inPageBar">
//                 <div className="topRightCornerLight"></div>
//                 <div className="inPageNavBar">
//                     <div className="currentPageDiv">
//                         <div className={"centerContent currentPageArrow"}><IoMdArrowDropright size={38}/></div>
//                         <div className="largeText">{page}</div>
//                     </div>
//                     <div className="tabDiv">
//                         <div className="bottomLeftCornerDark"></div>
//                         <div className="pageTabs">
//                             {tabs}
//                         </div>
//                         <div className="bottomRightCornerDark"></div>
//                     </div>
//                 </div>
//                 <div className="topLeftCornerLight"></div>
//             </div>
//         )
//     }
// }

// export default SubHeader

function SubHeader(props){
    const {page, initialTabs} = props
    const dispatch = useDispatch()
    const tabState = useSelector((state) => state.navigationTab.currentTab)

    const changeTab = (() => {
        let targetTab = document.activeElement.innerHTML
        dispatch(tabClicked(targetTab))
        initialTabs.forEach(tab => {
            document.getElementById(`${tab}Arrow`).style.display = (tab===targetTab) ? 'block' : 'none'
        });
    })

    // useEffect(() => {
    //     initialTabs.forEach(tab => {
    //         document.getElementById(`${tab}Arrow`).style.display = (tab===tabState) ? 'block' : 'none'
    //     });
    // })

        let tabs = initialTabs.map(tab => {
            return(
                <div className="pageTabDiv" key={tab}>
                    <button className="pageTab" onClick={changeTab}>{tab}</button>
                    <div className="currentTabDownArrowDiv"><div className="currentTabDownArrow" id={`${tab}Arrow`}></div></div>
                </div>
            )
        })
        return(
            <div className="inPageBar">
                {/* <div>{tabState}</div> */}
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