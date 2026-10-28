/* BSSM 사고력 실전 훈련 - 실제 학교 기출 및 출제 방식 보증 없음 */
(function(){
"use strict";
const QUESTIONS=window.BSSM_LOGIC_QUESTIONS||[],KEY="bssm_logic_practice_v1",LIMIT=50*60*1000;
const SETS={1:{name:"기본 사고력",desc:"배수 규칙 · 두 수의 쌍 · 최소 연산"},2:{name:"조건 분석",desc:"중복 조건 · 연속 구간 · 격자 최단거리"},3:{name:"자료 처리",desc:"올림 계산 · 문자열 압축 · 활동 선택"},4:{name:"응용 알고리즘",desc:"진법 변환 · 빈도 계산 · 최적 분할"}};
let data;try{data=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){data={}}
data.records=Array.isArray(data.records)?data.records:[];data.active=data.active||null;data.lang=data.lang==="c"?"c":"py";data.selected=[1,2,3,4].includes(data.selected)?data.selected:1;
let page=data.active?"exam":"landing",reviewId=data.records.length?data.records[data.records.length-1].id:null,interval=null;
const el=id=>document.getElementById(id),safe=s=>String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){alert("브라우저 저장 공간이 부족하여 학습 기록이 저장되지 않았습니다.")}};
const badge=(t,cls="")=>'<span class="chip '+cls+'">'+safe(t)+'</span>';
const button=(t,a,cl="",extra="")=>'<button class="btn '+cl+'" data-action="'+a+'" '+extra+'>'+t+'</button>';
const secs=(ms)=>{let n=Math.max(0,Math.ceil(ms/1000));return String(Math.floor(n/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0")};
const current=()=>data.active;
const ofSet=n=>QUESTIONS.filter(x=>x.set===n);
const answerData=(active,id)=>active.answers[id]||{result:"",steps:"",edge:"",code:""};
const getRecords=()=>data.records.slice().reverse();
const points=r=>Object.values(r.criteria||{}).reduce((a,checks)=>a+Object.values(checks||{}).filter(Boolean).length,0);
const status=r=>r&&r.criteria?points(r)+"/12개 기준 자가점검 완료":null;
const title=(k,t,s)=>'<div class="eyebrow">'+k+'</div><h1 class="heading">'+safe(t)+'</h1><p class="subtitle">'+s+'</p>';
function shell(content){el("logic-root").innerHTML='<div class="logic-shell"><div class="logic-head"><a class="back" href="./" aria-label="전체 코딩 연습실로">‹ 전체 코딩 연습실</a><div class="logic-brand">BSSM CODING LAB <span>/ 사고력 실전</span></div><div class="segment"><button data-action="lang" data-lang="py" class="'+(data.lang==="py"?"active":"")+'">Python</button><button data-action="lang" data-lang="c" class="'+(data.lang==="c"?"active":"")+'">C언어</button></div></div><main class="logic-main">'+content+'<footer class="footer">비공식 창작 연습 문제 · 부산소프트웨어마이스터고 공식 기출/공식 채점과 무관 · 학생별 기록은 현재 브라우저에 저장됩니다. <a target="_blank" rel="noopener noreferrer" href="https://school.busanedu.net/bssm-h/na/ntt/selectNttInfo.do?mi=1019680&nttSn=53813876">학교 공식 2027학년도 안내</a></footer></main></div>';timer()}
function landing(){
const rec=data.records.length,last=data.records.at(-1);
return title("PROBLEM SOLVING · REASONING","50분 사고력 실전 연습","답만 맞히는 연습이 아니라, 왜 그런 풀이가 나오는지 설명하는 연습입니다. 3문제씩 4회분의 비공식 창작 모의평가를 준비했어요.")+
'<div class="notice"><b>확인된 사실과 연습 방식 구분</b><p>2027학년도 공식 공지에는 마이스터인재전형 코딩테스트가 2026년 10월 30일 09:30~10:20(50분)이라고 안내되어 있습니다. <b>3문항 구성·문제 유형·채점표는 학교에서 발표한 내용이 아니라 연습 목적으로 저희가 정한 것입니다.</b> 최신 공식 기출 원문은 확인되지 않았습니다.</p></div>'+
'<div class="grid stats" style="margin-top:16px">'+[['연습 세트',"4","회차"],['시나리오 문제',QUESTIONS.length,"문항"],['제한 시간',"50","분"],['완료 기록',rec,"회"]].map(x=>'<div class="stat"><small>'+x[0]+'</small><strong>'+x[1]+'<em>'+x[2]+'</em></strong></div>').join("")+'</div>'+
'<div class="section-title"><h2>실전 연습 세트 선택</h2>'+badge("기초·응용·도전 각 1문항")+'</div>'+
'<div class="grid feature-grid">'+Object.entries(SETS).map(([k,v])=>{let done=data.records.filter(r=>String(r.set)===k).length;return '<section class="card '+(Number(k)%2?"":"peach")+'"><div class="row">'+badge("SET "+k)+badge(done?"복습 "+done+"회":"미응시",done?"green":"gray")+'</div><h2>'+safe(v.name)+'</h2><p>'+safe(v.desc)+'</p>'+button("이 세트 50분 연습 →","start","primary",'data-set="'+k+'"')+'</section>'}).join("")+'</div>'+
'<div class="grid two" style="margin-top:17px"><section class="panel"><h3>세 가지 답안을 모두 작성해 보세요</h3><div class="steps"><div class="step"><span>1</span>예시 입력의 결과를 먼저 구하기</div><div class="step"><span>2</span>왜 그렇게 해결하는지 문장으로 설명하기</div><div class="step"><span>3</span>예외 상황과 코드 또는 의사코드 적기</div></div><div class="notice" style="margin-top:16px"><b>자가 채점 방식</b><p>제출 후 예시 해설을 확인하고, 결과·논리·경계값·설명력 네 기준을 스스로 체크합니다. 공식 점수는 아니며, 서술 답안을 자동 채점하지 않습니다.</p></div></section><section class="panel"><h3>내 연습 기록</h3>'+(last?'<p class="subtitle">마지막 연습: '+new Date(last.ts).toLocaleString("ko-KR")+' · SET '+last.set+'</p>':"<p class='subtitle'>아직 완료한 연습이 없습니다.</p>")+(getRecords().slice(0,6).map(r=>'<div class="logic-history-line"><div><strong>SET '+r.set+' · '+safe(SETS[r.set].name)+'</strong><small>'+new Date(r.ts).toLocaleDateString("ko-KR")+' · '+secs(r.spent)+'</small></div>'+button("해설/자가점검","review","small",'data-id="'+r.id+'"')+'</div>').join(""))+'<div class="row" style="margin-top:20px">'+button("기록 JSON 백업","export","small")+button("기록 초기화","reset","warn small")+'</div></section></div>'}
function exam(){
const a=current();if(!a)return landing();const qs=ofSet(a.set),q=qs[a.index],ans=answerData(a,q.id),remaining=LIMIT-(Date.now()-a.started),filled=qs.filter(x=>{let s=answerData(a,x.id);return s.result.trim()||s.steps.trim()||s.edge.trim()||s.code.trim()}).length;
return title("50 MINUTE PRACTICE","SET "+a.set+" · "+safe(SETS[a.set].name),'문제마다 결과·풀이 과정·예외 상황을 작성합니다. 연습 중 정답은 공개되지 않습니다.')+
'<div class="logic-progress"><div><strong>문제 '+(a.index+1)+' / 3</strong><span>'+filled+'문항 답안 작성</span></div><div class="clock" id="remaining-clock" aria-live="off">'+secs(remaining)+'</div></div>'+
'<div class="logic-q-switch">'+qs.map((x,i)=>'<button data-action="jump" data-i="'+i+'" class="'+(a.index===i?"active":"")+'">'+(i+1)+' · '+x.level+'</button>').join("")+'</div>'+
'<div class="panel logic-question"><div class="row">'+badge(q.level)+badge("연습 배분 "+([12,16,22][a.index])+"분","gray")+'</div><h2>'+safe(q.title)+'</h2><p class="logic-story">'+safe(q.story)+'</p><div class="logic-io"><div><b>조건</b><p>'+safe(q.input)+'</p></div><div><b>출력/예시</b><p>'+safe(q.output)+'</p></div></div><details class="logic-examples"><summary>추가 입력·출력 예시 보기</summary><div>'+q.examples.map(x=>'<div><code>'+safe(x[0])+'</code><b>'+safe(x[1])+'</b></div>').join("")+'</div></details>'+
'<div class="logic-fields"><label for="result">① 최종 답 또는 출력값</label><textarea data-field="result" id="result" placeholder="제시된 예시에서 어떤 결과가 나오는지 적으세요.">'+safe(ans.result)+'</textarea><label for="steps">② 풀이 과정 (말로 설명)</label><textarea data-field="steps" id="steps" placeholder="어떤 규칙으로 풀었는지 3~5문장으로 설명하세요.">'+safe(ans.steps)+'</textarea><label for="edge">③ 조건·경계값 확인</label><textarea data-field="edge" id="edge" placeholder="0, 한 개, 중복, 동점, 경로 없음처럼 잘못 처리하기 쉬운 경우를 적어보세요.">'+safe(ans.edge)+'</textarea><label for="code">④ 의사코드 또는 '+(data.lang==="c"?"C언어":"Python")+' 코드 (선택)</label><textarea data-field="code" id="code" class="logic-code" spellcheck="false" placeholder="코드 전체 또는 주요 반복·조건 로직만 작성해도 됩니다.">'+safe(ans.code)+'</textarea></div>'+
'<div class="question-actions"><div>'+button("← 이전","prev","",a.index===0?"disabled":"")+button("다음 →","next","",a.index===2?"disabled":"")+'</div>'+button("답안 제출 · 해설 보기","submit","primary")+'</div></div>'+
'<div class="notice" style="margin-top:16px"><b>시간 관리</b><p>권장 배분: 1번 12분, 2번 16분, 3번 22분. 이 시간 배분은 연습용이며 실제 학교 문항별 배점·시간을 뜻하지 않습니다. 학습 중 내용은 자동 저장됩니다.</p></div>'}
function timer(){clearInterval(interval);if(page!=="exam"||!current())return;const tick=()=>{if(page!=="exam"||!current()){clearInterval(interval);return}const left=LIMIT-(Date.now()-current().started);let box=el("remaining-clock");if(box)box.textContent=secs(left);if(left<=0){clearInterval(interval);submit(true)}};tick();interval=setInterval(tick,1000)}
function start(set){if(current()&&!confirm("현재 풀고 있는 세트를 중단하고 새 연습을 시작할까요?"))return;data.active={set:Number(set),index:0,answers:{},started:Date.now()};data.selected=Number(set);save();page="exam";shell(exam())}
function submit(force){const a=current();if(!a)return;const completed=ofSet(a.set).filter(x=>{let t=answerData(a,x.id);return t.result.trim()&&t.steps.trim()}).length;if(!force&&completed<3&&!confirm("결과와 풀이 과정이 모두 작성된 문항은 "+completed+"/3개입니다. 지금 제출하시겠어요?"))return;if(!force&&!confirm("제출 후에는 정답과 해설을 확인할 수 있고, 답안을 수정할 수 없습니다. 제출할까요?"))return;
const rec={id:"L"+Date.now(),set:a.set,ts:Date.now(),spent:Math.min(LIMIT,Date.now()-a.started),timedOut:!!force,lang:data.lang,answers:a.answers,criteria:{}};
data.records.push(rec);data.active=null;reviewId=rec.id;save();page="review";shell(review())}
const checked=(r,id,key)=>!!(r.criteria[id]&&r.criteria[id][key]);
function review(){const r=data.records.find(x=>x.id===reviewId);if(!r)return title("REVIEW","기록을 찾지 못했습니다","다시 목록에서 선택해 주세요.")+button("세트 목록","home");
const q=ofSet(r.set),sum=points(r);
return title("MODEL SOLUTION & SELF REVIEW","SET "+r.set+" · 해설과 자가점검","자동 채점 결과가 아닙니다. 본인의 풀이와 예시 해설을 비교하면서 네 가지 기준을 직접 평가해 보세요.")+
'<div class="logic-progress"><div><strong>자가점검 '+sum+'/12개 기준</strong><span>결과·풀이 구조·예외 처리·설명력 (문제당 각 1개)</span></div>'+badge(r.timedOut?"50분 종료 제출":"제출 완료",r.timedOut?"gray":"green")+'</div>'+
q.map((x,i)=>{const ans=answerData(r,x.id);let criteria=[["answer","문제의 예시 결과를 올바르게 구했어요."],["logic","효율적인 풀이 규칙과 순서를 설명했어요."],["edge","예외·경계값을 하나 이상 점검했어요."],["clarity","다른 사람도 이해할 수 있게 풀이를 설명했어요."]];return '<section class="panel logic-review"><div class="row">'+badge("문제 "+(i+1)+" · "+x.level)+badge(x.title,"gray")+'</div><h2>'+safe(x.title)+'</h2><div class="logic-review-grid"><div><h3>내가 작성한 답</h3>'+[["최종 답",ans.result],["풀이 과정",ans.steps],["예외·경계값",ans.edge],["의사코드/코드",ans.code]].map(a=>'<div class="logic-answer"><b>'+a[0]+'</b><p>'+safe(a[1]||"미작성")+'</p></div>').join("")+'</div><div><h3>모범 풀이 핵심</h3><ol>'+x.thinking.map(t=>'<li>'+safe(t)+'</li>').join("")+'</ol><p class="logic-answer"><b>경계값 확인</b>'+x.edge.map(e=>'<span>• '+safe(e)+'</span>').join("")+'</p><details><summary>의사코드 확인</summary><pre class="snippet"><code>'+safe(x.pseudo)+'</code></pre></details><details><summary>'+(data.lang==="c"?"C언어":"Python")+' 예시 코드 확인</summary><pre class="snippet"><code>'+safe(data.lang==="c"?x.c:x.py)+'</code></pre></details><div class="notice" style="margin-top:12px"><b>학습 메모</b><p>'+safe(x.check)+'</p></div></div></div><div class="logic-rubric"><h3>스스로 확인할 네 가지 기준</h3>'+criteria.map(([k,label])=>'<label class="logic-check"><input type="checkbox" data-check="'+k+'" data-q="'+x.id+'" '+(checked(r,x.id,k)?"checked":"")+'><span>'+safe(label)+'</span></label>').join("")+'</div></section>'}).join("")+
'<div class="panel"><div class="row">'+button("다른 세트 연습하기","home","primary")+button("학습 기록 JSON 백업","export")+button("인쇄하기","print")+'</div><p class="subtitle" style="margin:12px 0 0">자가점검 값은 실제 합격 가능성이나 학교 점수와 무관합니다.</p></div>'}
function exportData(){const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),practice:"BSSM_logic_nonofficial",records:data.records},null,2)],{type:"application/json"}),a=document.createElement("a"),url=URL.createObjectURL(blob);a.href=url;a.download="bssm-reasoning-practice-history.json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
document.addEventListener("click",ev=>{const target=ev.target.closest("[data-action]");if(!target||target.disabled)return;const a=target.dataset.action;switch(a){
case"lang":data.lang=target.dataset.lang==="c"?"c":"py";save();shell(page==="exam"?exam():page==="review"?review():landing());break;
case"start":start(target.dataset.set);break;
case"jump":if(current()){current().index=Number(target.dataset.i);save();shell(exam())}break;
case"prev":if(current()&&current().index>0){current().index--;save();shell(exam())}break;
case"next":if(current()&&current().index<2){current().index++;save();shell(exam())}break;
case"submit":submit(false);break;
case"review":reviewId=target.dataset.id;page="review";shell(review());break;
case"home":page="landing";shell(landing());break;
case"export":exportData();break;
case"print":window.print();break;
case"reset":if(confirm("사고력 연습 기록과 미제출 답안을 전부 삭제하시겠어요? 복구할 수 없습니다.")){data.records=[];data.active=null;reviewId=null;save();page="landing";shell(landing())}break;
}});
document.addEventListener("input",ev=>{const field=ev.target.dataset.field;if(!field||!current())return;const q=ofSet(current().set)[current().index];const ans=current().answers[q.id]||{result:"",steps:"",edge:"",code:""};ans[field]=ev.target.value;current().answers[q.id]=ans;save()});
document.addEventListener("change",ev=>{const k=ev.target.dataset.check;if(!k)return;const r=data.records.find(x=>x.id===reviewId),id=ev.target.dataset.q;if(!r||!ofSet(r.set).some(x=>x.id===id))return;r.criteria[id]=r.criteria[id]||{};r.criteria[id][k]=!!ev.target.checked;save();shell(review())});
window.addEventListener("beforeunload",save);
if(data.active&&Date.now()-data.active.started>=LIMIT)submit(true);
else shell(page==="exam"?exam():landing());
})();