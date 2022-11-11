import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { User } from "../../types/user";
import { Grid, Card, Text } from "@nextui-org/react";

export default function Room() {
  const meRef = useRef<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [dominantUser, setDominantUser] = useState<User | null>(null);

  const addNewUser = useCallback(async () => {
    const {
      words: { 0: id },
    } = (await (
      await fetch("/nickname/?format=json&max_length=8")
    ).json()) as any;

    const me = { id, score: 0 };
    meRef.current = me;

    fetch("/api/rooms/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(me),
    }).catch((error) => console.log(error));
  }, []);

  const removeUser = async () => {
    fetch("/api/rooms/users", {
      method: "DELETE",
      body: JSON.stringify(meRef.current),
    }).catch((error) => console.log(error));
  };

  useEffect((): any => {
    // connect to socket server
    const socket = io({ path: "/api/rooms/socketio" });

    // log socket connection
    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id);
      // add user
      addNewUser().then();
    });
    // update chat on new message dispatched
    socket.on("users", (users: User[]) => {
      setUsers(users);
    });
    socket.on("disconnect", () => {
      removeUser().then();
    });
    window.addEventListener("beforeunload", () => {
      removeUser().then();
    });

    return () => {
      // socket disconnect on component unmount if exists
      socket?.disconnect();
    };
  }, [addNewUser]);

  return (
    <main style={{ margin: 16 }}>
      <p style={{ textAlign: "center" }}>
        Me: {meRef.current?.id}
        <br />
        Dominant Speaker:{" "}
        {dominantUser ? (
          <span>
            {dominantUser.id}({dominantUser.score})
          </span>
        ) : (
          "None"
        )}
      </p>
      <Grid.Container gap={2} justify="center">
        {users.map((user) => (
          <Grid sm={6} xs={12} key={user.id}>
            <Card
              css={{
                h: "$20",
                $$cardColor:
                  user.id === meRef.current?.id
                    ? "$colors$gradient"
                    : user.id === dominantUser?.id
                    ? "$colors$success"
                    : "$colors$primary",
              }}
            >
              <Card.Body>
                <Text h6 size={15} color="white" css={{ m: 0 }}>
                  {`${user.id}: ${user.score}`}
                </Text>
              </Card.Body>
            </Card>
          </Grid>
        ))}
      </Grid.Container>
    </main>
  );
}
