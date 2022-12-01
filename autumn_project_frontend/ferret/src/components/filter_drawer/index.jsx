import React from 'react'
import { Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { openFilterDrawer, selectCategory } from '../../features/filter/filterSlice'
import './index.css'
import FilterDrawerContent from '../filter_drawer_content'
import { AiOutlineReload } from 'react-icons/ai'

function FilterDrawer() {
    const filterState = useSelector((state) => state.filter)
    const dispatch = useDispatch()

    const closeDrawerHandler = () => {
        dispatch(openFilterDrawer(false))
    }

    function categoryClickHandler(category,index){
        console.log(category)
        dispatch(selectCategory(category))
        for(let i=0 ; i<categories.length ; i++){
        document.getElementsByClassName('filterCategoryButton')[i].style.backgroundColor = i===index ? '#EEEEEE' : '#F5B041'
        }
    }

    const categories = [
        // 'Round',
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
                <div className='filterDrawerLeftDiv'>
                    <div className='filterDrawerResetButtonDiv'>
                        <div className='filterButton'><AiOutlineReload className='filterIcon' size={20} /></div>
                    </div>
                    <div className='filterDrawerCategoryDiv'>
                        <List>
                            {categoryList}
                        </List>
                    </div>
                </div>
                <div className='filterDrawerCategoryContentDiv'>
                <FilterDrawerContent />
                </div>
            </div>
        </Drawer>
    )
}

export default FilterDrawer