import React from 'react'
import { Drawer, List, ListItem, ListItemButton, ListItemText, FormControl, TextField, Select, InputLabel, MenuItem } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { openFilterDrawer, selectCategory } from '../../features/filter/filterSlice'
import './index.css'
import { useState } from 'react'

function FilterDrawerContent() {
  const filterState = useSelector((state) => state.filter)
  const roundTabState = useSelector((state) => state.roundTab)
  const dispatch = useDispatch()

  const [marksCriteria, setMarksCriteria] = useState('')
  const [marks, setMarks] = useState()

  const marksCriteriaChangeHandler = (event) => {
    setMarksCriteria(event.target.value)
  }

  const marksChangeHandler = (event) => {
    setMarks(event.target.value)
  } 

  let filterDrawerContentList = []
  if(filterState.category=='Round'){
    filterDrawerContentList = roundTabState.round_list.map(round => round['name'])
  }else if(filterState.category=='Section'){
    filterDrawerContentList = roundTabState.current_sections.map(section => section['name'])
  }else if(filterState.category=='Status'){
    filterDrawerContentList = ['Done','Pending']
  }

  if(filterState.category=='Marks'){
    const marksFilterInputLabel = marksCriteria=='topPercentage' ? 'Percentage:' : 'Marks:'
    const marksFilterContent = marksCriteria=='' ?
    <></> :
    (
      <TextField 
        required 
        label={marksFilterInputLabel} 
        type='number'
        value={marks}
        variant='outlined'
        InputProps={{ inputProps: { min: 0 } }}
        fullWidth
        onChange={marksChangeHandler}
        />
    )

    return (
      <>
      <FormControl fullWidth>
        <InputLabel id='type'>Filtering criteria</InputLabel>
        <Select 
        required 
        labelId='criteria' 
        label="Criteria" 
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
    </>
    )
  }else{
    return <div>hello</div>
  }
}

function FilterDrawer() {

  const filterState = useSelector((state) => state.filter)
  const dispatch = useDispatch()

  const closeDrawerHandler = () => {
    dispatch(openFilterDrawer(false))
  }

  function categoryClickHandler(category,index){
    dispatch(selectCategory(category))
    for(let i=0 ; i<categories.length ; i++){
      document.getElementsByClassName('filterCategoryButton')[i].style.backgroundColor= i==index ? '#EEEEEE' : '#F5B041'
    }
  }

  const categories = [
    'Round',
    'Section',
    'Marks',
    'Status'
  ]

  const categoryList = (
    categories.map((category,index) => {
      return (
        <ListItem 
        key={category} 
        disablePadding
        >
          <ListItemButton
          className='filterCategoryButton'
          alignItems='center'
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