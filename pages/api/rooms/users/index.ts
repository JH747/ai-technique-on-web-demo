import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../../../types/socket";
import { User } from "../../../../types/user";

let users: User[] = [];

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    return res.status(500).json({
      message: "Socket.io server is not prepared.",
    });
  }

  if (req.method === "POST") {
    const newUser = req.body;

    // add user
    users = [...users, newUser];
    res.socket.server.io.emit("users", users);

    res.status(201).json({});
  } else if (req.method === "DELETE") {
    const target = req.body;

    if (target.id === "ALL") {
      // delete all users
      users = [];
    } else {
      // delete user
      users = users.filter((user) => user.id !== target.id);
    }

    res.socket.server.io.emit("users", users);
    res.status(200).json({});
  } else if (req.method === "PATCH") {
    const target = req.body;

    // update user
    users = users.map((user) => (user.id === target.id ? target : user));
    res.socket.server.io.emit("users", users);

    // determine dominant speaker
    const dominantScore = Math.max(
      ...users.map((user) => user.score).filter((score) => score >= 0.5)
    );
    const dominantUser = isFinite(dominantScore)
      ? users.find((user) => user.score === dominantScore)
      : null;
    res.socket.server.io.emit("dominantUser", dominantUser);

    res.status(200).json({});
  } else {
    res.status(405).json({
      message: "method should be POST.",
    });
  }
};
