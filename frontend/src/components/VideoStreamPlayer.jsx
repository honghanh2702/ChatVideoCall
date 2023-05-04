import { VideoHTMLAttributes, useEffect, useRef, useState, useCallback } from 'react'

export default function VideoStreamPlayer({ stream, ...props }) {
  const streamRef = useRef()

  useEffect(() => {
    console.log("stream",stream);
    streamRef.current.srcObject = stream
    console.log(stream.getTracks());
    return () => {
      
    }
  }, [stream])
  

  return (
    <>
      <video ref={streamRef} autoPlay {...props} />
    </>
  );
}