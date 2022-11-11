import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../../../types/socket";
import { users } from "../index";

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    return res.status(500).json({
      message: "Socket.io server is not prepared.",
    });
  }

  if (req.method === "POST") {
    const newUser = req.body;

    users.push(newUser);
    res.socket.server.io.emit("users", users);

    res.status(201).json({});
  } else if (req.method === "DELETE") {
    const target = req.body;

    const targetIndex = users.findIndex((user) => user.id === target.id);
    users.splice(targetIndex, 1);
    res.socket.server.io.emit("users", users);

    res.status(200).json({});
  } else {
    res.status(405).json({
      message: "method should be POST.",
    });
  }
};
