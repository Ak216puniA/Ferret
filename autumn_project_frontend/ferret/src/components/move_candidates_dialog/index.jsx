import React from "react";
import './index.css';
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { closeMoveCandidatesDialog, moveCandidates } from '../../features/seasonRoundContent/seasonRoundContentSlice'
import { GrClose } from "react-icons/gr";
import { useState } from "react";

function MoveCandidatesDialog(props) {
    const { wsSeasonRounds } = props
    const roundTabState = useSelector((state) => state.roundTab)
    const seasonRoundContentState = useSelector((state) => state.seasonRoundContent)
    const dispatch = useDispatch()

    const moveFromRoundId = roundTabState.currentTabId

    const [moveToRoundId, setMoveToRoundId] = useState('')

    const moveToRoundChangehandler = (e) => {
        setMoveToRoundId(e.target.value)
    }

    const moveSelectedCandidates = () => {
        if(moveToRoundId!==''){
            wsSeasonRounds.send(
                JSON.stringify(
                    {
                        candidate_list: seasonRoundContentState.move_candidate_list,
                        next_round_id: moveToRoundId,
                        current_round_id: moveFromRoundId 
                    }
                )
            )
        }
        // dispatch(
        //     moveCandidates({
        //         candidate_list: seasonRoundContentState.move_candidate_list,
        //         next_round_id: moveToRoundId,
        //         current_round_id: moveFromRoundId
        //     })
        // )
    }

    let moveToRoundList = roundTabState.round_list.length>0 ?
    roundTabState.round_list.map(round => {
        if(round['id']!=moveFromRoundId) return <MenuItem key={round['id']} value={round['id']}>{round['name']}</MenuItem>
    }) :
    []

    return (
        <Dialog 
        open={seasonRoundContentState.open_move_dialog}
        onClose={() => dispatch(closeMoveCandidatesDialog())}
        className='dialog'
        PaperProps={{ sx: { width: "20%", position: "fixed", bottom: "48px", right: "44px" } }}
        >
            <div className='crossDiv' onClick={() => dispatch(closeMoveCandidatesDialog())}><GrClose size={12}/></div>
            <DialogTitle>Move candidates to round</DialogTitle>
            <DialogContent>
                <div className='fieldsDiv'>
                    <div className='field'>
                        <FormControl fullWidth>
                            <InputLabel id='assignee'>Round</InputLabel>
                            <Select 
                            required 
                            labelId='round' 
                            label="Round" 
                            value={moveToRoundId}
                            variant='outlined'
                            onChange={moveToRoundChangehandler}
                            >
                                {moveToRoundList}
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <div className='createButtonDiv'>
                    <button 
                    className='createButton' 
                    onClick={moveSelectedCandidates}
                    >
                        Move
                    </button>
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default MoveCandidatesDialog