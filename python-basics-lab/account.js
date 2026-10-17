'use strict';
/* 학생 본인만 코드에 접근하고, 등록된 멘토만 성적표를 볼 수 있습니다. */
(() => {
  const cfg=window.PYLAB_CLOUD_CONFIG||{};
  const configured=/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(cfg.url||'') && (cfg.publishableKey||'').length>20;
  const client=configured && window.supabase?.createClient ? window.supabase.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}) : null;
  const $=id=>document.getElementById(id);
  let user=null,mentor=false,displayName='',mode='login',busy=false,loadingToken=0,saveTimer=null,pending=null,saving=false,savePromise=null,students=[],grades=[];
  const defaults=()=>({solved:[],drafts:{},freeCode:'# 자유 코딩\n',last:1});
  const normalize=s=>({
    solved:[...new Set((Array.isArray(s?.solved)?s.solved:[]).map(Number).filter(n=>Number.isInteger(n)&&n>0&&n<=40))].sort((a,b)=>a-b),
    last:Number.isInteger(Number(s?.last))&&Number(s.last)>=1&&Number(s.last)<=40?Number(s.last):1,
    drafts:Object.fromEntries(Object.entries(s?.drafts||{}).filter(([k,v])=>/^([1-9]|[1-3]\d|40)$/.test(k)&&typeof v==='string').map(([k,v])=>[k,v.slice(0,10000)])),
    freeCode:typeof s?.freeCode==='string'?s.freeCode.slice(0,20000):''
  });
  const state=window.PyLabAccounts={configured:Boolean(client),getUserId:()=>user?.id||null,isLoading:false,queueSave(data){
    if(!client||!user||state.isLoading)return;
    pending=normalize(data);clearTimeout(saveTimer);$('saveStatus').textContent='클라우드 저장 중…';
    saveTimer=setTimeout(flush,1000);
  }};
  const txt=(id,value)=>{if($(id))$(id).textContent=value;};
  const notice=(message,ok=false)=>{txt('accountMessage',message);$('accountMessage')?.classList.toggle('good',ok);};
  const date=v=>v?new Date(v).toLocaleString('ko-KR'):'기록 없음';
  function createUi(){
    const button=document.createElement('button');button.id='accountBtn';button.type='button';button.className='account-entry';
    document.querySelector('.top-right')?.prepend(button);
    const alert=document.createElement('div');alert.className='account-alert';alert.id='accountAlert';
    document.querySelector('.site-shell')?.insertBefore(alert,document.querySelector('main'));
    const modal=document.createElement('div');modal.className='account-modal';modal.id='accountModal';modal.hidden=true;
    modal.innerHTML='<div class="account-panel" role="dialog" aria-modal="true" aria-labelledby="accountTitle">'+
      '<button id="accountClose" class="account-close" aria-label="닫기">×</button><h2 id="accountTitle">나의 학습 계정</h2>'+
      '<p>내 문제 풀이와 작성 코드를 개인 계정에 자동 저장할 수 있어요.</p>'+
      '<div id="signedOut"><div class="account-tabs" role="tablist"><button type="button" class="account-tab" id="loginTab" aria-selected="true">로그인</button><button type="button" class="account-tab" id="signupTab" aria-selected="false">회원가입</button></div>'+
      '<form id="authForm"><label class="account-field" id="nameField" hidden>학생 이름/닉네임<input id="studentName" maxlength="40" placeholder="예: 김학생" autocomplete="nickname"></label>'+
      '<label class="account-field">이메일<input id="studentEmail" type="email" required maxlength="254" placeholder="student@example.com" autocomplete="email"></label>'+
      '<label class="account-field">비밀번호<input id="studentPassword" type="password" required minlength="6" placeholder="6자 이상" autocomplete="current-password"></label>'+
      '<button id="authSubmit" class="account-primary" type="submit">로그인</button></form></div>'+
      '<div id="signedIn" hidden><div class="account-profile"><strong id="profileName"></strong><span id="profileEmail"></span><p id="profileRole"></p></div>'+
      '<div class="account-row"><button type="button" id="gradeButton" class="account-secondary" hidden>📊 멘토 성적표</button>'+
      '<button type="button" class="account-secondary" id="logoutButton">로그아웃</button></div></div>'+
      '<div id="accountMessage" class="account-message" aria-live="polite"></div>'+
      '<p class="account-muted">학생별 비밀번호 로그인으로 기록을 구분합니다. 멘토는 완료 문제와 진도만 볼 수 있어요.</p></div>';
    document.body.append(modal);
    const board=document.createElement('div');board.className='mentor-overlay';board.id='mentorModal';board.hidden=true;
    board.innerHTML='<div class="mentor-panel" role="dialog" aria-modal="true" aria-labelledby="mentorTitle"><button class="account-close" id="mentorClose" aria-label="닫기">×</button>'+
      '<h2 id="mentorTitle">📊 멘토 성적표</h2><p>완료 문제와 진도만 표시합니다. 학생 작성 코드는 멘토에게 공개되지 않습니다.</p>'+
      '<div class="mentor-summary"><div class="mentor-stat"><span>등록 학생</span><strong id="mentorTotal">0명</strong></div>'+
      '<div class="mentor-stat"><span>평균 완료율</span><strong id="mentorAverage">0%</strong></div>'+
      '<div class="mentor-stat"><span>전체 해결 문제</span><strong id="mentorSolved">0개</strong></div></div>'+
      '<div class="mentor-toolbar"><input id="mentorSearch" type="search" placeholder="학생 이름 검색" aria-label="학생 이름 검색">'+
      '<div class="account-row"><button class="account-secondary" id="mentorRefresh">↻ 새로고침</button>'+
      '<button class="account-secondary" id="mentorExport">⇩ CSV 다운로드</button></div></div>'+
      '<div class="mentor-table-wrap"><table class="mentor-table"><thead><tr><th>학생 이름</th><th>완료</th><th>점수</th><th>진도</th><th>최종 저장</th><th>상세</th></tr></thead>'+
      '<tbody id="mentorTable"><tr><td colspan="6">로딩 중…</td></tr></tbody></table></div>'+
      '<div id="mentorDetails" class="mentor-detail" hidden></div><div id="mentorError" class="account-message" role="status"></div>'+
      '<div class="mentor-hint">※ 점수는 정답 확인을 통과한 문제당 10점(총 400점)으로 계산하는 참고 지표입니다.</div></div>';
    document.body.append(board);
    $('accountBtn').addEventListener('click',openAccount);
    $('accountClose').addEventListener('click',closeAccount);
    $('loginTab').addEventListener('click',()=>setMode('login'));
    $('signupTab').addEventListener('click',()=>setMode('signup'));
    $('authForm').addEventListener('submit',submitAuth);
    $('logoutButton').addEventListener('click',logout);
    $('gradeButton').addEventListener('click',openMentor);
    $('mentorClose').addEventListener('click',closeMentor);
    $('mentorRefresh').addEventListener('click',fetchGrades);
    $('mentorExport').addEventListener('click',exportCsv);
    $('mentorSearch').addEventListener('input',renderGrades);
    $('accountModal').addEventListener('click',event=>{if(event.target===$('accountModal'))closeAccount();});
    $('mentorModal').addEventListener('click',event=>{if(event.target===$('mentorModal'))closeMentor();});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeAccount();closeMentor();}});
    paint();
  }
  function paint(){
    if(!$('accountBtn'))return;
    txt('accountBtn',user?(mentor?'🔐 멘토 · ':'✓ ')+(displayName||'내 계정'):(client?'♙ 로그인 / 회원가입':'♙ 계정 연결 전'));
    const a=$('accountAlert');a.replaceChildren();
    const message=document.createElement('span');
    message.textContent=!client?'현재 기록은 이 브라우저에만 저장됩니다. 학생별 개인 기록과 멘토 성적표는 데이터베이스 연결 후 활성화됩니다.':
      user?'🔒 '+(displayName||'학생')+'님 로그인 중 · 작성 코드는 본인만 열람합니다.':
      '로그인 후 문제를 풀면 본인 계정에 학습 기록이 온라인으로 자동 저장됩니다.';
    a.append(message);
    if(client&&(!user||mentor)){
      const link=document.createElement('button');link.textContent=user?'멘토 성적표 →':'로그인 →';link.onclick=user?openMentor:openAccount;a.append(link);
    }
    $('signedOut').hidden=Boolean(user)||!client;$('signedIn').hidden=!user;
    if(user){txt('profileName',displayName);txt('profileEmail',user.email);txt('profileRole',mentor?'멘토 계정 · 학생별 성적표 조회 가능':'학생 계정 · 본인의 학습 기록만 볼 수 있습니다.');$('gradeButton').hidden=!mentor;}
  }
  function setMode(next){
    mode=next;$('loginTab').setAttribute('aria-selected',String(mode==='login'));
    $('signupTab').setAttribute('aria-selected',String(mode==='signup'));
    $('nameField').hidden=mode!=='signup';$('authSubmit').textContent=mode==='signup'?'학생 계정 만들기':'로그인';
    $('studentPassword').autocomplete=mode==='signup'?'new-password':'current-password';notice('');
  }
  function openAccount(){ $('accountModal').hidden=false;document.body.style.overflow='hidden';if(!client)notice('관리자가 Supabase 프로젝트를 연결하면 학생 회원가입이 활성화됩니다.');}
  function closeAccount(){if($('accountModal'))$('accountModal').hidden=true;if($('mentorModal')?.hidden!==false)document.body.style.overflow='';}
  async function submitAuth(event){
    event.preventDefault();if(busy||!client)return;const email=$('studentEmail').value.trim(),password=$('studentPassword').value,name=$('studentName').value.trim();
    if(mode==='signup'&&!name){notice('학생 이름 또는 닉네임을 입력해 주세요.');return;}
    busy=true;$('authSubmit').disabled=true;notice('처리 중…');
    try{
      if(mode==='signup'){
        const {data,error}=await client.auth.signUp({email,password,options:{data:{display_name:name}}});if(error)throw error;
        if(!data.session){setMode('login');notice('가입 신청이 완료됐어요. 이메일 인증 후 로그인해 주세요.',true);}
        else notice('가입 완료! 학습 기록을 불러옵니다.',true);
      }else{
        const {error}=await client.auth.signInWithPassword({email,password});if(error)throw error;notice('로그인 성공! 기록을 불러옵니다.',true);
      }
    }catch(error){notice('가입/로그인 실패: '+error.message);}
    finally{busy=false;$('authSubmit').disabled=false;}
  }
  async function onSession(session){
    const token=++loadingToken;state.isLoading=true;
    try{
      if(!session?.user){
        user=null;mentor=false;displayName='';pending=null;clearTimeout(saveTimer);
        window.PythonLab?.applySnapshot(defaults());paint();return;
      }
      if(user?.id && user.id!==session.user.id)window.PythonLab?.applySnapshot(defaults());
      user=session.user;
      const [a,b,c,d]=await Promise.all([
        client.from('student_profiles').select('display_name').eq('user_id',user.id).maybeSingle(),
        client.rpc('is_mentor'),
        client.from('learning_progress').select('solved,last_lesson').eq('user_id',user.id).maybeSingle(),
        client.from('code_drafts').select('drafts,free_code').eq('user_id',user.id).maybeSingle()
      ]);
      if(token!==loadingToken)return;
      for(const r of [a,b,c,d])if(r.error)throw r.error;
      displayName=a.data?.display_name||String(user.user_metadata?.display_name||'학생').slice(0,40);
      mentor=Boolean(b.data);
      window.PythonLab?.applySnapshot(normalize({
        solved:c.data?.solved||[],last:c.data?.last_lesson||1,
        drafts:d.data?.drafts||{},freeCode:d.data?.free_code??defaults().freeCode
      }));
      txt('saveStatus','클라우드 저장됨');paint();closeAccount();
    }catch(error){
      if(token===loadingToken){paint();alert('학습 기록 로딩 실패: '+error.message+'\n관리자에게 Supabase 설정 확인을 요청하세요.');}
    }finally{if(token===loadingToken)state.isLoading=false;}
  }
  async function flush(){
    clearTimeout(saveTimer);if(!client||!user||saving||!pending)return savePromise;
    const id=user.id;saving=true;
    savePromise=(async()=>{
      while(pending&&user?.id===id){
        const now=new Date().toISOString(),s=pending;pending=null;
        const [p,d]=await Promise.all([
          client.from('learning_progress').upsert({user_id:id,solved:s.solved,last_lesson:s.last,updated_at:now},{onConflict:'user_id'}),
          client.from('code_drafts').upsert({user_id:id,drafts:s.drafts,free_code:s.freeCode,updated_at:now},{onConflict:'user_id'})
        ]);
        if(p.error||d.error){if(!pending)pending=s;txt('saveStatus','⚠ 클라우드 저장 실패');console.warn(p.error||d.error);break;}
        txt('saveStatus','클라우드 저장됨');
      }
    })();
    try{await savePromise;}finally{saving=false;savePromise=null;}
  }
  async function logout(){
    if(!client||busy)return;busy=true;
    try{
      await flush();if(pending){notice('아직 저장되지 않은 기록이 있어요. 네트워크 연결 후 다시 시도해 주세요.');return;}
      const {error}=await client.auth.signOut();if(error)throw error;notice('로그아웃했습니다.',true);
    }catch(error){notice('로그아웃 실패: '+error.message);}
    finally{busy=false;}
  }
  const rows=()=>{
    const map=new Map(grades.map(g=>[g.user_id,g]));
    return students.filter(x=>x.user_id!==user?.id).map(x=>{
      const record=map.get(x.user_id),solved=normalize({solved:record?.solved}).solved;
      return {...x,solved,count:solved.length,percent:Math.round(solved.length*2.5),updated_at:record?.updated_at||null};
    });
  };
  function renderGrades(){
    const all=rows(),q=$('mentorSearch').value.trim().toLowerCase();
    const filtered=all.filter(x=>x.display_name.toLowerCase().includes(q));
    txt('mentorTotal',all.length+'명');txt('mentorAverage',(all.length?Math.round(all.reduce((n,x)=>n+x.percent,0)/all.length):0)+'%');
    txt('mentorSolved',all.reduce((n,x)=>n+x.count,0)+'개');
    const table=$('mentorTable');table.replaceChildren();
    if(!filtered.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=6;td.textContent='표시할 학생이 없습니다.';tr.append(td);table.append(tr);return;}
    for(const r of filtered){
      const tr=document.createElement('tr');
      [r.display_name,r.count+'/40',r.count*10+'/400',r.percent+'%',date(r.updated_at)].forEach((value,i)=>{
        const td=document.createElement('td');td.textContent=value;
        if(i===3){const bar=document.createElement('div'),fill=document.createElement('span');bar.className='mentor-progress';fill.style.width=r.percent+'%';bar.append(fill);td.append(bar);}
        tr.append(td);
      });
      const td=document.createElement('td'),b=document.createElement('button');b.textContent='상세';
      b.addEventListener('click',()=>details(r));td.append(b);tr.append(td);table.append(tr);
    }
  }
  function details(r){
    const box=$('mentorDetails');box.replaceChildren();box.hidden=false;
    const strong=document.createElement('strong');strong.textContent=r.display_name+' · '+r.count+'/40 문제';box.append(strong);
    for(const ch of (window.STUDY_DATA?.chapters||[])){
      const l=(window.STUDY_DATA?.lessons||[]).filter(x=>x.chapter===ch.id);
      const line=document.createElement('div');line.textContent=ch.title+' : '+l.filter(x=>r.solved.includes(x.id)).length+'/'+l.length;box.append(line);
    }
    const rest=document.createElement('div');rest.textContent='완료 문제: '+(r.solved.join(', ')||'없음');box.append(rest);
  }
  async function fetchGrades(){
    if(!mentor||!user)return;txt('mentorError','');txt('mentorTable','데이터를 불러오는 중…');
    const [p,g]=await Promise.all([
      client.from('student_profiles').select('user_id,display_name,created_at').order('created_at',{ascending:false}),
      client.from('learning_progress').select('user_id,solved,updated_at')
    ]);
    if(p.error||g.error){txt('mentorError','조회 실패: '+(p.error||g.error).message);return;}
    students=p.data||[];grades=g.data||[];renderGrades();
  }
  function openMentor(){if(!mentor||!user){openAccount();return;}closeAccount();$('mentorModal').hidden=false;document.body.style.overflow='hidden';fetchGrades();}
  function closeMentor(){if($('mentorModal'))$('mentorModal').hidden=true;document.body.style.overflow='';}
  function exportCsv(){
    if(!mentor||!user)return;
    const sanitize=v=>'"'+String(v??'').replace(/^([=+\-@\t\r])/,"'$1").replace(/"/g,'""')+'"';
    const data=[['학생','완료 문제','총 문제','점수','최대점','진도(%)','최종 저장'],...rows().map(r=>[r.display_name,r.count,40,r.count*10,400,r.percent,date(r.updated_at)])];
    const blob=new Blob(['\uFEFF'+data.map(line=>line.map(sanitize).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='python-lab-학생성적표.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  document.addEventListener('DOMContentLoaded',()=>{
    createUi();
    if(client)client.auth.onAuthStateChange((event,session)=>{
      if(['INITIAL_SESSION','SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(event))Promise.resolve().then(()=>onSession(session));
    });
  });
})();