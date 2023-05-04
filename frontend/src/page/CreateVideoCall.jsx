import { BottomNavigation, BottomNavigationAction, Button, Card, Grid, Modal, Paper, TextField } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Home from './Home'
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicNoneIcon from '@mui/icons-material/MicNone';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { SocketContext } from '../Context';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
} from "react-router-dom";
import VideoStreamPlayer from '../components/VideoStreamPlayer';
import MicIcon from '@mui/icons-material/Mic';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import HandymanIcon from '@mui/icons-material/Handyman';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from '../api/AnomalyAPI';
import { setUser } from '../features/Table/UserSlice';


const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", (stream) => {
            console.log("video stream", stream);
            ref.current.srcObject = stream;
        });
    }, []);

    return (
        <video width={100} style={{ background: "gray", zIndex: 100000, width: "100%" }} height={100} autoPlay ref={ref} className="bg-video-tag" />
    );
};

function CreateVideoCall({ }) {
    const [value, setValue] = useState("recents")
    const {
        StreamRef,
        Peers,
        name,
        callAccepted,
        myVideo,
        userVideo,
        callEnded,
        setRoomID,
        StreamList,
        ShareScreen,
        ChatContents,
        sendMess,
        RemoveCamera,
        isOpenCamera,
        RemoveMic,
        isOpenMic
    } = useContext(SocketContext)
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [LocalStreamList, setLocalStreamList] = useState([])
    const [RID, setRID] = useState(useParams().roomID)
    const [ElementStream, setElementStream] = useState([])
    const [ChatContentInput, setChatContentInput] = useState("")
    useEffect(() => {
        // console.log(RID);
        setRoomID(RID)
        return () => {

        }
    }, [RID])

    const dispatch = useDispatch()
    const UserInfo = useSelector((state) => state.User.UserInfo);
    useEffect(() => {
        if (localStorage.getItem("token")) {
            const handleLogin = async () => {
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

    useEffect(() => {
        console.log("StreamList", StreamRef.current);
        setLocalStreamList([...StreamRef.current])
        return () => {

        }
    }, [StreamRef.current])


    const BigVideoRef = useRef()
    const style = {
        width: 100,
        height: 100,
        // position: 'ab',
        top: '4%',
        left: '5%',
        transform: 'translate(-100%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,

    };

    const HandleSelectVideo = (video) => {
        console.log(video);
        BigVideoRef.current.srcObject = video.target.srcObject
        console.log(BigVideoRef);
    }

    const handleKeyDownSend = (event) => {
        if (event.key === 'Enter') {
            console.log('do validate')
            setChatContentInput("")
            sendMess(event.target.value)
        }
    }

    return (
        <div style={{ background: "black",overflowY:"hidden" }}>
            <Grid container justifyContent={"center"}>
                <Grid item md={1} style={{ paddingTop: 0 }}>
                    <video onClick={HandleSelectVideo} width={100} style={{ background: "gray", zIndex: 100000, width: "100%" }} height={100} muted ref={myVideo} autoPlay />
                       {StreamRef.current.map((item) => (<VideoStreamPlayer width={100}
                        height={100} key={item.socket_id} onClick={HandleSelectVideo} stream={item.stream} />))}

                </Grid>
                <Grid item md={9}>
                    <video style={{ background: "black", height: "100vh", width: "100%" }} muted ref={BigVideoRef} autoPlay />
                </Grid>
                <Grid style={{overflow:"none",maxHeight:"100vh"  }} item md={2}>
                    <div style={{ background: "white", padding: 2, textAlign: "center",fontSize:18}}>
                        In-call messages
                    </div>
                    <div style={{ background: "white", padding: 2, textAlign: "left", height: "90%", paddingLeft: 10 }}>
                        {ChatContents.map((item) => (<div>
                            <br />
                            <strong>{item.name}</strong> <i>{item.time}</i>
                            
                            <br />
                            <p>{item.content}</p>
                        </div>))}
                    </div>
                    <div style={{ background: "white", padding: 2, textAlign: "center" }}>
                        <TextField style={{ marginTop:1 }} value={ChatContentInput}
                            onChange={(event) => { setChatContentInput(event.target.value) }}
                            fullWidth size='small' onKeyDown={handleKeyDownSend}></TextField>
                    </div>
                </Grid>
            </Grid>
           
            <Paper variant="outlined" square
                elevation={10}
                style={{
                    height: 60,
                    width: "40%",
                    background: "white",
                    justifyContent: "center",
                    textAlign: "center",
                    position: "fixed",
                    bottom: 40,
                    left: "25%",
                    borderRadius: 30,
                    marginTop:10
                }} >
                <Grid container
                    direction={"row"}
                    justifyContent="center"
                    alignItems={"center"}
                    style={{ height: "100%" }}
                >
                    <Grid item md={2}>
                        <Button onClick={RemoveMic}>{isOpenMic?<MicIcon />:<MicOffIcon color='error'/>}</Button>
                    </Grid>
                    <Grid item md={2}>
                        <Button onClick={RemoveCamera} color='info'>{isOpenCamera?<VideocamIcon />:<VideocamOffIcon color='error'/>}</Button>
                    </Grid>
                    <Grid item md={2}>
                        <Button onClick={ShareScreen}><FitScreenIcon /></Button>
                    </Grid>
                    <Grid item md={2}>
                        <Button href='/' color='error'><PhoneDisabledIcon /></Button>
                    </Grid>
                    <Grid item md={2}>
                        <Button><HandymanIcon /></Button>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    )
}

export default CreateVideoCall