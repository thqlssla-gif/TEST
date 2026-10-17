# PYTHON LAB 🐍 — 학생 계정 + 멘토 성적표 버전

초등 고학년~성인 입문자용 파이썬 문법 40문제(10장) 실습 사이트입니다.

## 기능
- 실시간 Python 3 실행 (Pyodide/Web Worker), 힌트·모범 답안·자동 테스트
- 회원가입: 학생 이름/닉네임 + 이메일 + 비밀번호
- **학생**: 계정별 실습 코드, 완료 문제, 마지막 학습 위치 **클라우드 자동 저장**, 재로그인 시 이어하기
- **멘토**: 등록 학생 목록, 완료 문제 0~40, 400점 기준 참고 점수, 진도, 최근 저장일, 챕터별 상세, 학생 성적표 CSV 다운로드
- 접근 제어는 **Supabase Auth + SQL Row-Level Security**에서 검사 (UI에서 멘토 모드 버튼을 보이는 것과 별개로 서버에서 강제)
- 학생의 작성 코드(초안)는 **멘토도 볼 수 없는 별도 테이블**에 보관
- 사용자 정보는 이름(또는 닉네임), 이메일, 풀이 정보. 학생 코드의 기본 실습 문구 외 개인정보 저장을 권장하지 않습니다.

## 중요: GitHub Pages만으로는 계정 및 공용 성적표가 저장되지 않습니다

이 저장소에는 로그인/성적표 화면과 데이터베이스 스키마가 구현되어 있지만, **Supabase 프로젝트를 만들고 연결하기 전에는 계정 기능을 활성화할 수 없습니다.** 프로젝트 연결 값은 사용자가 직접 입력해야 합니다. **절대로 서비스 역할 키(service_role), Supabase secret, 사용자 비밀번호 등을 GitHub에 넣지 마세요.**

### 1. Supabase 무료 프로젝트 생성

1. https://supabase.com/ 에 로그인하여 새 프로젝트를 만듭니다.
2. Supabase 대시보드의 **SQL Editor**를 열고 `supabase-schema.sql` 내용을 실행합니다.
3. **Authentication > Providers > Email**에서 이메일 가입을 허용합니다. 인증 메일을 켜두는 것을 권장합니다.
4. **Authentication > URL Configuration**의 Site URL은 `https://thqlssla-gif.github.io/TEST/python-basics-lab/` 으로 설정합니다. Redirect URLs에 위 주소와 `https://thqlssla-gif.github.io/TEST/python-basics-lab/**`를 추가합니다.

### 2. 사이트와 데이터베이스 연결

Supabase **Project Settings > API**(또는 Connect 메뉴)에서 다음 두 값을 복사해 `cloud-config.js`에 작성합니다.

```js
window.PYLAB_CLOUD_CONFIG = {
  url: 'https://YOUR-PROJECT.supabase.co',
  publishableKey: 'sb_publishable_XXXXXXXXXXXXXXXX' // 또는 기존 anon public 키
};
```

`publishable/anon` 키는 브라우저에서 사용하는 **공개 키**이며, 접근 보호는 SQL에 포함된 RLS 정책으로 이뤄집니다. **절대 service_role / secret key 사용 금지.** 저장소에 올라간 공개 설정만으로 다른 학생 성적을 읽을 수 없어야 정상입니다.

### 3. 멘토 권한 지정 (중요)

멘토가 사이트에서 일반 회원가입하고 이메일 인증을 마친 다음, **관리자가 Supabase SQL Editor에서만** 다음 SQL을 실행하세요.

```sql
insert into public.mentor_members(user_id)
select id from auth.users where email = 'mentor@example.com'
on conflict (user_id) do nothing;
```

`mentor@example.com`은 멘토가 가입한 이메일로 교체해야 합니다. 멘토 권한은 사이트의 회원가입 화면에서 임의로 선택할 수 없습니다.

### 4. 확인 순서

1. 서로 다른 이메일로 학생 계정 2개를 만듭니다.
2. 학생 A로 로그인해 2문제를 정답 확인 → 로그아웃 → 학생 A 재로그인 시 2개 기록이 보이는지 확인합니다.
3. 학생 B로 로그인하면 A의 코드·진도가 보이지 않아야 합니다.
4. 멘토 계정으로 로그인 후 **멘토 성적표** → 두 학생의 완료 문제·진도를 확인합니다.
5. 학생 A로 로그인할 때 성적표 메뉴가 보이지 않아야 하며, Supabase API 직접 호출도 RLS로 차단돼야 합니다.
6. 동일 기기를 여러 사람이 사용하면 **각자 사용 후 꼭 로그아웃**해야 합니다.

## 클라우드 미연결 상태

`cloud-config.js`가 비어 있으면 원래와 동일하게 **이 기기의 브라우저 LocalStorage에만** 진도 및 코드가 자동 저장됩니다. **이 모드는 학생별 계정 보호 기능이 아니므로 공용 PC에서 학생 기록을 공유하지 마세요.** 회원가입, 멘토 전체 성적표, 개인 클라우드 동기화는 Supabase 연결 후에만 작동합니다.

연결되면 **비로그인 체험은 서버에 기록이 저장되지 않습니다.** 학생이 로그인하면 본인 자료만 서버에서 불러오며, 공용 PC 로컬스토리지에 계정별 코드나 성적을 저장하지 않습니다. 네트워크 연결이 끊기면 저장 실패 상태가 표시될 수 있으므로 온라인 상태에서 확인하세요.

## GitHub Pages 배포

레포지토리 `thqlssla-gif/TEST` 안의 `python-basics-lab` 폴더에 업로드한 정적 파일로 운영합니다. 기존 TEST 메인 사이트에는 영향을 주지 않습니다.

- 웹사이트: https://thqlssla-gif.github.io/TEST/python-basics-lab/
- Pages 설정: https://github.com/thqlssla-gif/TEST/settings/pages
- 참고: Pages 설정이 루트 main에서 제공되거나 워크플로가 폴더를 포함해 배포해야 해당 주소가 열립니다.

## 파일 구성
- `index.html` / `styles.css` / `lessons.js` / `app.js` / `py-worker.js` — 기존 사이트
- `account.css` / `account.js` — 학생 회원가입/로그인 및 멘토 성적표
- `cloud-config.js` — 연결 설정(공개 키만 입력)
- `supabase-schema.sql` — 학생과 멘토를 구분하고 조회권한을 강제하는 테이블·정책

⚠️ **점수는 1문제당 10점의 참고 지표입니다.** 브라우저에서 이뤄지는 자율 학습 채점이므로 공인 시험·감독 평가로 간주하면 안 됩니다.