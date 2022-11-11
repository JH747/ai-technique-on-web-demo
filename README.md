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
