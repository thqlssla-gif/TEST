window.SQLD_LAB_TASKS=[{"name":"WHERE + 정렬","task":"급여 200 이상인 직원의 name, salary를 급여 내림차순으로 조회","sql":"SELECT name,salary FROM emp WHERE salary>=200 ORDER BY salary DESC;","hint":"WHERE와 ORDER BY DESC","ordered":true},{"name":"NULL 검사","task":"bonus가 NULL인 직원의 name을 id 오름차순으로 조회","sql":"SELECT name FROM emp WHERE bonus IS NULL ORDER BY id;","hint":"IS NULL","ordered":true},{"name":"DISTINCT","task":"부서번호를 중복 없이 조회, NULL 제외, 오름차순","sql":"SELECT DISTINCT dept_id FROM emp WHERE dept_id IS NOT NULL ORDER BY dept_id;","hint":"DISTINCT와 IS NOT NULL","ordered":true},{"name":"COUNT 비교","task":"전체 직원 수 total과 보너스 있는 직원 수 with_bonus를 출력","sql":"SELECT COUNT(*) AS total,COUNT(bonus) AS with_bonus FROM emp;","hint":"COUNT(*)와 COUNT(컬럼) 비교","ordered":false},{"name":"GROUP BY","task":"부서별 직원 수: dept_id, cnt. NULL 부서 제외, 부서 오름차순","sql":"SELECT dept_id,COUNT(*) AS cnt FROM emp WHERE dept_id IS NOT NULL GROUP BY dept_id ORDER BY dept_id;","hint":"GROUP BY","ordered":true},{"name":"HAVING","task":"직원 2명 이상인 부서별 dept_id, cnt. NULL 부서 제외, 번호 오름차순","sql":"SELECT dept_id,COUNT(*) AS cnt FROM emp WHERE dept_id IS NOT NULL GROUP BY dept_id HAVING COUNT(*)>=2 ORDER BY dept_id;","hint":"HAVING COUNT(*)","ordered":true},{"name":"INNER JOIN","task":"부서 있는 직원의 name과 dept_name을 직원 id 오름차순으로 조회","sql":"SELECT e.name,d.dept_name FROM emp e JOIN dept d ON e.dept_id=d.id ORDER BY e.id;","hint":"JOIN ... ON","ordered":true},{"name":"LEFT JOIN","task":"모든 부서의 dept_name과 소속 직원 수 cnt (직원 0명도 표시), 부서 id 오름차순","sql":"SELECT d.dept_name,COUNT(e.id) AS cnt FROM dept d LEFT JOIN emp e ON d.id=e.dept_id GROUP BY d.id,d.dept_name ORDER BY d.id;","hint":"LEFT JOIN과 COUNT(e.id)","ordered":true},{"name":"서브쿼리","task":"전체 평균 급여보다 급여가 높은 직원의 name을 급여 내림차순으로 조회","sql":"SELECT name FROM emp WHERE salary>(SELECT AVG(salary) FROM emp) ORDER BY salary DESC;","hint":"WHERE의 AVG 서브쿼리","ordered":true},{"name":"CASE WHEN","task":"name과 salary 200 이상이면 HIGH, 아니면 NORMAL인 grade를 id 오름차순으로 조회","sql":"SELECT name,CASE WHEN salary>=200 THEN 'HIGH' ELSE 'NORMAL' END AS grade FROM emp ORDER BY id;","hint":"CASE WHEN","ordered":true},{"name":"윈도 함수","task":"name, dept_id, 부서 내 급여 순위 rnk. NULL 부서 제외, dept_id와 rnk 오름차순","sql":"SELECT name,dept_id,RANK() OVER(PARTITION BY dept_id ORDER BY salary DESC) AS rnk FROM emp WHERE dept_id IS NOT NULL ORDER BY dept_id,rnk;","hint":"PARTITION BY","ordered":true},{"name":"주문 총액","task":"고객별 customer_id, 주문금액 합계 total. 200 이상 고객만 id 오름차순 조회","sql":"SELECT customer_id,SUM(amount) AS total FROM orders GROUP BY customer_id HAVING SUM(amount)>=200 ORDER BY customer_id;","hint":"SUM + HAVING","ordered":true}];

(function(){
"use strict";
const TASKS=window.SQLD_LAB_TASKS, CDN="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/", KEY="sqld_lab_v1";
const INIT="CREATE TABLE dept(id INTEGER PRIMARY KEY,dept_name TEXT); INSERT INTO dept VALUES (10,'개발'),(20,'데이터'),(30,'마케팅'),(40,'디자인'); CREATE TABLE emp(id INTEGER PRIMARY KEY,name TEXT,dept_id INTEGER,salary INT,bonus INT); INSERT INTO emp VALUES (1,'지민',10,100,NULL),(2,'서연',10,200,30),(3,'민준',20,300,NULL),(4,'하늘',20,150,10),(5,'다온',NULL,250,20),(6,'유진',30,220,NULL); CREATE TABLE orders(id INTEGER PRIMARY KEY,customer_id INT,amount INT); INSERT INTO orders VALUES (1,101,100),(2,101,200),(3,102,50),(4,103,120),(5,103,90);";
let ix=0,inputs={},passed={},message="",busy=false,Sql=null,loader=null;
try{const d=JSON.parse(localStorage.getItem(KEY)||"{}");inputs=d.inputs||{};passed=d.passed||{}}catch(e){}
const esc=s=>String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify({inputs,passed}))}catch(e){}};
const $=id=>document.getElementById(id);
function show(){
 const q=TASKS[ix],ok=Object.values(passed).filter(Boolean).length;
 $("lab").innerHTML='<div class="topbar"><a class="btn small" href="./">‹ 모의고사 돌아가기</a><span class="chip">SQLD QUERY LAB</span></div>'+
 '<div class="main" style="max-width:1260px"><div class="eyebrow">BROWSER SQL PRACTICE</div><h1>SQL 직접 실행 연습실</h1>'+
 '<p class="sub">SQLD 대비 · SELECT / JOIN / GROUP BY / 서브쿼리 / 윈도 함수</p>'+
 '<div class="grid stats"><div class="stat"><div class="label">총 연습문제</div><strong>'+TASKS.length+'</strong></div><div class="stat"><div class="label">통과한 문제</div><strong>'+ok+'</strong></div><div class="stat"><div class="label">샘플 데이터</div><strong>3<small>테이블</small></strong></div><div class="stat"><div class="label">엔진</div><strong style="font-size:18px">SQLite</strong></div></div>'+
 '<div class="notice"><strong>SQLD 시험과 다른 점</strong><p>이 실습실은 SQLite를 브라우저에서 실행하는 학습 도구입니다. Oracle SQL과는 함수·NULL·날짜·계층형 문법에 차이가 있습니다. 엔진을 처음 다운로드할 때 인터넷 연결이 필요하며 SQL 코드를 별도 채점 서버로 전송하지 않습니다.</p></div>'+
 '<div class="grid two" style="margin-top:17px"><section class="panel"><h3>실습 문제 목록</h3>'+
 TASKS.map((t,i)=>'<button data-lab="choose" data-i="'+i+'" class="choicecard '+(i===ix?"on":"")+'" style="width:100%;margin:7px 0"><b>'+(i+1)+'. '+esc(t.name)+'</b><small>'+esc(t.task)+'</small>'+(passed[i]?'<span class="chip good">통과</span>':"")+'</button>').join("")+
 '</section><section class="panel"><div class="row"><span class="chip">문제 '+(ix+1)+' / '+TASKS.length+'</span><span class="chip gray">'+esc(q.name)+'</span></div>'+
 '<h2 style="font-size:18px;margin-top:15px">'+esc(q.name)+'</h2><p class="sub">'+esc(q.task)+'</p>'+
 '<details><summary style="cursor:pointer;color:#6957c1;font-size:12px;font-weight:800">샘플 데이터와 테이블 구조 보기</summary>'+
 '<pre class="fixtures">'+esc("DEPT(id,dept_name): (10,개발),(20,데이터),(30,마케팅),(40,디자인)\nEMP(id,name,dept_id,salary,bonus):\n1 지민 10 100 NULL\n2 서연 10 200 30\n3 민준 20 300 NULL\n4 하늘 20 150 10\n5 다온 NULL 250 20\n6 유진 30 220 NULL\nORDERS(id,customer_id,amount):\n1 101 100\n2 101 200\n3 102 50\n4 103 120\n5 103 90")+'</pre></details>'+
 '<label class="label" for="sql-input">SQL SELECT 문 작성</label><textarea id="sql-input" class="sqlbox" spellcheck="false">'+esc(inputs[ix]||"SELECT ")+'</textarea>'+
 '<div class="toolbar"><button class="btn primary" data-lab="run" '+(busy?"disabled":"")+'>'+(busy?"실행 중...":"▶ 실행·정답 비교")+'</button><button class="btn" data-lab="hint">힌트</button><button class="btn" data-lab="solution">모범 SQL</button><button class="btn warn" data-lab="clear">초기화</button></div>'+
 '<div id="sql-output" role="status">'+message+'</div><div class="notice"><strong>자동 채점 안내</strong><p>반환된 컬럼 수와 값들을 모범 SQL 결과와 비교합니다. ORDER BY가 필요한 문제에서는 행 순서도 확인합니다.</p></div></section></div>'+
 '<footer class="footer">SQLD STUDY LAB · 비공식 자체 제작 연습 · SQLite와 Oracle 차이에 주의</footer></div>';
}
function resultTable(r){if(!r.columns.length)return '<p class="sub">결과 없음</p>';return '<div class="labresults"><table class="labtable"><thead><tr>'+r.columns.map(x=>'<th>'+esc(x)+'</th>').join("")+'</tr></thead><tbody>'+r.values.slice(0,100).map(row=>'<tr>'+row.map(v=>'<td>'+esc(v==null?"NULL":v)+'</td>').join("")+'</tr>').join("")+'</tbody></table></div>'}
async function getEngine(){
 if(Sql)return Sql;
 if(!loader)loader=new Promise((resolve,reject)=>{
  if(typeof window.initSqlJs==="function"){resolve(window.initSqlJs);return}
  const script=document.createElement("script");script.src=CDN+"sql-wasm.js";
  script.onload=()=>resolve(window.initSqlJs);
  script.onerror=()=>reject(Error("SQLite 엔진 다운로드 실패. 인터넷을 확인하세요."));
  document.head.appendChild(script);
 }).then(fn=>fn({locateFile:file=>CDN+file})).then(mod=>(Sql=mod)).catch(e=>{loader=null;throw e});
 return loader;
}
function query(mod,src){const db=new mod.Database();try{db.run(INIT);return db.exec(src)[0]||{columns:[],values:[]}}finally{db.close()}}
function normalize(x,sorted){return JSON.stringify({cols:x.columns.length,rows:sorted?x.values:x.values.map(x=>JSON.stringify(x)).sort()})}
async function execute(){
 if(busy)return;const q=TASKS[ix],src=(inputs[ix]||"").trim();
 if(!/^(SELECT|WITH)\b/i.test(src)||(/;\s*\S/.test(src))||(src.match(/;/g)||[]).length>1){message='<div class="notice">조회문 SELECT 또는 WITH 하나만 입력해 주세요.</div>';show();return}
 busy=true;message='<div class="notice"><strong>SQL 실행 엔진을 준비합니다.</strong></div>';show();
 try{
  const mod=await getEngine(),got=query(mod,src),expected=query(mod,q.sql),same=normalize(got,q.ordered)===normalize(expected,q.ordered);
  if(same)passed[ix]=true;save();
  message='<div class="notice"><strong>'+(same?"정답입니다! 결과가 일치합니다.":"결과가 다릅니다. 조건과 정렬을 확인해 보세요.")+'</strong><p>내 SQL 결과</p>'+resultTable(got)+(same?"":'<p>모범 결과</p>'+resultTable(expected))+'</div>';
 }catch(e){message='<div class="notice"><strong>실행 오류</strong><p>'+esc(String(e.message||e).slice(0,500))+'</p></div>'}
 busy=false;show();
}
document.addEventListener("click",event=>{
 const t=event.target.closest("[data-lab]");if(!t)return;
 if(t.dataset.lab==="choose"){ix=Number(t.dataset.i);message="";show()}
 if(t.dataset.lab==="hint"){message='<div class="notice"><strong>힌트</strong><p>'+esc(TASKS[ix].hint)+'</p></div>';show()}
 if(t.dataset.lab==="solution"){message='<div class="notice"><strong>모범 SQL</strong><pre class="sqlcode">'+esc(TASKS[ix].sql)+'</pre></div>';show()}
 if(t.dataset.lab==="clear"){inputs[ix]="SELECT ";message="";save();show()}
 if(t.dataset.lab==="run"){inputs[ix]=$("sql-input").value;save();execute()}
});
document.addEventListener("input",event=>{if(event.target.id==="sql-input"){inputs[ix]=event.target.value;save()}});
show();
})();