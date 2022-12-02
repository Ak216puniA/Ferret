import React from 'react'
import { FormControl, TextField, Select, InputLabel, MenuItem, FormControlLabel, RadioGroup, Radio } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import './index.css'
import { useState } from 'react'
import { MdFilterListAlt } from 'react-icons/md'
import { AiOutlineReload } from 'react-icons/ai'
import { filterCandidates } from '../../features/seasonRoundContent/seasonRoundContentSlice'

function FilterDrawerContent() {
  const filterState = useSelector((state) => state.filter)
  const roundTabState = useSelector((state) => state.roundTab)
  const dispatch = useDispatch()

  const [marksCriteria, setMarksCriteria] = useState()
  const [marks, setMarks] = useState()
  const [section, setSection] = useState()
  const [status, setStatus] = useState()

  const marksCriteriaChangeHandler = (event) => {
    setMarksCriteria(event.target.value)
  }

  const marksChangeHandler = (event) => {
    setMarks(event.target.value)
  }

  const radioGroupChangeHandler = (event) => { 
    if(filterState.category==='Section'){
      setSection(event.target.value)
    }else if(filterState.category==='Status'){
      setStatus(event.target.value)
    }
  }

  const resetButtonHandler = () => {
    // if(filterState.category==='Marks'){
    //   setMarks()
    //   setMarksCriteria()
    // }else if(filterState.category==='Section'){
    //   setSection()
    // }else if(filterState.category==='Status'){
    //   setStatus()
    // }
    console.log('STATE...')
    console.log(section)
    console.log(marks)
    console.log(status)
  }

  const filterClickHandler = () => {
    dispatch(
      filterCandidates({
        currentRound: roundTabState.currentTabId,
        section: section,
        status: status,
        marks: marks,
        marksCriteria: marksCriteria
      })
    )
  }

  let filterDrawerContentList = []
  if(filterState.category==='Section'){
    filterDrawerContentList = roundTabState.current_sections.map(section => [section['id'],section['name']])
  }else if(filterState.category==='Status'){
    filterDrawerContentList = [[1,'Done'],[2,'Pending']]
  }

  const filterDrawerContent =  filterDrawerContentList.length>0 ? 
  filterDrawerContentList.map((data) => <FormControlLabel key={data} value={data[0]} control={<Radio />} onClick={radioGroupChangeHandler} label={data[1]} />) :
  []

  const filterButton = (
    <div className='filterDrawerFilterButtonDiv'>
      <div className='filterButton' onClick={filterClickHandler}>
        <MdFilterListAlt className='filterIcon' size={20} />
      </div>
    </div>
  )

  if(filterState.category==='Marks'){
    const marksFilterInputLabel = marksCriteria==='topPercentage' ? 'Percentage' : (marksCriteria==='topMarks' ? 'Top' : 'Marks')
    const marksFilterContent = marksCriteria==='' ?
    <></> :
    (
      <TextField 
      required 
      labelid='marks'
      label={marksFilterInputLabel} 
      type='number'
      value={marks}
      variant='outlined'
      InputProps={{ inputProps: { min: 0 } }}
      fullWidth
      onChange={marksChangeHandler}
      sx={{
        marginTop: '5%'
      }}
      />
    )

    return (
      <>
      {filterButton}
      <div className='filterContentResetButtonDiv' onClick={resetButtonHandler}><AiOutlineReload /></div>
      <div className='marksContentDiv'>
        <FormControl fullWidth>
          <InputLabel id='criteria'>Filtering Criteria</InputLabel>
          <Select 
          required 
          labelid='criteria' 
          label='Filtering Criteria'
          value={marksCriteria}
          placeholder='Filtering criteria' 
          variant='outlined'
          onChange={marksCriteriaChangeHandler}
          >
              <MenuItem value={'topPercentage'}>Top rankers based on Percentage</MenuItem>
              <MenuItem value={'topMarks'}>Top rankers based on Marks</MenuItem>
              <MenuItem value={'absoluteMarks'}>Absolute marks</MenuItem>
          </Select>
        </FormControl>
        {marksFilterContent}
      </div>
      </>
    )
  }
  else{
    // const filterCategory = filterState.category==='Status' ? {status} : {section}
    return (
      <>
      {filterButton}
      <div className='filterContentResetButtonDiv' onClick={resetButtonHandler}><AiOutlineReload /></div>
      <FormControl>
        <RadioGroup
        // value={filterCategory}
          // onChange={radioGroupChangeHandler}
        >
          {filterDrawerContent}
        </RadioGroup>
      </FormControl>
      </>
    )
  }
}

export default FilterDrawerContent