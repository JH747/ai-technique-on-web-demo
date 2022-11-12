import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import * as tf from "@tensorflow/tfjs";
import { LayersModel } from "@tensorflow/tfjs";
import { User } from "../../types/user";
import UI from "../../components/room/UI";
import { Button } from "@nextui-org/react";

export default function Room() {
  const meRef = useRef<User | null>(null);
  const modelRef = useRef<LayersModel | null>(null);
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

    await fetch("/api/rooms/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(me),
    }).catch((error) => console.log(error));
  }, []);

  const removeUser = async () => {
    await fetch("/api/rooms/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(meRef.current),
    }).catch((error) => console.log(error));
  };

  const updateScore = async (score: number) => {
    await fetch("/api/rooms/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: meRef.current?.id,
        score,
      }),
    }).catch((error) => console.log(error));
  };

  const resetRoom = useCallback(async () => {
    const promises = users.map((user) =>
      fetch("/api/rooms/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: "ALL" }),
      }).catch((error) => console.log(error))
    );
    await Promise.all(promises);
  }, [users]);

  const loadModel = useCallback(async () => {
    modelRef.current = await tf.loadLayersModel(
      "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json"
    );
    return modelRef.current;
  }, []);

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
      removeUser().then(() => {
        window.location.reload();
      });
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

    // load model & predict
    loadModel().then(async (model) => {
      try {
        const mic = await tf.data.microphone({
          fftSize: 1024,
          columnTruncateLength: 232,
          numFramesPerSpectrogram: 21,
          sampleRateHz: new AudioContext().sampleRate as 44100 | 48000,
          includeSpectrogram: true,
          includeWaveform: false,
        });

        for (let count = 0; count < 100; count += 1) {
          console.time();
          const audioData = await mic.capture();
          const spectrogramTensor = audioData.spectrogram;
          spectrogramTensor?.print();
          // model.predict(spectrogramTensor);
          const score = Number(Math.random().toFixed(6));
          await updateScore(score);
          console.timeEnd(); // NOTE: 약 0.5초
        }
        mic.stop();
      } catch (e) {
        console.error(e, "microphone is blocked");
      }
    });

    return () => {
      // socket disconnect on component unmount if exists
      socket?.disconnect();
    };
  }, [addNewUser, loadModel]);

  return (
    <main style={{ margin: 16 }}>
      <Button
        css={{ margin: "8px auto", backgroundColor: "$colors$secondary" }}
        size={"xs"}
        onClick={() => {
          resetRoom().then(() => {
            window.location.reload();
          });
        }}
      >
        Reset room
      </Button>
      <UI users={users} me={meRef.current} dominantUser={dominantUser} />
    </main>
  );
}
