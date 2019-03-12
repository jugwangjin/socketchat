Chat Program
============
- with Socket Programming -
---------------------------
# 사용 방법
## 서버 켜기
> 0. [node.js](https://nodejs.org/ko/) 설치
> 1. "server.js" 파일이 있는 디렉토리로 접속 (터미널, cmd 등)
> 2. "node server.js" 입력

## 채팅 접속하기
> 1. 브라우저 접속
> 2. [localhost:3000](http://localhost:3000) 접속

## 외부로 연결하기
### ngrok을 이용한 방법
> 0. [ngrok](https://ngrok.com) 설치 (npm install -g ngrok)
> 1. 로컬서버 켜진 상태에서 "ngrok http 3000(포트번호)" 입력
> 2. 콘솔 창에 나타난 url 이용해서 접속