import React, { useState } from 'react'
import { FormControl, TextField, Select, InputLabel, MenuItem, FormControlLabel, RadioGroup, Radio } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useDispatch, useSelector } from 'react-redux'
import './index.css'
import { AiOutlineReload } from 'react-icons/ai'
import { fetchAssigneeQuestionList, setAssignee, setDate, setMarks, setMarksCriteria, setQuestion, setQuestionStatus, setSection, setStatus, setTime } from '../../features/filter/filterSlice'
import { useEffect } from 'react'
import { fetchUsers } from '../../features/user/userSlice'

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
    <div className='categoryContentDiv'>
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
    <div className='categoryContentDiv'>
      <FormControl>
        <RadioGroup 
        value={filterState.section} 
        onChange={radioGroupChangeHandler}
        >
          {filterDrawerSectionContent}
        </RadioGroup>
      </FormControl>
    </div>
    </>
  )
}

function FilterStatusContent() {
  const filterState = useSelector((state) => state.filter)
  const roundTabState = useSelector((state) => state.roundTab)
  const dispatch = useDispatch()

  const radioGroupChangeHandler = (event) => { 
    dispatch(setStatus(event.target.value))
  }

  const resetButtonHandler = () => {
    dispatch(setStatus(''))
  }

  const filterDrawerStatusContentList = roundTabState.currentTabType==='test' ? 
  [['done','Done'],['pending','Pending']] :
  [['done','Done'],['pending','Pending'],['not_notified','Not Notified'],['notified','Notified'],['waiting_room','In Waiting Room'],['interview','In Interview']]
  const filterDrawerStatusContent = filterDrawerStatusContentList.map(status => <FormControlLabel key={status[0]} value={status[0]} control={<Radio />} label={status[1]} />)

  return (
    <>
    <div className='filterContentResetButtonDiv' onClick={resetButtonHandler}><AiOutlineReload /></div>
    <div className='categoryContentDiv'>
      <FormControl>
        <RadioGroup
        value={filterState.status}
        onChange={radioGroupChangeHandler}
        >
          {filterDrawerStatusContent}
        </RadioGroup>
      </FormControl>
    </div>
    </>
  )
}

function FilterTimeSlotContent() {
  const dispatch = useDispatch()

  const [filterDate, setFilterDate] = useState(null)
  const [filterTime, setFilterTime] = useState(null)

  const resetButtonHandler = () => {
    setFilterDate(null)
    setFilterTime(null)
    dispatch(setDate(''))
    dispatch(setTime(''))
  }

  const dateChangeHandler = (date) => {
    setFilterDate(date)
    const month = date['$M']+1>9 ? date['$M']+1 : `0${date['$M']+1}`
    const day = date['$D']>9 ? date['$D'] : `0${date['$D']}`
    dispatch(setDate(`${date['$y']}-${month}-${day}`))
  }

  const timeChangeHandler = (time) => {
    setFilterTime(time)
    const hour = time['$H']>9 ? time['$H'] : `0${time['$H']}`
    const minute = time['$m']>9 ? time['$m'] : `0${time['$m']}`
    dispatch(setTime(`${hour}:${minute}`))
  }

  return (
    <>
      <div className='filterContentResetButtonDiv' onClick={resetButtonHandler}><AiOutlineReload /></div>
      <div className='categoryContentDiv'>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className='timeSlotCategoryContentDiv'>
            <div className='timeSlotCategoryContentField'>
              <DesktopDatePicker
              fullWidth
              label="Filter Date"
              inputFormat="YYYY-MM-DD"
              value={filterDate}
              onChange={dateChangeHandler}
              renderInput={(params) => <TextField {...params} />}
              />
            </div>
            <div className='timeSlotCategoryContentField'>
              <TimePicker
              fullWidth
              label="Filter Time"
              value={filterTime}
              onChange={timeChangeHandler}
              renderInput={(params) => <TextField {...params} />}
              />
            </div>
          </div>
        </LocalizationProvider>
      </div>
    </>
  )
}

function FilterCheckingModeContent() {
  const userState = useSelector((state) => state.user)
  const filterState = useSelector((state) => state.filter)
  const roundTabState = useSelector((state) => state.roundTab)
  const dispatch = useDispatch()

  const resetButtonHandler = () => {
    dispatch(setAssignee(''))
    dispatch(setQuestionStatus(''))
    dispatch(setQuestion(''))
    dispatch(fetchUsers(3))
  }

  const assigneeChangeHandler = (event) => {
    dispatch(setAssignee(event.target.value))
  }

  const questionStatusChangeHandler = (event) => {
    dispatch(setQuestionStatus(event.target.value))
  }

  const questionChangeHandler = (event) => {
    dispatch(setQuestion(event.target.value))
  }

  const assigneeList = userState.users.length>0 ?
  userState.users.map(user => <MenuItem key={user['id']} value={user['id']}>{user['name']} - {user['username']}</MenuItem>) :
  []

  let assigneeQuestionList = filterState.assigneeQuestionList.length>0 ?
  filterState.assigneeQuestionList.map(question => {
    return (
      <MenuItem 
      style={{
        whiteSpace: 'normal',
        maxWidth: '48em'
      }} 
      key={question['id']} 
      value={question['id']}
      >
        {question['text']}
      </MenuItem>
    )
  }) :
  []

  let anyQuestionOption = filterState.assigneeQuestionList.length>1 ? <MenuItem value={0}>Any question*</MenuItem> : []

  let questionStatusField = filterState.assignee!=='' ?
  <FormControl
  fullWidth
  sx={{
    marginTop: '5%'
  }}
  >
    <InputLabel id='questionStatus'>Question Status</InputLabel>
    <Select 
    fullWidth
    required 
    labelid='questionStatus' 
    label='Question Status'
    value={filterState.questionStatus}
    placeholder='Question status' 
    variant='outlined'
    onChange={questionStatusChangeHandler}
    >
        <MenuItem value={'checked'}>Checked</MenuItem>
        <MenuItem value={'unchecked'}>Unchecked</MenuItem>
    </Select>
  </FormControl> :
  <></>

  let questionField = filterState.assignee!=='' && filterState.questionStatus!=='' ?
  <FormControl 
  fullWidth
  sx={{
    marginTop: '5%'
  }}
  >
    <InputLabel id='question'>Question</InputLabel>
    <Select 
    fullWidth
    required 
    labelid='question' 
    label='Question'
    value={filterState.question}
    placeholder='Question' 
    variant='outlined'
    onChange={questionChangeHandler}
    >
        {assigneeQuestionList}
        {anyQuestionOption}
    </Select>
  </FormControl> :
  <></>

  useEffect(() => {
    dispatch(
      fetchAssigneeQuestionList({
        roundId: roundTabState.currentTabId,
        assigneeId: filterState.assignee,
        status: filterState.questionStatus
      })
    )
  },[filterState.assignee, filterState.questionStatus])

  return (
    <>
    <div className='filterContentResetButtonDiv' onClick={resetButtonHandler}><AiOutlineReload /></div>
    <div className='categoryContentDiv'>
      <FormControl fullWidth>
        <InputLabel id='assignee'>Assignee</InputLabel>
        <Select 
        required 
        labelid='assignee' 
        label='Assignee'
        value={filterState.assignee}
        placeholder='Assignee' 
        variant='outlined'
        onChange={assigneeChangeHandler}
        >
            {assigneeList}
        </Select>
      </FormControl>
      {questionStatusField}
      {questionField}
    </div>
    </>
  )
}

function FilterDrawerContent() {
  const filterState = useSelector((state) => state.filter)
  let filterDrawerContent = <></>

  switch(filterState.category) {
    case 'Marks':
      filterDrawerContent =  <FilterMarksContent />
      break
    case 'Section':
      filterDrawerContent =  <FilterSectionContent />
      break
    case 'Status':
      filterDrawerContent =  <FilterStatusContent />
      break
    case 'Checking Mode':
      filterDrawerContent = <FilterCheckingModeContent />
      break
    case 'Time Slot':
      filterDrawerContent = <FilterTimeSlotContent />
      break
    default:
      filterDrawerContent =  <div className='noFilterContentDiv'>No filter selected!</div>
  }

  return <>{filterDrawerContent}</>
}

export default FilterDrawerContent