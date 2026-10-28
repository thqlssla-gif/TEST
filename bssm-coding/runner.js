/* 학습자 코드만 독립 Worker에서 실행. 브라우저 저장 데이터에는 접근하지 않습니다. */
let engine;
const indexURL="https://cdn.jsdelivr.net/pyodide/v0.27.7/full/";
async function prepare(){
  if(engine)return engine;
  importScripts(indexURL+"pyodide.js");
  engine=await loadPyodide({indexURL});
  self.postMessage({kind:"loaded"});
  return engine;
}
function norm(s){return String(s||"").replace(/\r\n/g,"\n").trimEnd().split("\n").map(x=>x.trimEnd()).join("\n").trim();}
async function runOne(py,source,input){
  py.globals.set("__bssm_source",source);
  py.globals.set("__bssm_input",input);
  const json=await py.runPythonAsync(
    'import sys,io,json,contextlib,traceback\n'+
    '__bssm_old_input=sys.stdin\n'+
    'sys.stdin=io.StringIO(__bssm_input)\n'+
    '__bssm_out=io.StringIO()\n'+
    '__bssm_err=io.StringIO()\n'+
    'try:\n'+
    '    with contextlib.redirect_stdout(__bssm_out), contextlib.redirect_stderr(__bssm_err):\n'+
    '        exec(compile(__bssm_source,"<student>","exec"),{"__name__":"__main__"})\n'+
    'except BaseException:\n'+
    '    with contextlib.redirect_stderr(__bssm_err):\n'+
    '        traceback.print_exc(limit=4)\n'+
    'finally:\n'+
    '    sys.stdin=__bssm_old_input\n'+
    'json.dumps({"out":__bssm_out.getvalue(),"error":__bssm_err.getvalue()},ensure_ascii=False)'
  );
  return JSON.parse(json);
}
self.onmessage=async ev=>{
 if(!ev.data||ev.data.type!=="run")return;
 const {requestId,source,cases}=ev.data;
 try{
  const py=await prepare();
  const rows=[];
  for(let i=0;i<cases.length;i++){
    const result=await runOne(py,source,cases[i].input);
    rows.push({input:cases[i].input,expected:cases[i].output,actual:result.out,error:result.error,ok:!result.error&&norm(result.out)===norm(cases[i].output)});
    if(result.error)break;
  }
  self.postMessage({kind:"result",requestId,rows,passed:rows.filter(x=>x.ok).length,total:cases.length,allPassed:rows.length===cases.length&&rows.every(x=>x.ok)});
 }catch(err){self.postMessage({kind:"error",requestId,message:String(err&&err.message||err).slice(0,450)})}
};