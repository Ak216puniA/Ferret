import React, { Component } from 'react'
import './index.css';

class SeasonTableRow extends Component {
    render() {
      const {season, index} = this.props
      return (
        <div className='seasonRow'>
          <div className={`seasonIndex singleElementRowFlex`}>{index}</div>
          <div className={`seasonName  singleElementRowFlex`}>{season.name}</div>
          <div className={`seasonStartEnd  singleElementRowFlex`}>{season.start}</div>
          <div className={`seasonStartEnd  singleElementRowFlex`}>{season.end}</div>
        </div>
        )
    }
}

class HomepageContent extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         seasons : [
            {
                name : "Recruitment season'19",
                start : "10-01-2019",
                end : "24-01-2019"
            },
            {
                name : "Recruitment season'20",
                start : "10-01-2020",
                end : "24-01-2020"
            },
            {
                name : "Recruitment season'21",
                start : "10-01-2021",
                end : "24-01-2021"
            },
            {
                name : "Recruitment season'22",
                start : "19-03-2022",
                end : "02-04-2022"
            }
         ]
      }
    }

    render() {
        const {contentHeading} = this.props
        let {seasons} = this.state

        const seasonTableHeading = {
            name : 'Recruitment Season',
            start : 'Start Date',
            end : 'End Date'
        }
        let seasonTable = (
            seasons.length>0 ? 
            seasons.map((season, index) => < SeasonTableRow key={season.name} season={season} index={index+1}/>) : 
            <div>No seasons available</div>
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
                        <div className={`seasonName  singleElementRowFlex`}>{seasonTableHeading.name}</div>
                        <div className={`seasonStartEnd  singleElementRowFlex`}>{seasonTableHeading.start}</div>
                        <div className={`seasonStartEnd  singleElementRowFlex`}>{seasonTableHeading.end}</div>
                    </div>
                    {seasonTable}
                </div>
            </div>
        </div>
        )
    }
}

export default HomepageContent