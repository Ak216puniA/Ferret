import React, { Component } from 'react'
import '../styles/HomepageContent.css'

export class SeasonTableRow extends Component {
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

export default SeasonTableRow