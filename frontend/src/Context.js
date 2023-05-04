import React, { createContext, useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
} from "react-router-dom";
import SimplePeer from "simple-peer";
import { useDispatch, useSelector } from "react-redux";

const SocketContext = createContext();

const socket = io("http://localhost:5000");

const configuration = {
    iceServers: [{ urls: ["stun:ss-turn2.xirsys.com"] },
    {
        username: "ze4whgfnMDvaXx5TfTI_gv_TEkTKTZ3bos-EyDL9AUiM8WLqQ1C3egLitrhHt7fkAAAAAF_c86tuaGF2Ym5tMg==",

        credential: "26963e64-415e-11eb-8ab6-0242ac140004",

        urls: ["stun:us-turn7.xirsys.com",
            "turn:us-turn7.xirsys.com:80?transport=udp",
            "turn:us-turn7.xirsys.com:3478?transport=udp",
            "turn:us-turn7.xirsys.com:80?transport=tcp",
            "turn:us-turn7.xirsys.com:3478?transport=tcp",
            "turns:us-turn7.xirsys.com:443?transport=tcp",
            "turns:us-turn7.xirsys.com:5349?transport=tcp"
        ]
    }
    ]
}

let constraints = {
    audio: true,
    video: {
        width: {
            max: 1080
        },
        height: {
            max: 1900
        },
        type: "camera",
        withoutExtension: true
    },

}

constraints.video.facingMode = {
    ideal: "user"
}


const ContextProvider = ({ children }) => {
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState("");
    const [me, setMe] = useState(socket.id);
    const [Peers, setPeers] = useState({});
    const [localStreem, setlocalStreem] = useState(null);
    const [NewPeerQueue, setNewPeerQueue] = useState(null)
    const [RoomID, setRoomID] = useState("")
    const [ChatContents, setChatContents] = useState([])
    const [StreamList, setStreamList] = useState([])

    const myVideo = useRef();
    const userVideo = useRef();
    const peerRef = useRef([]);
    const StreamRef = useRef([]);
    const UserInfo = useSelector((state) => state.User.UserInfo);
    const messageRef = useRef([])
    const [isOpenCamera, setisOpenCamera] = useState(true);
    const [isOpenMic, setisOpenMic] = useState(true)

    const sendMess = (chatContent) =>{
        socket.emit('send_message',{gId:RoomID,name:`${UserInfo.firstName} ${UserInfo.lastName}`,content:chatContent})
        messageRef.current.push({name:"You",time:"", content:chatContent})
        setChatContents([...messageRef.current])
    }
    
// thay doi camera
    const changeStream = (stream) => {
        // console.log(stream.getTracks()[0].kind);
        // const stream  = myVideo.current.srcObject
        // console.log(stream.getTracks()[1].kind);
        peerRef.current.forEach((item) => {
            console.log(item);
            // console.log(item.peer.streams[0].getTracks().find((item)=> item.kind == stream.getTracks()[0].kind));
            // item.peer.replaceTrack(item.peer.streams[0].getTracks().find((item)=> item.kind == stream.getTracks()[0].kind), stream.getTracks()[0], item.peer.streams[0])
            for (let index in item.peer.streams[0].getTracks()) {
                for (let index2 in stream.getTracks()) {
                    if (item.peer.streams[0].getTracks()[index].kind === stream.getTracks()[index2].kind) {
                        item.peer.replaceTrack(item.peer.streams[0].getTracks()[index], stream.getTracks()[index2], item.peer.streams[0])
                        // break;
                    }
                }
            }
        })
    }

    const ShareScreen = () => {
        if (constraints.video.facingMode.ideal === 'user') {
            constraints.video.facingMode.ideal = 'environment'
        } else {
            constraints.video.facingMode.ideal = 'user'
        }



        const tracks = myVideo.current.srcObject.getTracks();
        var isShare = (constraints.video.type == "camera") ? false : true;
        tracks.forEach(function (track) {
            track.stop()
        })

        if (!isShare) {
            navigator.mediaDevices.getDisplayMedia(constraints).then(stream => {
                myVideo.current.srcObject = stream;
                changeStream(stream);
                setlocalStreem(stream);
            })
            constraints.video.type = "screen"
        }
        else {
            navigator.mediaDevices.getUserMedia(constraints).then(stream => {
                myVideo.current.srcObject = stream;
                changeStream(stream);
                setlocalStreem(stream);

            })
            constraints.video.type = "camera"
        }

    }
 
    const RemoveCamera = (()=>{
        if(isOpenCamera){
            const Tracks = myVideo.current.srcObject.getTracks()
            for(let track of Tracks ){
                console.log(track);
                if(track.kind == "video"){
                    track.enabled=!isOpenCamera
                    setisOpenCamera(!isOpenCamera)
                }
            }
        }else{
            const Tracks = myVideo.current.srcObject.getTracks()
            for(let track of Tracks ){
                console.log(track);
                if(track.kind == "video"){
                    track.enabled=!isOpenCamera
                    setisOpenCamera(!isOpenCamera)
                }
            }
        }


    })
    const RemoveMic = (()=>{
        if(isOpenMic){
            const Tracks = myVideo.current.srcObject.getTracks()
            for(let track of Tracks ){
                console.log(track);
                if(track.kind == "audio"){
                    track.enabled=!isOpenMic
                    setisOpenMic(!isOpenMic)
                }
            }
        }else{
            const Tracks = myVideo.current.srcObject.getTracks()
            for(let track of Tracks ){
                console.log(track);
                if(track.kind == "audio"){
                    track.enabled=!isOpenMic
                    setisOpenMic(!isOpenMic)
                }
            }
        }


    })
    useEffect(() => {
        if (!RoomID) return
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((currentStream) => {
                myVideo.current.srcObject = currentStream;
                setlocalStreem(currentStream);
                console.log(myVideo);
                console.log("RoomID", RoomID);

                // init()
            }).catch((err) => {
                console.log(err);
            });
    }, [RoomID]);

    // useEffect(() => {
    //     console.log("StreamList context", StreamList);
    //     console.log("Peers context", Peers);


    //     return () => {

    //     }
    // }, [StreamList, Peers])


    // useEffect(() => {
    //     console.log("current room", RoomID);

    //     return () => {

    //     }
    // }, [RoomID])


    const addPeer = (socket_id, am_init) => {
        console.log("addpeer local" + socket_id == socket.id)

        let peer = new Peer({
            initiator: am_init,
            stream: myVideo.current.srcObject,
            config: configuration
        })
        peer.on('signal', (data) => {
            //console.log(data)
            socket.emit('signal', {
                signal: data,
                socket_id: socket_id
            })
        })
        peer.on('stream', (stream) => {
            // stream.active
            console.log("stream.enabled", stream.enabled);
            console.log("stream.id", stream);
            StreamRef.current.push({ socket_id, stream })
            setStreamList([...StreamRef.current])
        })
        console.log("number Peers", peer)
        peerRef.current.push({ socket_id, peer })

        // setPeers([...peerRef.current])
    }


    useEffect(() => {
        if (localStreem == null) return
        console.log("init");
        socket.on("joinRoomSucess", (data) => {
            if (data != -1) {
                console.log("Join room success");
                // setIsInRoom(true)
                socket.emit("clientReadyGroup", data);
            }
        });

        socket.emit('joinRoom', { gId: RoomID })
        socket.on('initReceive', (socket_id) => {
            console.log('INIT RECEIVE ' + socket_id)
            addPeer(socket_id, false)
            // setNewPeerQueue(socket_id)
            socket.emit('initSend', socket_id)
        })

        socket.on('initSend', socket_id => {
            console.log('INIT SEND ' + socket_id)
            addPeer(socket_id, true)
        })
        socket.on('removePeer', (socket_id) => {
            console.log('romove peer ' + socket_id)
            let listRemoveStream = StreamRef.current.filter((stream) => stream.socket_id == socket_id)
            listRemoveStream.forEach((stream) => {
                const tracks = stream.stream.getTracks()
                tracks.forEach(function (track) {
                    track.stop();
                });
            })
            StreamRef.current = StreamRef.current.filter((stream) => stream.socket_id != socket_id)
            let tmp = Peers
            delete tmp[socket_id]
            setPeers(tmp)
        })
        socket.on('signal', data => {
            // console.log(data)
            const peer = peerRef.current.find((item) => item.socket_id == data.socket_id)
            console.log("signal", peer)

            peer.peer.signal(data.signal)
            // setPeers(Peers)
        })
        socket.on('message', (data) => {
            console.log(data)
            messageRef.current.push({name:data.name,time:data.time, content:data.content})
            setChatContents([...messageRef.current])
        })
        // socket.on('disconnect', ()=>{
        //     console.log('got DISCONNECTED')
        //     for(let socket_id in Peers){
        //         removePeer(socket_id)
        //     }
        // })

        

        return () => {

        }
    }, [localStreem])

    useEffect(() => {

        console.log("current peers list", Peers);
        return () => {

        }
    }, [Peers, RoomID])


    // useEffect(() => {
    //     socket.on('signal', data => {
    //         // console.log(Peers);
    //         console.log("signal", data)
    //         Peers[data.socket_id].signal(data.signal)
    //         // setPeers(Peers)
    //     })

    //     return () => {

    //     }
    // }, [])




    return (
        <SocketContext.Provider
            value={{
                callAccepted,
                myVideo,
                userVideo,
                name,
                setName,
                callEnded,
                me,
                setRoomID,
                StreamList,
                StreamRef,
                ShareScreen,
                ChatContents,
                sendMess,
                RemoveCamera,
                isOpenCamera,
                RemoveMic,
                isOpenMic

            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext };
