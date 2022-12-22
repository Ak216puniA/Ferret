import React from 'react'
import { Divider, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { openFilterDrawer, resetCheckingModeFilterState, resetFilterState, selectCategory, setDate, setTime } from '../../features/filter/filterSlice'
import './index.css'
import FilterDrawerContent from '../filter_drawer_content'
import { AiOutlineReload } from 'react-icons/ai'
import { MdFilterListAlt } from 'react-icons/md'
import { filterCandidates, filterCandidatesForCheckingMode } from '../../features/seasonRoundContent/seasonRoundContentSlice'
import { switchCheckingMode } from '../../features/candidateModal/candidateModalSlice'

function FilterDrawer() {
    const filterState = useSelector((state) => state.filter)
    const roundTabState = useSelector((state) => state.roundTab)
    const dispatch = useDispatch()

    const closeDrawerHandler = () => {
        dispatch(openFilterDrawer(false))
    }

    function categoryClickHandler(category,index){
        dispatch(selectCategory(category))
        for(let i=0 ; i<categories.length ; i++){
        document.getElementsByClassName('filterCategoryButton')[i].style.backgroundColor = i===index ? '#EEEEEE' : '#F5B041'
        }
        if(category==='Checking Mode'){
            dispatch(resetFilterState())
        }else{
            dispatch(resetCheckingModeFilterState())
            dispatch(switchCheckingMode(false))
        }
    }

    const filterClickHandler = () => {
        if (filterState.filterCheckingMode){
            dispatch(
                filterCandidatesForCheckingMode({
                    currentRound: roundTabState.currentTabId,
                    assigneeId: filterState.assignee==='' ? 0 : filterState.assignee,
                    questionStatus: filterState.questionStatus,
                    questionId: filterState.question==='' ? 0 : filterState.question
                })
            )
        }else{
            dispatch(
                filterCandidates({
                currentRound: roundTabState.currentTabId,
                section: filterState.section,
                status: filterState.status,
                marks: filterState.marks,
                marksCriteria: filterState.marksCriteria,
                date: filterState.date,
                time: filterState.time
                })
            )
            dispatch(setDate(''))
            dispatch(setTime(''))
        }
    }

    const resetAllFiltersClickHandler = () => {
        dispatch(resetFilterState())
        dispatch(selectCategory(''))
        for(let i=0 ; i<categories.length ; i++){
            document.getElementsByClassName('filterCategoryButton')[i].style.backgroundColor = '#F5B041'
        }
        dispatch(switchCheckingMode(false))
    }

    let categories = localStorage.getItem('year')>2 ? 
    (
        roundTabState.currentTabType==='test' ?
        [
            'Section',
            'Marks',
            'Status',
            'Checking Mode'
        ] :
        [
            'Section',
            'Marks',
            'Status',
            'Time Slot'
        ]
    ) :
    [
        roundTabState.currentTabType==='test' ?
        [
            'Status'
        ] :
        [
            'Status',
            'Time Slot'
        ]
    ]

    const categoryList = (
        categories.map((category,index) => {
            const filterCategoryDivider = index===3 && roundTabState.currentTabType==='test' ?
            <Divider 
            style={{
                width:'100%', 
                backgroundColor: '#EEEEEE',
                margin: '12px 0px',
                borderBottomWidth: '2px',
                borderColor: '#EEEEEE'
            }}
            /> : 
            <></>
            return (
                <div key={category}>
                    {filterCategoryDivider}
                    <ListItem 
                    disablePadding
                    >
                    <ListItemButton
                    className='filterCategoryButton'
                    style={{
                        backgroundColor: '#F5B041',
                    }}
                    onClick={() => categoryClickHandler(category,index)}
                    >
                        <ListItemText 
                        primary={category}
                        />
                    </ListItemButton>
                    </ListItem>
                </div>
            )
        })
    )

    return (
        <Drawer
        open={filterState.open_filter_drawer}
        onClose={closeDrawerHandler}
        anchor='left'
        PaperProps={{
        sx: { 
            width: "40%",
            height: '100%'
        },
        }}
        >
            <div className='filterDrawerButtonDiv'>
                <div className='filterButton' onClick={resetAllFiltersClickHandler}><AiOutlineReload className='filterIcon' size={20} /></div>
                <div className='filterButton' onClick={filterClickHandler}><MdFilterListAlt className='filterIcon' size={20} /></div>
            </div>
            <div className='filterDrawerDiv'>
                <div className='filterDrawerCategoryDiv'>
                    <List>
                        {categoryList}
                    </List>
                </div>
                <div className='filterDrawerCategoryContentDiv'>
                    <FilterDrawerContent />
                </div>
            </div>
        </Drawer>
    )
}

export default FilterDrawer