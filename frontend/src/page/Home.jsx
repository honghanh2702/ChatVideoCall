import { Button, Card, Grid } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import Add from '@mui/icons-material/Add';
import CardIntroduce from './CardIntroduce';
import LogIn from './LogIn';
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from '../api/AnomalyAPI';
import { setUser } from '../features/Table/UserSlice';


function Home() {
  const [ModalOpen, setModalOpen] = useState(false)
  const handleOpen = () => {
    setModalOpen(true);
  }
  const dispatch = useDispatch()
  const UserInfo = useSelector((state) => state.User.UserInfo);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const handleLogin = async ()=>{
        try {
          const rs = await getUserInfo({})
          console.log('====================================');
          console.log(rs);
          console.log('====================================');
          // localStorage.setItem("token",rs.data.data.token)
          dispatch(setUser(rs.data.data))
        } catch (error) {
          console.log('====================================');
          console.log(error);
          console.log('====================================');
        }
      }
      handleLogin()
    }
  
    return () => {
      
    }
  }, [])
  
  const logout = ()=>{
    localStorage.setItem("token", null)
    window.location.reload();
  }

  return (
    <div>
      <Card variant="outlined"
        row
        sx={{
          '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
        }}>
        <Grid container alignItems={"center"} direction={"row"}>
          <Grid item md={1}>
            <div style={{
              backgroundImage: `url(/happmeting.webp)`, width: 71, height: 85, marginLeft: 18, backgroundPosition: 'center',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat'
            }}></div>
          </Grid>
          <Grid style={{ marginTop: "0%", marginLeft: "-8%", color: "chocolate" }} item md={3}>
            <b>HAPPY MEETING</b>
          </Grid>
          <Grid style={{ marginTop: "2%", marginLeft: "-8%", color: "chocolate" }} item md={7}>
          </Grid>
          {UserInfo._id == undefined ?

            <Grid item md={2}>
              <Button onClick={handleOpen} setisOpen={setModalOpen} isOpen={ModalOpen}
                style={{ color: "dodgerblue", fontFamily: "system-ui", fontSize: 15, height: 38, backgroundColor: "white" }} variant="outlined">SIGN IN</Button>

              <Button
                style={{ marginLeft:20,justifySelf:"right",display: "inline-block", fontSize: 14, height: 38, color: "white", backgroundColor: "dodgerblue", fontFamily: "system-ui" }}
                variant="outlined">SIGN UP</Button>

              <LogIn setisOpen={setModalOpen} isOpen={ModalOpen} />
            </Grid> :
            <Grid item md={2}>
              <div style={{ textAlign: 'center' }}><strong>{UserInfo.lastName} {UserInfo.firstName}</strong></div>
              <Button style={{ color: "white", fontFamily: "system-ui", fontSize: 10, height: 30, backgroundColor: "red" }} variant="outlined" onClick={logout}>Log out</Button>
            </Grid>

          }


        </Grid>
      </Card>

      <CardIntroduce />
    </div>


  )
}

export default Home