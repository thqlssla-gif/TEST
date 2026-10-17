'use strict';
(() => {
  const { chapters, lessons } = STUDY_DATA;
  const $ = (id) => document.getElementById(id);
  const STORAGE = 'python-lab-v1';
  const CLOUD_MODE = Boolean(window.PyLabAccounts?.configured);
  // 계정 모드에서는 공용 PC에 학생 코드나 성적을 남기지 않습니다.
  const load = () => { if (CLOUD_MODE) return {}; try { return JSON.parse(localStorage.getItem(STORAGE)) || {}; } catch { return {}; } };
  const state = Object.assign({ solved: [], drafts: {}, freeCode: '# 여기에 자유롭게 파이썬 코드를 작성해 보세요\nfor n in range(1, 4):\n    print(f"파이썬 연습 {n}일 차!")\n', last: 1 }, load());
  if (!Array.isArray(state.solved)) state.solved = [];
  if (!state.drafts || typeof state.drafts !== 'object') state.drafts = {};
  let selected = 1, expanded = 0, worker = null, readyPromise = null, inflight = null, inflightId = 0, busy = false, toastTimer;
  const save = ({ skipCloud = false } = {}) => {
    if (CLOUD_MODE) { if (!skipCloud) window.PyLabAccounts?.queueSave(state); return; }
    try { localStorage.setItem(STORAGE, JSON.stringify(state)); } catch (_) {}
  };
  const current = () => lessons[selected - 1];
  function toast(message) { const el = $('toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2600); }
  function setStatus(text, type = '') { $('runtimeStatus').textContent = text; $('runtimeDot').className = 'runtime-dot ' + type; }
  function setBusy(on) { busy = on; for (const id of ['runBtn','gradeBtn','freeRunBtn']) $(id).disabled = on; }
  function resetWorker() { try { worker?.terminate(); } catch (_) {} worker = null; readyPromise = null; }
  function bootWorker() {
    if (readyPromise) return readyPromise;
    setStatus('파이썬 실행 환경을 불러오는 중...', 'loading');
    readyPromise = new Promise((resolve, reject) => {
      worker = new Worker('py-worker.js');
      let settled = false;
      const timeout = setTimeout(() => { if (!settled) { settled = true; resetWorker(); reject(new Error('실행 환경을 불러오지 못했어요. 인터넷 연결을 확인하고 다시 실행해 주세요.')); } }, 60000);
      worker.onmessage = ({ data }) => {
        if (data.type === 'ready') { if (!settled) { settled = true; clearTimeout(timeout); setStatus('파이썬 실행 준비 완료'); resolve(worker); } }
        else if (data.type === 'boot-error') { if (!settled) { settled = true; clearTimeout(timeout); resetWorker(); reject(new Error('파이썬 로딩 실패: ' + data.message)); } }
        else if (data.type === 'result' && inflight?.id === data.id) { const job = inflight; inflight = null; clearTimeout(job.timer); job.resolve(data); }
      };
      worker.onerror = (event) => { event.preventDefault(); if (!settled) { settled = true; clearTimeout(timeout); resetWorker(); reject(new Error('실행 환경을 시작할 수 없어요.')); } else if (inflight) { const job = inflight; inflight = null; clearTimeout(job.timer); resetWorker(); job.reject(new Error('실행 중 오류가 발생했어요.')); } };
    });
    return readyPromise;
  }
  async function runPython(source, grade = false, tests = []) {
    await bootWorker();
    return await new Promise((resolve, reject) => {
      const id = ++inflightId;
      const timer = setTimeout(() => { if (inflight?.id === id) { inflight = null; resetWorker(); reject(new Error('코드 실행이 6초를 초과했어요. 무한 반복문이 있는지 확인해 주세요.')); } }, 6000);
      inflight = { id, timer, resolve, reject };
      worker.postMessage({ type: 'run', id, source, grade, tests });
    });
  }
  function updateProgress() {
    const completed = new Set(state.solved).size;
    $('chapterCount').textContent = chapters.length;
    $('lessonCount').textContent = lessons.length;
    $('completedCount').textContent = completed;
    const percentage = Math.round(completed / lessons.length * 100);
    $('progressPercent').textContent = percentage + '%';
    $('progressBar').style.width = percentage + '%';
  }
  function renderSidebar() {
    const container = $('chapterList');
    container.replaceChildren();
    for (const ch of chapters) {
      const related = lessons.filter(l => l.chapter === ch.id);
      const done = related.filter(l => state.solved.includes(l.id)).length;
      const outer = document.createElement('div'); outer.className = 'chapter' + (expanded === ch.id ? ' open' : '');
      const heading = document.createElement('button'); heading.type = 'button'; heading.className = 'chapter-head' + (current().chapter === ch.id ? ' active' : '');
      heading.setAttribute('aria-expanded', String(expanded === ch.id));
      heading.innerHTML = `<span class="chapter-icon">${ch.icon}</span><span class="chapter-label"></span><span class="chapter-progress">${done}/${related.length}</span><span class="chevron">⌄</span>`;
      heading.querySelector('.chapter-label').textContent = ch.title;
      heading.addEventListener('click', () => { expanded = expanded === ch.id ? -1 : ch.id; renderSidebar(); });
      outer.append(heading);
      if (expanded === ch.id) {
        const inner = document.createElement('div'); inner.className = 'lesson-links';
        for (const lesson of related) {
          const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'lesson-link' + (selected === lesson.id ? ' selected' : '');
          btn.setAttribute('aria-current', selected === lesson.id ? 'step' : 'false');
          const idx = document.createElement('span'); idx.className = 'lesson-index'; idx.textContent = String(lesson.id).padStart(2,'0');
          const name = document.createElement('span'); name.textContent = lesson.title;
          btn.append(idx,name);
          if (state.solved.includes(lesson.id)) { const tick = document.createElement('span'); tick.className = 'lesson-done'; tick.textContent = '✓'; btn.append(tick); }
          btn.addEventListener('click', () => { navigate(lesson.id); if (window.innerWidth <= 830) { $('sidebar').classList.remove('mobile-open'); $('sidebarToggle').setAttribute('aria-expanded','false'); } });
          inner.append(btn);
        }
        outer.append(inner);
      }
      container.append(outer);
    }
  }
  function updateLines() { const area = $('codeInput'); const count = Math.max(10, area.value.split('\n').length); $('lineNumbers').textContent = Array.from({length:count},(_,i) => i+1).join('\n'); $('lineNumbers').scrollTop = area.scrollTop; }
  function setOutput(text, tone = '', badge = 'OUTPUT', results = null) {
    $('outputText').textContent = text; $('outputText').className = 'has-output';
    $('resultBadge').textContent = badge; $('resultBadge').className = 'result-badge ' + tone;
    const host = $('testResults'); host.replaceChildren(); host.hidden = !results?.length;
    for (const test of (results || [])) { const row = document.createElement('div'); row.className = 'test-item ' + (test.passed ? 'pass' : 'fail'); row.textContent = (test.passed ? '✓ ' : '✕ ') + test.name; host.append(row); }
  }
  function navigate(id, updateHash = true) {
    if (!Number.isInteger(id) || id < 1 || id > lessons.length) id = 1;
    selected = id; state.last = id; save();
    const lesson = current(); const chapter = chapters[lesson.chapter]; expanded = chapter.id;
    $('breadcrumbChapter').textContent = chapter.title;
    $('breadcrumbLesson').textContent = lesson.title;
    $('difficulty').textContent = lesson.difficulty; $('difficulty').className = 'difficulty ' + (lesson.difficulty === '중급' ? 'mid' : lesson.difficulty === '도전' ? 'hard' : '');
    $('lessonNumber').textContent = 'LESSON ' + String(id).padStart(2,'0');
    $('lessonTitle').textContent = lesson.title;
    $('lessonDescription').textContent = lesson.description;
    $('conceptText').textContent = lesson.concept;
    $('exampleCode').textContent = lesson.example;
    $('challengeText').textContent = lesson.prompt;
    $('successMark').hidden = !state.solved.includes(id);
    $('codeInput').value = Object.hasOwn(state.drafts, id) ? state.drafts[id] : lesson.starter;
    $('saveStatus').textContent = '자동 저장';
    $('hintText').textContent = lesson.hint; $('hintText').hidden = true;
    $('answerText').hidden = true; $('solutionCode').textContent = lesson.solution;
    $('prevBtn').disabled = id === 1; $('nextBtn').disabled = id === lessons.length;
    $('lessonPosition').textContent = `${id} / ${lessons.length}`;
    $('outputText').textContent = '▶ 실행하기를 누르면 결과가 여기에 표시돼요.';
    $('outputText').className = '';
    $('resultBadge').textContent = 'OUTPUT'; $('resultBadge').className = 'result-badge';
    $('testResults').hidden = true; $('testResults').replaceChildren();
    updateLines(); renderSidebar();
    if (updateHash) history.replaceState(null,'','#lesson-' + id);
  }
  async function submitCode(grade) {
    if (busy) return;
    setBusy(true);
    const lessonId = selected;
    const source = $('codeInput').value;
    setOutput('파이썬 코드를 실행하는 중이에요...', '', 'RUNNING');
    try {
      const result = await runPython(source, grade, grade ? current().tests : []);
      if (selected !== lessonId) return;
      if (result.error) {
        setOutput('❌ ' + result.error + (result.output ? '\n\n출력된 내용:\n' + result.output : ''), 'bad', 'ERROR');
      } else if (grade) {
        const passed = result.tests?.length > 0 && result.tests.every(t => t.passed);
        if (passed) {
          if (!state.solved.includes(lessonId)) { state.solved.push(lessonId); save(); toast('🎉 정답이에요! +10 XP 획득'); }
          else toast('✨ 이미 해결한 문제예요. 다시 잘 풀었어요!');
          $('successMark').hidden = false; updateProgress(); renderSidebar();
        }
        setOutput((passed ? '🎉 모든 테스트 통과! 정답이에요.\n\n' : '🔎 아직 통과하지 못한 테스트가 있어요. 다시 시도해 보세요.\n\n') + (result.output || '(출력 내용 없음)'), passed ? 'good' : 'bad', passed ? 'PASSED' : 'TRY AGAIN', result.tests);
      } else {
        setOutput(result.output || '✓ 정상적으로 실행됐어요. (print 출력 없음)', 'good', 'EXECUTED');
      }
    } catch (error) { setOutput('⚠️ ' + error.message, 'bad', 'ERROR'); setStatus('다시 실행할 수 있어요', 'error'); }
    finally { setBusy(false); }
  }
  function bindEditor(el, persist) {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') { e.preventDefault(); const p = el.selectionStart; const end = el.selectionEnd; el.setRangeText('    ',p,end,'end'); el.dispatchEvent(new Event('input')); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); el === $('codeInput') ? submitCode(false) : submitFree(); }
    });
    el.addEventListener('input', persist);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast('📋 코드가 복사되었어요.'); }
    catch { toast('복사할 수 없어요. 코드를 선택해서 복사해 주세요.'); }
  }
  function openFree() { $('freeModal').hidden = false; $('freeCode').value = state.freeCode; $('freeCode').focus(); document.body.style.overflow = 'hidden'; }
  function closeFree() { $('freeModal').hidden = true; document.body.style.overflow = ''; }
  async function submitFree() {
    if (busy) return;
    setBusy(true); $('freeOutput').textContent = '파이썬 코드를 실행하는 중이에요...'; $('freeRunStatus').textContent = '실행 중...';
    try {
      const result = await runPython($('freeCode').value, false, []);
      $('freeOutput').textContent = result.error ? '❌ ' + result.error : (result.output || '✓ 코드 실행 완료 (출력 내용 없음)');
      $('freeRunStatus').textContent = result.error ? '오류 발생' : '실행 완료 ✓';
    } catch (error) { $('freeOutput').textContent = '⚠️ ' + error.message; $('freeRunStatus').textContent = '실행 실패'; }
    finally { setBusy(false); }
  }
  $('sidebarToggle').addEventListener('click', () => { const next = !$('sidebar').classList.contains('mobile-open'); $('sidebar').classList.toggle('mobile-open', next); $('sidebarToggle').setAttribute('aria-expanded',String(next)); });
  bindEditor($('codeInput'), () => { state.drafts[selected] = $('codeInput').value; save(); updateLines(); });
  $('codeInput').addEventListener('scroll', () => { $('lineNumbers').scrollTop = $('codeInput').scrollTop; });
  bindEditor($('freeCode'), () => { state.freeCode = $('freeCode').value; save(); });
  $('copyExampleBtn').addEventListener('click', () => copy(current().example));
  $('restoreBtn').addEventListener('click', () => { if (!confirm('이 문제의 작성 중인 코드를 초기 코드로 되돌릴까요?')) return; $('codeInput').value = current().starter; delete state.drafts[selected]; save(); updateLines(); toast('초기 코드로 되돌렸어요.'); });
  $('answerBtn').addEventListener('click', () => { const next = $('answerText').hidden; $('answerText').hidden = !next; if (next) $('answerText').scrollIntoView({behavior:'smooth',block:'nearest'}); });
  $('copyAnswerBtn').addEventListener('click', () => copy(current().solution));
  $('hintBtn').addEventListener('click', () => { $('hintText').hidden = !$('hintText').hidden; });
  $('runBtn').addEventListener('click', () => submitCode(false)); $('gradeBtn').addEventListener('click', () => submitCode(true));
  $('prevBtn').addEventListener('click', () => { navigate(selected - 1); $('practice').scrollIntoView({behavior:'smooth'}); });
  $('nextBtn').addEventListener('click', () => { navigate(selected + 1); $('practice').scrollIntoView({behavior:'smooth'}); });
  $('resetBtn').addEventListener('click', () => { if (!confirm('모든 문제의 정답 기록과 작성 중인 코드를 정말 삭제할까요?')) return; state.solved = []; state.drafts = {}; state.last = 1; save(); updateProgress(); navigate(1); toast('학습 기록을 초기화했어요.'); });
  $('freeModeBtn').addEventListener('click', openFree); $('closeFreeBtn').addEventListener('click', closeFree);
  $('freeModal').addEventListener('click', e => { if (e.target === $('freeModal')) closeFree(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('freeModal').hidden) closeFree(); });
  $('freeRunBtn').addEventListener('click', submitFree);
  window.addEventListener('hashchange', () => { const id = Number(location.hash.match(/^#lesson-(\d+)$/)?.[1]); if (id && id !== selected) navigate(id, false); });
  // 인증된 학생으로 전환할 때 다른 사용자의 코드가 노출되지 않도록 전체 상태를 교체합니다.
  window.PythonLab = {
    applySnapshot(snapshot = {}) {
      state.solved = Array.isArray(snapshot.solved) ? [...new Set(snapshot.solved.filter(n => Number.isInteger(n) && n >= 1 && n <= lessons.length))] : [];
      state.drafts = snapshot.drafts && typeof snapshot.drafts === 'object' ? { ...snapshot.drafts } : {};
      state.freeCode = typeof snapshot.freeCode === 'string' ? snapshot.freeCode : '';
      state.last = Number(snapshot.last) || 1;
      $('freeCode').value = state.freeCode;
      $('freeOutput').textContent = '실행 결과가 여기에 표시돼요.';
      updateProgress();
      navigate(state.last, false);
      save({ skipCloud: true });
    },
    getSnapshot() { return { solved: [...state.solved], drafts: { ...state.drafts }, freeCode: state.freeCode, last: state.last }; }
  };
  updateProgress();
  const start = Number(location.hash.match(/^#lesson-(\d+)$/)?.[1]) || Number(state.last) || 1;
  navigate(start, !location.hash || location.hash.startsWith('#lesson-'));
})();