import React, {Component} from "react";
import "../styles/InPageNavigationBar.css";
import { IoMdArrowDropright } from "react-icons/io"

class InPageNavigationBar extends Component{
    constructor(props) {
        super(props)

        this.state = {
            current_tab : this.props.current_tab
        }
    }

    render(){
        return(
            <div className="inPageBar">
                <div className="topRightCorner"></div>
                <div className="inPageNavBar">
                    <div className="currentPageDiv">
                        <div className={"centerContent currentPageArrow"}><IoMdArrowDropright size={38}/></div>
                        <div className="largeText">{this.props.current_page}</div>
                    </div>
                    <div className="tabDiv">
                        <div className="bottomLeftCorner"></div>
                        <div className="pageTabs">
                            <div className="pageTab">Developer</div>
                            <div className="pageTab">Designer</div>
                        </div>
                        <div className="bottomRightCorner"></div>
                    </div>
                    <div className="TabsDownArrowDiv">
                        <div className="currentTabDownArrowDiv"><div className="currentTabDownArrow"></div></div>
                        <div className="currentTabDownArrowDiv"><div className="currentTabDownArrow"></div></div>
                    </div>
                </div>
                <div className="topLeftCorner"></div>
            </div>
        )
    }
}

export default InPageNavigationBar