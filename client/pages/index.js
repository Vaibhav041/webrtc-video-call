import { useSocket } from "@/context/SocketProvider";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const router = useRouter();

  const handleSubmit = () => {
    socket.emit("room:join", { email, room });
    console.log("submit");
  };

  const handleJoinRoom = (data) => {
    const { email, room } = data;
    router.push(`/room/${room}`);
  };

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);

    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div>
      <h1>Lobby</h1>
      <div>
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter room id"
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={handleSubmit}>Join Room</button>
      </div>
    </div>
  );
}
