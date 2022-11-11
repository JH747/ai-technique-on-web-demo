import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { User } from "../../types/user";
import UI from "../../components/room/UI";

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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(meRef.current),
    }).catch((error) => console.log(error));
  };

  const updateScore = async () => {
    fetch("/api/rooms/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: meRef.current?.id,
        score: Number(Math.random().toFixed(6)),
      }),
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
    socket.on("disconnect", () => {
      removeUser().then();
    });
    socket.on("users", (users: User[]) => {
      setUsers(users);
    });
    socket.on("dominantUser", (dominantUser: User | null) => {
      setDominantUser(dominantUser);
    });

    window.addEventListener("beforeunload", () => {
      removeUser().then();
    });

    let interval = setInterval(() => {
      // TODO: model.predict 값 계산
      updateScore().then();
    }, 2000);

    return () => {
      // socket disconnect on component unmount if exists
      socket?.disconnect();
      clearInterval(interval);
    };
  }, [addNewUser]);

  return (
    <main style={{ margin: 16 }}>
      <UI users={users} me={meRef.current} dominantUser={dominantUser} />
    </main>
  );
}
