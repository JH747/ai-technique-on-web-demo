## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 클라이언트 시나리오

- 접속시 user 추가
  - post 'newUser' - { id, score: 0 }
  - on 'newUser' - { id, score: 0 }
- 1초마다 스코어 만들어 서버에 전송
  - post 'newScore' - { id, score }
  - 서버는 'newScore'를 받으면 dominant speaker를 판단하여 emit
    - determine dominant speaker
    - emit 'dominantSpeaker' - { id, score }
      - dominant speaker가 없으면 null
- 'dominantSpeaker'를 받으면 화면에 표시
  - on 'dominantSpeaker' - { id, score }
- 퇴장시 user 삭제
  - post 'removeUser' - { id }
  - disconnect socket
