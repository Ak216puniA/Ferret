import React from 'react'
import { FormControl, TextField, Select, InputLabel, MenuItem, FormControlLabel, RadioGroup, Radio, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import './index.css'
import { useState } from 'react'
import { AiOutlineReload } from 'react-icons/ai'
import { setMarks, setMarksCriteria, setSection, setStatus } from '../../features/filter/filterSlice'

function FilterMarksContent() {
  const filterState = useSelector((state) => state.filter)
  const dispatch = useDispatch()

  const marksCriteriaChangeHandler = (event) => {
    dispatch(setMarksCriteria(event.target.value))
  }

  const marksChangeHandler = (event) => {
    dispatch(setMarks(event.target.value))
  }

  const resetButtonHandler = () => {
    dispatch(setMarks(-1))
    dispatch(setMarksCriteria(''))
  }

  const marksFilterInputLabel = filterState.marksCriteria==='topPercentage' ? 'Percentage' : (filterState.marksCriteria==='topMarks' ? 'Top' : 'Marks')
  const marksFilterContent = filterState.marksCriteria==='' ?
  <></> :
  (
    <TextField 
    required 
    labelid='marks'
    label={marksFilterInputLabel} 
    type='number'
    value={filterState.marks}
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
    <div className='filterContentResetButtonDiv' onClick={resetButtonHandler}><AiOutlineReload /></div>
    <div className='marksContentDiv'>
      <FormControl fullWidth>
        <InputLabel id='criteria'>Filtering Criteria</InputLabel>
        <Select 
        required 
        labelid='criteria' 
        label='Filtering Criteria'
        value={filterState.marksCriteria}
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

function FilterSectionContent() {
  const roundTabState = useSelector((state) => state.roundTab)
  const filterState = useSelector((state) => state.filter)
  const dispatch = useDispatch()

  const radioGroupChangeHandler = (event) => { 
    dispatch(setSection(event.target.value))
  }

  const resetButtonHandler = () => {
    dispatch(setSection(-1))
  }

  const filterDrawerSectionContentList = roundTabState.current_sections.map(section => [section['id'],section['name']])
  const filterDrawerSectionContent = filterDrawerSectionContentList.length>0 ?
  filterDrawerSectionContentList.map(section => <FormControlLabel key={section[0]} value={section[0]} control={<Radio />} label={section[1]} />) :
  []

  return (
    <>
    <div className='filterContentResetButtonDiv' onClick={resetButtonHandler}><AiOutlineReload /></div>
    <FormControl>
      <RadioGroup 
      value={filterState.section} 
      onChange={radioGroupChangeHandler}
      >
        {filterDrawerSectionContent}
      </RadioGroup>
    </FormControl>
    </>
  )
}

function FilterStatusContent() {
  const filterState = useSelector((state) => state.filter)
  const dispatch = useDispatch()

  const radioGroupChangeHandler = (event) => { 
    dispatch(setStatus(event.target.value))
  }

  const resetButtonHandler = () => {
    dispatch(setStatus(-1))
  }

  const filterDrawerStatusContentList = [[1,'Done'],[2,'Pending']]
  const filterDrawerStatusContent = filterDrawerStatusContentList.map(status => <FormControlLabel key={status[0]} value={status[0]} control={<Radio />} label={status[1]} />)

  return (
    <>
    <div className='filterContentResetButtonDiv' onClick={resetButtonHandler}><AiOutlineReload /></div>
    <FormControl>
      <RadioGroup
      value={filterState.status}
      onChange={radioGroupChangeHandler}
      >
        {filterDrawerStatusContent}
      </RadioGroup>
    </FormControl>
    </>
  )
}

function FilterDrawerContent() {
  const filterState = useSelector((state) => state.filter)
  const filterDrawerContent = filterState.category==='Marks' ? 
  <FilterMarksContent /> : 
  (filterState.category==='Section' ? <FilterSectionContent /> : <FilterStatusContent />)

  return <>{filterDrawerContent}</>
}

export default FilterDrawerContent