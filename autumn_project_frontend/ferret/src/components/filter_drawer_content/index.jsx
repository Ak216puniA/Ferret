import React from 'react'
import { FormControl, TextField, Select, InputLabel, MenuItem, FormControlLabel, RadioGroup, Radio } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import './index.css'
import { useState } from 'react'
import { GrPowerReset } from 'react-icons/gr'

function FilterDrawerContent() {
  const filterState = useSelector((state) => state.filter)
  const roundTabState = useSelector((state) => state.roundTab)
  const dispatch = useDispatch()

  const [marksCriteria, setMarksCriteria] = useState('')
  const [marks, setMarks] = useState()
  const [round, setRound] = useState('')
  const [section, setSection] = useState('')
  const [status, setStatus] = useState('')

  const marksCriteriaChangeHandler = (event) => {
    setMarksCriteria(event.target.value)
  }

  const marksChangeHandler = (event) => {
    setMarks(event.target.value)
  }

  const radioGroupChangeHandler = (event) => {
    if(filterState.category==='Round'){
      setRound(event.target.value)
    }else if(filterState.category==='Section'){
      setSection(event.target.value)
    }else if(filterState.category==='Status'){
      setStatus(event.target.value)
    }
  }

  const resetButtonHandler = () => {
    if(filterState.category==='Round'){
      setRound('')
    }else if(filterState.category==='Section'){
      setSection('')
    }else if(filterState.category==='Status'){
      setStatus('')
    }
  }

  let filterDrawerContentList = []
  if(filterState.category==='Round'){
    filterDrawerContentList = roundTabState.round_list.map(round => round['name'])
  }else if(filterState.category==='Section'){
    filterDrawerContentList = roundTabState.current_sections.map(section => section['name'])
  }else if(filterState.category==='Status'){
    filterDrawerContentList = ['Done','Pending']
  }

  const filterDrawerContent =  filterDrawerContentList.length>0 ? 
  filterDrawerContentList.map((data) => <FormControlLabel key={data} value={data} control={<Radio />} label={data} />) :
  []

  if(filterState.category==='Marks'){
    const marksFilterInputLabel = marksCriteria==='topPercentage' ? 'Percentage' : 'Marks'
    const marksFilterContent = marksCriteria==='' ?
    <></> :
    (
      <TextField 
      required 
      labelId='marks'
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
      <div className='filterContentResetButtonDiv' onClick={resetButtonHandler}><GrPowerReset /></div>
      <div className='marksContentDiv'>
        <FormControl fullWidth>
          <InputLabel id='criteria'>Filtering Criteria</InputLabel>
          <Select 
          required 
          labelId='criteria' 
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
    return (
      <>
      <div className='filterContentResetButtonDiv' onClick={resetButtonHandler}><GrPowerReset /></div>
      <FormControl>
        <RadioGroup
          onChange={radioGroupChangeHandler}
        >
          {filterDrawerContent}
        </RadioGroup>
      </FormControl>
      </>
    )
  }
}

export default FilterDrawerContent