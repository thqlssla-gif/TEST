/* Browser-local C execution using c2wasm (MIT). No student code is uploaded to a grading server.
   The compiler binary is downloaded from the public upstream project:
   https://divsmith.github.io/c2wasm/compiler.wasm
   Supports a subset of C89/C90; each challenge is a solve(...) function. */
"use strict";
importScripts("./c-wasi-harness.js");
const BIN_URL="https://divsmith.github.io/c2wasm/compiler.wasm";
let compilerModule=null;
let preparePromise=null;
const textEncoder=new TextEncoder();
const canonical=s=>String(s==null?"":s).replace(/\r\n/g,"\n").trimEnd().split("\n").map(x=>x.trimEnd()).join("\n").trim();
async function prepare(){
 if(compilerModule)return compilerModule;
 if(!preparePromise)preparePromise=fetch(BIN_URL,{mode:"cors"}).then(r=>{
  if(!r.ok)throw Error("C 컴파일러 다운로드 오류: HTTP "+r.status);
  return r.arrayBuffer()
 }).then(bytes=>WebAssembly.compile(bytes)).then(mod=>(compilerModule=mod)).catch(err=>{
  preparePromise=null;throw err
 });
 return preparePromise;
}
function executeWasm(module,config){
 const ctx=createWasiHarness(config);
 const inst=new WebAssembly.Instance(module,ctx.imports);
 ctx.setMemory(inst.exports.memory);
 try{inst.exports._start()}catch(err){
  if(!ctx.isExit(err))throw err;
  if(ctx.exitCode!==0)throw Error(ctx.stderr||"프로그램 종료 코드: "+ctx.exitCode);
 }
 return ctx;
}
async function compile(source,compiler){
 // c2wasm supports common built-ins such as printf without a header.
 // Remove standard header declarations to avoid virtual-file include errors.
 const clean=source.replace(/^[ \t]*#\s*include\s*<\s*(stdio|stdlib|string|ctype|math)\.h\s*>[ \t]*$/gm,"");
 const ctx=executeWasm(compiler,{mode:"buffer",rawMode:true,inputBytes:textEncoder.encode(clean),args:["c2wasm","-b"]});
 const bin=ctx.stdoutBytes;
 if(!bin.length)throw Error((ctx.stderr||"C 코드 컴파일 오류").slice(0,500));
 return WebAssembly.compile(bin);
}
async function run(source,compiler){
 const compiled=await compile(source,compiler);
 const ctx=executeWasm(compiled,{mode:"buffer",inputBytes:new Uint8Array(0),args:["student-program"]});
 return {out:ctx.stdout,error:ctx.stderr};
}
self.onmessage=async event=>{
 const msg=event.data||{};
 if(msg.type!=="run")return;
 const {requestId,source,cases}=msg;
 try{
  const compiler=await prepare();
  self.postMessage({kind:"loaded",requestId});
  const rows=[];
  for(const item of cases){
   let actual="",error="";
   try{
    // Individual test input is represented by a C function-call statement.
    // The student's function definition is unchanged; only a generated main is appended.
    const wrapped=source+"\nint main(void) {\n"+item.call+"\nreturn 0;\n}\n";
    const output=await run(wrapped,compiler);
    actual=output.out;
    error=output.error||"";
   }catch(err){error=String(err&&err.message||err).slice(0,400)}
   rows.push({input:item.input,expected:item.output,actual,error,ok:!error&&canonical(actual)===canonical(item.output)});
   if(error)break;
  }
  self.postMessage({kind:"result",requestId,rows,passed:rows.filter(x=>x.ok).length,total:cases.length,allPassed:rows.length===cases.length&&rows.every(x=>x.ok)});
 }catch(err){
  self.postMessage({kind:"error",requestId,message:"C 컴파일러 사용 불가: "+String(err&&err.message||err).slice(0,420)});
 }
};