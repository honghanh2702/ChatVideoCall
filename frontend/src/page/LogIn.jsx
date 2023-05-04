import { Box, Button, Modal, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { login } from '../api/AnomalyAPI';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from '../features/Table/UserSlice';

function LogIn({ setisOpen, isOpen }) {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius:2,
    transform: 'translate(-50%, -50%)',
    background: "linear-gradient(140deg, #EADEDB 0%, #BC70A4 50%, #BFD641 75%)"
  };
  const [open, setOpen] = useState(false)
  const [Username, setUsername] = useState("")
  const [Password, setPassword] = useState("")

  const dispatch = useDispatch()

  useEffect(() => {
    setOpen(isOpen)
  
    return () => {
      
    }
  }, [isOpen])
  
  const handleOpen = (setisOpen) => {
    setOpen(true)
    setisOpen(true)
  }
  const handleClose = () => {
    setOpen(false);
    setisOpen(false)
  };



  const handleLogin = async ()=>{
    try {
      const rs = await login({"username":Username,"password":Password})
      console.log('====================================');
      console.log(rs);
      console.log('====================================');
      localStorage.setItem("token",rs.data.data.token)
      dispatch(setUser(rs.data.data))
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
  }

  return (

    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography style={{textAlign:"center"}} id="modal-modal-title" variant="h6" component="h2">
            <b>SIGN IN</b>
          </Typography>
          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography> */}
          <br/>
          <TextField value={Username} onChange={(event)=>{setUsername(event.target.value)}} variant='outlined' size='small' label='Username' fullWidth/>
          <br/>
          <br/>
          <TextField  id="standard-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="outlined" onChange={(event)=>{setPassword(event.target.value)}} size='small' fullWidth/>
          <br/>
          <br/>
          <Button size='small' fullWidth onClick={handleLogin} variant='contained'>login</Button>
        </Box>
      </Modal>

    </div>
  )
}

export default LogIn