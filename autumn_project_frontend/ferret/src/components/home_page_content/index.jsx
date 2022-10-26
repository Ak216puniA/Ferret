import React from 'react'
import './index.css';
// import { listSeasons } from '../../features/season/seasonSlice'
import { useSelector, useDispatch } from 'react-redux'

// class SeasonTableRow extends Component {
//     render() {
//       const {season, index} = this.props
//       return (
//         <div className='seasonRow'>
//           <div className={`seasonIndex singleElementRowFlex`}>{index}</div>
//           <div className={`seasonName  singleElementRowFlex`}>{season.name}</div>
//           <div className={`seasonStartEnd  singleElementRowFlex`}>{season.start}</div>
//           <div className={`seasonStartEnd  singleElementRowFlex`}>{season.end}</div>
//         </div>
//         )
//     }
// }

// class HomepageContent extends Component {

//     // constructor(props) {
//     //   super(props)
    
//     //   this.state = {
//     //     //  seasons : [
//     //     //     {
//     //     //         name : "Recruitment season'19",
//     //     //         start : "10-01-2019",
//     //     //         end : "24-01-2019"
//     //     //     },
//     //     //     {
//     //     //         name : "Recruitment season'20",
//     //     //         start : "10-01-2020",
//     //     //         end : "24-01-2020"
//     //     //     },
//     //     //     {
//     //     //         name : "Recruitment season'21",
//     //     //         start : "10-01-2021",
//     //     //         end : "24-01-2021"
//     //     //     },
//     //     //     {
//     //     //         name : "Recruitment season'22",
//     //     //         start : "19-03-2022",
//     //     //         end : "02-04-2022"
//     //     //     }
//     //     //  ]
//     //   }
//     // }

//     constructor(props) {
//       super(props)
    
//       this.state = {
//         loading_store : this.props.loading,
//         loading : true,
//         // season_type : this.props.season_type,
//         season_type : 'Hello',
//         data : this.props.data
//       }
//     }

//     showState = () => {
//         console.log(this.props.loading_store)
//         console.log(this.state.loading)
//         console.log(this.props.contentHeading)
//         console.log(this.props.data)
//         console.log(this.state.season_type)
//     }

//     render() {
//         const {contentHeading} = this.props
//         const {season_type, loading, data} = this.state
//         // let {seasons} = this.state

//         const seasonTableHeading = {
//             name : 'Recruitment Season',
//             start : 'Start Date',
//             end : 'End Date'
//         }

//         // let seasonTable = (
//         //     seasons.length>0 ? 
//         //     seasons.map((season, index) => <SeasonTableRow key={season.name} season={season} index={index+1}/>) : 
//         //     <div>No seasons available</div>
//         // )
//         const seasonTable = []

//         return (
//         // <div className='homepageContent'>
//         //     <div className='contentTriangleDiv'>
//         //         <div className='topLeftCornerDark'></div>
//         //         <div className='topRightCornerDark'></div>
//         //     </div>
//         //     <div className='contentDiv'>
//         //         <div className='contentHeading'>{contentHeading}</div>
//         //         <div>
//         //             <div className='seasonHeadingRow'>
//         //                 <div className={`seasonIndex singleElementRowFlex`}>S.No.</div>
//         //                 <div className={`seasonName  singleElementRowFlex`}>{seasonTableHeading.name}</div>
//         //                 <div className={`seasonStartEnd  singleElementRowFlex`}>{seasonTableHeading.start}</div>
//         //                 <div className={`seasonStartEnd  singleElementRowFlex`}>{seasonTableHeading.end}</div>
//         //             </div>
//         //             {seasonTable}
//         //         </div>
//         //         <button onClick={this.props.listSeasonsByType}>season</button>
//         //     </div>
//         // </div>
//         <>
//         <button onClick={this.showState}>CONSOLE_STATE</button>
//         <div>{contentHeading}</div>
//         <div>{loading}</div>
//         <div>{season_type}</div>
//         <div>{data}</div>
//         <button onClick={this.props.listSeasonsByType}>GET_SEASONS</button>
//         </>
//         )
//     }
// }

// function mapStateToProps(state){
//     return {
//         loading: state.loading,
//         season_type: state.season_type,
//         data: state.data
//     }
// }

// const mapDispatchToProps = (dispatch) => {
//     return {
//         listSeasonsByType: (season_type) => {
//             dispatch(listSeasons(season_type))
//         }
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(HomepageContent)

function SeasonTableRow(props){
    const {season, index} = props
    return (
        <div className='seasonRow'>
            <div className={`seasonIndex singleElementRowFlex`}>{index}</div>
            <div className={`seasonName  singleElementRowFlex`}>{season.name}</div>
            <div className={`seasonStartEnd  singleElementRowFlex`}>{season.start}</div>
            <div className={`seasonStartEnd  singleElementRowFlex`}>{season.end}</div>
        </div>
    )
}

function HomepageContent(props){
        const {contentHeading} = props

        const seasonState = useSelector((state) => state.season)
        // const dispatch = useDispatch()

        const seasonTableHeading = {
            name : 'Recruitment Season',
            start : 'Start Date',
            end : 'End Date'
        }

        const seasons = seasonState.data
        let seasonTable = (
            seasons.length>0 ? 
            seasons.map((season, index) => <SeasonTableRow key={season.name} season={season} index={index+1}/>) : 
            <div></div>
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

export default HomepageContent

