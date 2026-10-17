# PYTHON LAB 🐍

브라우저에서 직접 파이썬을 작성하고 실행할 수 있는 **무료 파이썬 기초 문법 실습 사이트**입니다.

## 주요 기능
- 10개 학습 주제, 40개 단계별 실습 문제
- 개념 설명, 코드 예제, 문제, 힌트, 참고 답안
- 진짜 Python 3 실행 (Pyodide WebAssembly · Web Worker)
- 여러 자동 테스트를 통과하면 문제 해결 처리
- 브라우저 LocalStorage에 코드와 진도 자동 저장
- 자유 실습실 / 모바일 대응 / 무한 루프 실행 자동 중단

## 이용 방법

1. 학습 목차에서 문제를 선택합니다.
2. 코드 편집기에 파이썬 코드를 작성합니다.
3. **실행하기**로 출력을 살펴본 뒤 **정답 확인**으로 테스트를 통과해 보세요.
4. 힌트와 정답 보기는 필요할 때만 펼쳐 보세요.

## 실행 및 배포

HTML/CSS/JS 정적 사이트이므로 별도 서버가 필요 없습니다. 로컬에서는 `python -m http.server 8000`을 실행한 뒤 `http://localhost:8000`에 접속하거나, GitHub Pages로 배포합니다.

기존 GitHub 저장소 `TEST`의 **`python-basics-lab/` 폴더**에 넣어도 기존 메인 페이지를 변경하지 않습니다. GitHub Pages가 `main` / root 폴더를 게시하고 있다면 URL은 `https://thqlssla-gif.github.io/TEST/python-basics-lab/` 입니다.

**첫 코드 실행 시** Pyodide Python 실행 환경을 CDN에서 다운로드하므로 인터넷 연결이 필요합니다. 코드는 사용자의 브라우저 Web Worker 내부에서 실행되며 별도 서버로 전송하지 않습니다. 코딩 연습 용도로 설계되었으며 악성 코드 실행을 허용하는 공용 다중 사용자 샌드박스는 아닙니다. `input()`으로 입력을 받는 대화형 코드는 이 버전에서 지원하지 않습니다.

### 폴더 구성

- `index.html` — 사용자 화면
- `styles.css` — 화면 스타일
- `lessons.js` — 문제와 정답 판정 규칙
- `app.js` — 페이지 로직, 진도 저장 및 사용자 동작
- `py-worker.js` — Pyodide를 통한 파이썬 실행 / 정답 테스트