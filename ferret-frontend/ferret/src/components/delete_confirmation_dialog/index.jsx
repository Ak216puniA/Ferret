import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'
import './index.css'

function DeleteConfirmationDialog(props){
    const { open, dialogCloseHandler, agreeActionClickHandler } = props

    return (
        <Dialog
        open={open}
        onClose={dialogCloseHandler}
        >
            <DialogTitle>
                Delete item?
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Item will be deleted forever without any possible recovery.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <button onClick={dialogCloseHandler} className='blueDialogActionButton'>Cancel</button>
                <button onClick={agreeActionClickHandler} autoFocus className='redDialogActionButton'>Delete</button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteConfirmationDialog