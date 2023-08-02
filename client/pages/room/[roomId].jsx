import { useSocket } from "@/context/SocketProvider";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import peer from "@/service/peer";

const RoomPage = () => {
  const socket = useSocket();

  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMySream] = useState();

  const handleUserJoined = (data) => {
    const { email, id } = data;
    console.log(email, id, "userjoined");
    setRemoteSocketId(id);
  };
  const handleCallUser = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMySream(stream);
  };
  const handleIncomingCall = async ({ from, offer }) => {
    console.log(from, offer, "offer");
    setRemoteSocketId(from);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMySream(stream);
    const ans = await peer.getAnswer(offer);
    socket.emit("call:accepted", { to: from, ans });
  };
  const handleCallAccpeted = async ({ from, ans }) => {
    peer.setLocalDescription(ans);
    console.log("call accepted");
  };
  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccpeted);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccpeted);
    };
  }, [socket, handleUserJoined, handleIncomingCall, handleCallAccpeted]);
  return (
    <div>
      <h1>RoomPage</h1>
      <h4>{remoteSocketId ? "connected" : "no one in the room"}</h4>
      {remoteSocketId && <button onClick={handleCallUser}>Call</button>}
      {myStream && (
        <ReactPlayer
          playing
          muted
          height="300px"
          width="300px"
          url={myStream}
        />
      )}
    </div>
  );
};

export default RoomPage;
