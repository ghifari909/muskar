import { io } from "socket.io-client";
const URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
const socket = io(URL, { transports: ["websocket", "polling"] });
export default socket;