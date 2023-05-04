
import { Button, Grid, Paper } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import 'animate.css';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Image } from '@mui/icons-material';
function CardIntroduce() {
    return (

        <div>
            <h1 style={{
                textAlign: "left",
                color: "aquamarine",
                marginTop: 185,
                fontSize: 60,
                marginLeft: 157
            }} class="animate__animated animate__backInDown">HAPPY MEETING</h1><br />
            <h1 style={{
                textAlign: "left",
                color: "antiquewhite",
                fontSize: 40,
                marginLeft: 157
            }} class="animate__animated animate__backInDown">Bring The World Closer To You</h1><br />
            <Button href="/createVideo/123" style={{
                width: 250,
                marginRight: "62%",
            backgroundColor: "cadetblue",
    color: "white "}} variant='outlined'>Try it </Button>
        </div >

    )
}

export default CardIntroduce