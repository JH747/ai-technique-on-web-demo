## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 클라이언트 시나리오

- ~~입장시 user 추가~~
  - post 'me' - { id, score: 0 }
  - on 'users' - User[]
- ~~1초마다 스코어 만들어 서버에 전송~~
  - post 'newScore' - { id, score }
  - 서버는 'newScore'를 받으면 dominant user를 판단하여 emit
    - determine dominant user
    - emit 'dominantUser' - { id, score }
      - dominant user가 없으면 null
- ~~'dominantUser'를 받으면 화면에 표시~~
  - on 'dominantUser' - { id, score }
- ~~퇴장시 user 삭제~~
  - post 'removeUser' - { id }
  - disconnect socket
- ~~model load~~
  - tensorflow converter 
  - GCP Storage upload
- firestore
  - websocket 대체재
- ~~tf.data.microphone 연동~~
  - AudioContext sampleRate
  - 1초마다 model.predict()
  - post 'newScore' - { id, score }

## Tensor txt 생성 방법
- pages/room/index.tsx line 130에 있는 주석 제거
- pages/api/write.ts line 7에 있는 path("./OOO.txt") 원하는 이름으로 변경
- `yarn install & yarn dev`로 사이트를 실행하고 /room route로 이동
- 약 50초(100개의 Tensor)간 녹음됨 - (이유: room/index.tsx line 120의 `count < 100` 때문에)
- 생성된 txt 파일을 확인 후 맨 앞/뒤를 적절히 삭제