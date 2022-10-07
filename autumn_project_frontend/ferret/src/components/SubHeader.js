import React, {Component} from "react";
import "../styles/SubHeader.css";
import { IoMdArrowDropright } from "react-icons/io"

class SubHeader extends Component{
    constructor(props) {
        super(props)

        this.state = {
            all_tabs : (this.props.all_tabs.length>0) ? this.props.all_tabs : null
        }

        this.changeTab = this.changeTab.bind(this)
    }

    componentDidMount() {
        document.getElementById(`${this.state.all_tabs[0]}Arrow`).style.display = 'block'
    }

    changeTab() {
        let targetTab = document.activeElement.innerHTML
        this.state.all_tabs.forEach(tab => {
            document.getElementById(`${tab}Arrow`).style.display = (tab===targetTab) ? 'block' : 'none'
        });
    }

    render(){
        let {all_tabs} = this.state
        const {page} = this.props
        let tabs = all_tabs.map(tab => {
            return(
                <div className="pageTabDiv" key={tab}>
                    <button className="pageTab" onClick={this.changeTab}>{tab}</button>
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
}

export default SubHeader