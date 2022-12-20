import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'
import './index.css'

function EndSeasonConfirmationDialog(props) {
    const { open, dialogCloseHandler, agreeActionClickHandler } = props

    return (
        <Dialog
        open={open}
        onClose={dialogCloseHandler}
        >
            <DialogTitle>
                End Season?
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Once season has ended, you won't be able to alter the end date.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <button onClick={dialogCloseHandler} className='blueDialogActionButton'>Cancel</button>
                <button onClick={agreeActionClickHandler} autoFocus className='redDialogActionButton'>End</button>
            </DialogActions>
        </Dialog>
    )
}

export default EndSeasonConfirmationDialog