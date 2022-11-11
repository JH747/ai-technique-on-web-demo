import { Grid, Card, Text } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { User } from "../../types/user";

import { io } from "socket.io-client";

const mockUsers = [
  { id: "1", name: "1", score: 0.13 },
  { id: "2", name: "2", score: 0.2124 },
  { id: "3", name: "3", score: 0.365 },
  { id: "4", name: "4", score: 0.36 },
];

export default function Room() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [dominantUser, setDominantUser] = useState<User | null>(null);

  useEffect((): any => {
    // connect to socket server
    const socket = io({ path: "/api/room/socketio" });

    // log socket connection
    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id);
    });

    // update chat on new message dispatched
    socket.on("message", (message: any) => {
      console.log(message);
    });

    // socket disconnect on component unmount if exists
    if (socket) return () => socket.disconnect();
  }, []);

  useEffect(() => {
    setInterval(() => {
      setDominantUser(users[Math.floor(Math.random() * users.length)]);
      fetch("/api/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: 1, score: Math.random() }),
      }).catch((error) => console.log(error));
    }, 3000);
  }, [users]);

  const MockItem = ({
    text,
    highlight,
  }: {
    text: string;
    highlight: boolean;
  }) => {
    return (
      <Card
        css={{
          h: "$20",
          $$cardColor: highlight ? "$colors$success" : "$colors$primary",
        }}
      >
        <Card.Body>
          <Text h6 size={15} color="white" css={{ m: 0 }}>
            {text}
          </Text>
        </Card.Body>
      </Card>
    );
  };
  return (
    <main style={{ margin: 16 }}>
      <p style={{ textAlign: "center" }}>
        Dominant Speaker:{" "}
        {dominantUser ? (
          <span>
            {dominantUser.name}({dominantUser.score})
          </span>
        ) : (
          "None"
        )}
      </p>
      <Grid.Container gap={2} justify="center">
        {users.map((user) => (
          <Grid sm={6} xs={12} key={user.id}>
            <MockItem
              text={`${user.name}: ${user.score}`}
              highlight={user.id === dominantUser?.id}
            />
          </Grid>
        ))}
      </Grid.Container>
    </main>
  );
}
