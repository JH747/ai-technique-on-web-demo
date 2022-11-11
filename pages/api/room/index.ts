import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../../types/socket";

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    return res.status(500).json({
      message: "Socket.io server is not prepared.",
    });
  }

  if (req.method === "POST") {
    const message = req.body;
    res.socket.server.io.emit("message", message);

    res.status(201).json(message);
  } else {
    res.status(405).json({
      message: "method should be POST.",
    });
  }
};
