'use strict'
/* ============================================================
   JS / MONO — app logic
   ============================================================ */
const LS = 'jsmono_v1',
  THEME_KEY = 'jsmono_theme',
  XPV = { read: 10, quiz: 20, practice: 30 }

const def = () => ({
  xp: 0,
  completed: [],
  visited: [],
  quizScore: {},
  quizPerfect: {},
  practice: [],
  challenges: [],
  notes: {},
  flips: 0,
  notedOnce: false,
  usedTracer: false,
  fcIndex: 0,
  lastLesson: null,
})
let S = load()
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(LS))
    return s ? { ...def(), ...s } : def()
  } catch {
    return def()
  }
}
function save() {
  try {
    localStorage.setItem(LS, JSON.stringify(S))
  } catch {}
}

const $ = (s) => document.querySelector(s)
const esc = (s) =>
  String(s).replace(
    /[&<>]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c],
  )
const lvlName = { beg: 'Beginner', int: 'Intermediate', adv: 'Advanced' }
const lvlTag = (l) => `<span class="lvl-tag">${lvlName[l] || l}</span>`
// inline lock glyph — inherits currentColor so we can force it white via CSS
const LOCK = `<svg class="lock-i" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`

/* total XP — single source of truth: recompute from actions, never drift */
function recomputeXP() {
  let xp = 0
  xp += S.completed.length * XPV.read
  xp += S.practice.length * XPV.practice
  for (const id in S.quizScore) xp += S.quizScore[id] * XPV.quiz
  for (const c of S.challenges) {
    const ch = CHALLENGES.find((x) => x.id === c)
    if (ch) xp += ch.xp
  }
  S.xp = xp
  return xp
}

/* ---------- routing ---------- */
let current = 'home'
/* ---------- sequential unlock ---------- */
// A lesson is unlocked if it's the first one, or the previous lesson is completed.
function isUnlocked(id) {
  const idx = COURSE.lessons.findIndex((l) => l.id === id)
  if (idx <= 0) return true
  return S.completed.includes(COURSE.lessons[idx - 1].id)
}
function lockReason(id) {
  const idx = COURSE.lessons.findIndex((l) => l.id === id)
  if (idx <= 0) return ''
  const prev = COURSE.lessons[idx - 1]
  return `Finish “${prev.title}” to unlock this lesson.`
}

function go(view, id) {
  // Block navigation to a locked lesson
  if (view === 'lesson' && id && !isUnlocked(id)) {
    toast(lockReason(id))
    return
  }
  document
    .querySelectorAll('.view')
    .forEach((v) => v.classList.remove('active'))
  $('#sidebar').classList.remove('open')
  $('#backdrop').classList.remove('show')
  window.scrollTo({ top: 0 })
  const map = {
    home: renderHome,
    lesson: () => renderLesson(id),
    tracer: renderTracer,
    challenges: renderChallenges,
    flashcards: renderFlashcards,
    revision: renderRevision,
    achievements: renderAchievements,
    stats: renderStats,
    notes: renderNotes,
  }
  $('#view-' + (view === 'lesson' ? 'lesson' : view)).classList.add('active')
  ;(map[view] || renderHome)()
  current = id || view
  highlightNav()
}
window.go = go
function highlightNav() {
  document
    .querySelectorAll('.side-item')
    .forEach((x) => x.classList.remove('active'))
  document
    .querySelectorAll(`.side-item[data-nav="${current}"]`)
    .forEach((x) => x.classList.add('active'))
}

/* ---------- sidebar ---------- */
function buildSidebar() {
  $('#lessonNav').innerHTML = COURSE.lessons
    .map((l) => {
      const locked = !isUnlocked(l.id)
      return `
    <div class="side-item ${S.completed.includes(l.id) ? 'done' : ''} ${locked ? 'locked' : ''}" data-nav="${l.id}" onclick="go('lesson','${l.id}')">
      <span>${l.title}</span><span class="lvl">${lvlName[l.level][0]}</span><span class="ok">✓</span><span class="lk">${LOCK}</span>
    </div>`
    })
    .join('')
}

/* ---------- header progress ---------- */
function refreshHeader() {
  recomputeXP()
  save()
  $('#xpNav').textContent = S.xp
  const total = COURSE.lessons.length,
    done = S.completed.length,
    pct = Math.round((done / total) * 100)
  // const C=62.8; $("#ring").style.strokeDashoffset=C-(C*pct/100);
  $('#ringPct').textContent = pct + '%'
}

/* ============================================================
   HOME
   ============================================================ */
function renderHome() {
  const total = COURSE.lessons.length,
    done = S.completed.length,
    pct = Math.round((done / total) * 100)
  const qIds = Object.keys(S.quizScore)
  const qAvg = qIds.length
    ? Math.round(
        (qIds.reduce((a, id) => {
          const l = COURSE.lessons.find((x) => x.id === id)
          return a + (l ? S.quizScore[id] / l.quiz.length : 0)
        }, 0) /
          qIds.length) *
          100,
      )
    : 0
  const next = COURSE.lessons.find((l) => !S.completed.includes(l.id))

  // ---- Progress dashboard data ----
  const finished = COURSE.lessons.filter((l) => S.completed.includes(l.id))
  const pending = COURSE.lessons.filter((l) => !S.completed.includes(l.id))
  // "currently reading" = last opened lesson that isn't yet completed; else the next unfinished one
  let current = null
  if (S.lastLesson && !S.completed.includes(S.lastLesson))
    current = COURSE.lessons.find((l) => l.id === S.lastLesson) || null
  if (!current) current = next || null

  const progressPanel = `
    <h2 class="sec-h">Your Progress</h2>
    <p class="sec-sub">A quick snapshot of where you are in the course.</p>
    <div class="prog-grid">
      <div class="prog-box">
        <div class="prog-num">${finished.length}<small>/${total}</small></div>
        <div class="prog-lbl">Finished</div>
      </div>
      <div class="prog-box">
        <div class="prog-num">${pending.length}<small>/${total}</small></div>
        <div class="prog-lbl">Pending</div>
      </div>
      <div class="prog-box wide">
        <div class="prog-lbl">Currently Reading</div>
        ${
          current
            ? `<div class="prog-cur" onclick="go('lesson','${current.id}')">
               <span class="prog-cur-no">${current.num}</span>
               <span class="prog-cur-t">${esc(current.title)}</span>
               <span class="prog-cur-go">Resume →</span>
             </div>`
            : `<div class="prog-cur done-all"><span class="prog-cur-t">✓ All lessons complete — nice work.</span></div>`
        }
      </div>
    </div>
    <div class="track-bar"><div class="track-fill" style="width:${pct}%"></div></div>
    <div class="track-legend">
      ${COURSE.lessons
        .map((l) => {
          const isDone = S.completed.includes(l.id)
          const isCur = current && l.id === current.id && !isDone
          const locked = !isUnlocked(l.id)
          const cls = locked
            ? 'tk-lock'
            : isDone
              ? 'tk-done'
              : isCur
                ? 'tk-cur'
                : 'tk-todo'
          const mark = locked ? LOCK : isDone ? '✓' : isCur ? '◉' : '○'
          return `<button class="tk-pill ${cls}" data-pill="${l.id}" onclick="lessonDetail('${l.id}')" title="${esc(l.title)}">${mark} ${l.num}</button>`
        })
        .join('')}
    </div>
    <div id="lessonDetail"></div>`

  $('#view-home').innerHTML = `
   <div class="wrap">
    <div class="hero">
      <div class="eyebrow">Interactive Course · 5 Modules</div>
      <h1>Master <em>JavaScript</em><br>from scratch.</h1>
      <p>Real-world analogies, visual diagrams, live code you can run, quizzes, a step-by-step execution tracer, and hands-on challenges. Built in black & white.</p>
      <div class="hero-btns">
        <button class="btn solid" onclick="go('lesson','${next ? next.id : 'l1'}')">${done > 0 && done < total ? 'Continue →' : 'Start Learning →'}</button>
        <button class="btn ghost" onclick="go('challenges')">Code Challenges</button>
        <button class="btn ghost" onclick="go('tracer')">Execution Tracer</button>
      </div>
    </div>

    <div class="stat-row">
      <div class="stat"><div class="k">Progress</div><div class="v">${pct}<small>%</small></div>
        <div class="mini-bar"><div style="width:${pct}%"></div></div></div>
      <div class="stat"><div class="k">Total XP</div><div class="v">${S.xp}</div></div>
      <div class="stat"><div class="k">Quiz Average</div><div class="v">${qAvg}<small>%</small></div></div>
    </div>

    ${progressPanel}

    <h2 class="sec-h">Lessons</h2>
    <p class="sec-sub">Every module is built from the course notes — explanation, analogy, diagrams, playground, quiz, interview prep & practice.</p>
    <div class="les-list">
      ${COURSE.lessons
        .map((l, i) => {
          const isDone = S.completed.includes(l.id)
          const visited = S.visited.includes(l.id)
          const qTotal = l.quiz ? l.quiz.length : 0
          const qScore =
            S.quizScore && S.quizScore[l.id] != null ? S.quizScore[l.id] : null
          const pTotal = l.practice ? l.practice.length : 0
          const iTotal = l.interview ? l.interview.length : 0
          const pgCount = l.blocks
            ? l.blocks.filter((b) => b.t === 'playground').length
            : 0
          // per-card progress: completion (50%) + quiz ratio (50%)
          const quizPct = qTotal ? (qScore || 0) / qTotal : 0
          const cardPct = Math.round(
            ((isDone ? 1 : 0) * 0.5 + quizPct * 0.5) * 100,
          )
          const statusCls = isDone ? 'done' : visited ? 'prog' : 'todo'
          const locked = !isUnlocked(l.id)
          const prevTitle = locked
            ? COURSE.lessons[i - 1]
              ? COURSE.lessons[i - 1].title
              : ''
            : ''
          const statusTxt = locked
            ? 'Locked'
            : isDone
              ? 'Completed'
              : visited
                ? 'In progress'
                : 'Start'
          return `
        <article class="les ${locked ? 'locked' : statusCls}" onclick="go('lesson','${l.id}')">
          <div class="les-idx">${locked ? LOCK : String(i + 1).padStart(2, '0')}</div>
          <div class="les-body">
            <div class="les-top">
              <span class="les-kicker">${esc(l.num)} · ${lvlName[l.level]}</span>
              <span class="les-status st-${locked ? 'locked' : statusCls}">${statusTxt}</span>
            </div>
            <h3>${esc(l.title)}</h3>
            <p>${locked ? `<span class="les-locknote">Finish “${esc(prevTitle)}” to unlock.</span>` : esc(l.blurb)}</p>
            <div class="les-stats">
              <span class="chip">⏱ ${esc(l.time)}</span>
              <span class="chip">◆ ${qTotal} quiz</span>
              <span class="chip">▣ ${pTotal} practice</span>
              <span class="chip">✦ ${iTotal} interview</span>
              ${pgCount ? `<span class="chip">▶ ${pgCount} live</span>` : ''}
            </div>
            <div class="les-prog"><div class="les-prog-fill" style="width:${locked ? 0 : cardPct}%"></div></div>
          </div>
          <div class="les-go">${locked ? LOCK : '→'}</div>
        </article>`
        })
        .join('')}
    </div>
   </div>`
}

/* Show a lesson's details in a table above the pills (without opening the lesson) */
window.lessonDetail = function (id) {
  const l = COURSE.lessons.find((x) => x.id === id)
  const box = $('#lessonDetail')
  if (!l || !box) return
  // toggle off if same pill clicked again
  if (box.getAttribute('data-open') === id) {
    box.innerHTML = ''
    box.removeAttribute('data-open')
    syncPillActive(null)
    return
  }
  box.setAttribute('data-open', id)
  syncPillActive(id)

  const locked = !isUnlocked(l.id)
  const isDone = S.completed.includes(l.id)
  const visited = S.visited.includes(l.id)
  const status = locked
    ? 'Locked'
    : isDone
      ? 'Completed'
      : visited
        ? 'In progress'
        : 'Not started'
  const qTotal = l.quiz ? l.quiz.length : 0
  const qScore =
    S.quizScore && S.quizScore[l.id] != null ? S.quizScore[l.id] : null
  const qCell =
    qScore != null ? `${qScore} / ${qTotal} correct` : `Not attempted`
  const pTotal = l.practice ? l.practice.length : 0
  const iTotal = l.interview ? l.interview.length : 0
  const pgCount = l.blocks
    ? l.blocks.filter((b) => b.t === 'playground').length
    : 0
  const idx = COURSE.lessons.findIndex((x) => x.id === id)
  const prevTitle = locked && idx > 0 ? COURSE.lessons[idx - 1].title : ''

  box.innerHTML = `
    <div class="ld-card">
      <div class="ld-head">
        <span class="ld-no">${esc(l.num)}</span>
        <div class="ld-title">
          <h3>${esc(l.title)}</h3>
          <p>${esc(l.blurb)}</p>
        </div>
        <span class="ld-status ld-${locked ? 'todo' : isDone ? 'done' : visited ? 'prog' : 'todo'}">${status}</span>
      </div>
      <table class="ld-table">
        <tr><th>Level</th><td>${lvlName[l.level]}</td></tr>
        <tr><th>Read time</th><td>${esc(l.time)}</td></tr>
        <tr><th>Status</th><td>${status}</td></tr>
        <tr><th>Quiz</th><td>${qCell}${qTotal ? ` · ${qTotal} questions` : ''}</td></tr>
        <tr><th>Practice problems</th><td>${pTotal}</td></tr>
        <tr><th>Interview questions</th><td>${iTotal}</td></tr>
        <tr><th>Live playgrounds</th><td>${pgCount}</td></tr>
      </table>
      <div class="ld-actions">
        ${
          locked
            ? `<span class="ld-lockmsg">${LOCK} Finish “${esc(prevTitle)}” to unlock this lesson.</span>`
            : `<button class="btn solid sm" onclick="go('lesson','${l.id}')">Open lesson →</button>`
        }
        <button class="btn ghost sm" onclick="lessonDetail('${l.id}')">Close</button>
      </div>
    </div>`
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}
function syncPillActive(id) {
  document.querySelectorAll('.tk-pill[data-pill]').forEach((p) => {
    p.classList.toggle('tk-sel', p.getAttribute('data-pill') === id)
  })
}

/* ============================================================
   LESSON
   ============================================================ */
function renderLesson(id) {
  const l = COURSE.lessons.find((x) => x.id === id)
  if (!l) {
    go('home')
    return
  }
  if (!S.visited.includes(id)) {
    S.visited.push(id)
    save()
    checkAch()
  }
  S.lastLesson = id
  save()
  const idx = COURSE.lessons.findIndex((x) => x.id === id)
  const prev = COURSE.lessons[idx - 1],
    next = COURSE.lessons[idx + 1]
  const learn =
    l.blocks.map((b, i) => renderBlock(b, l.id, i)).join('') +
    `<div class="block"><div class="summary"><h3>Summary — ${esc(l.title)}</h3><ul>${l.summary.map((s) => `<li>${s}</li>`).join('')}</ul></div></div>` +
    `<button class="mc ${S.completed.includes(l.id) ? 'done' : ''}" id="mcBtn" onclick="complete('${l.id}')">${S.completed.includes(l.id) ? '✓ Completed' : 'Mark Complete · +10 XP'}</button>
       <div class="nav-row">
         ${prev ? `<button class="btn ghost sm" onclick="go('lesson','${prev.id}')">← ${esc(prev.title)}</button>` : ''}
         ${next ? `<button class="btn ghost sm" onclick="go('lesson','${next.id}')">${esc(next.title)} →</button>` : `<button class="btn ghost sm" onclick="go('challenges')">Challenges →</button>`}
       </div>`

  const quiz =
    l.quiz.map((q, qi) => renderQuizQ(l.id, q, qi)).join('') +
    `<div class="qz-bar"><button class="btn ghost sm" onclick="resetQuiz('${l.id}')">↺ Retry</button><span class="qz-score" id="qs-${l.id}"></span></div>`

  $('#view-lesson').innerHTML = `
   <div class="wrap">
    <div class="lh">
      <div class="crumb">${l.num}</div>
      <h1>${esc(l.title)}</h1>
      <p>${l.blurb}</p>
      <div class="meta">${lvlTag(l.level)} <span class="lvl-tag">⏱ ${l.time}</span></div>
    </div>
    <div class="tabs">
      <button class="tab active" data-tab="learn" onclick="tab(this,'learn')">Learn</button>
      <button class="tab" data-tab="quiz" onclick="tab(this,'quiz')">Quiz</button>
      <button class="tab" data-tab="practice" onclick="tab(this,'practice')">Practice</button>
      <button class="tab" data-tab="interview" onclick="tab(this,'interview')">Interview Q</button>
      <button class="tab" data-tab="notes" onclick="tab(this,'notes')">Notes</button>
    </div>
    <div class="tabpane active" id="tp-learn">${learn}</div>
    <div class="tabpane" id="tp-quiz"><div id="quizArea-${l.id}">${quiz}</div></div>
    <div class="tabpane" id="tp-practice">${l.practice
      .map(
        (p, i) => `
      <div class="pr"><div class="top">${lvlTag(p.lvl)} <strong>Problem ${i + 1}</strong></div><p>${esc(p.q)}</p>
        <button class="btn ghost sm" onclick="solveP('${l.id}',${i},this)">${S.practice.includes(l.id + ':' + i) ? '✓ Solved — Toggle Answer' : 'Reveal Answer · +30 XP'}</button>
        <div class="ans" id="pa-${l.id}-${i}">${p.a}</div></div>`,
      )
      .join('')}</div>
    <div class="tabpane" id="tp-interview">${l.interview
      .map(
        (q) => `
      <div class="iq" onclick="this.classList.toggle('open')">
        <div class="q"><span class="q-lvl">${lvlName[q.lvl]}</span><span>${esc(q.q)}</span><span class="ar">›</span></div>
        <div class="a"><div class="in">${q.a}</div></div></div>`,
      )
      .join('')}</div>
    <div class="tabpane" id="tp-notes">
      <textarea class="notes" id="note-${l.id}" placeholder="Your notes for ${esc(l.title)}… saved automatically.">${esc(S.notes[l.id] || '')}</textarea>
      <div style="display:flex;gap:12px;align-items:center;margin-top:12px">
        <button class="btn solid sm" onclick="saveNote('${l.id}')">Save Notes</button>
        <span class="saved" id="saved-${l.id}">✓ saved</span>
      </div>
    </div>
   </div>`
  // auto-save note
  const ta = $('#note-' + l.id)
  let t
  ta.addEventListener('input', () => {
    clearTimeout(t)
    t = setTimeout(() => {
      S.notes[l.id] = ta.value
      S.notedOnce = true
      save()
      flashSaved(l.id)
      checkAch()
    }, 600)
  })
}
window.tab = function (btn, name) {
  const pane = btn.closest('.tabs').parentElement
  pane.querySelectorAll('.tab').forEach((b) => b.classList.remove('active'))
  pane.querySelectorAll('.tabpane').forEach((p) => p.classList.remove('active'))
  btn.classList.add('active')
  $('#tp-' + name).classList.add('active')
}

function renderBlock(b, lid, i) {
  switch (b.t) {
    case 'prose':
      return `<div class="block"><h2><span class="ic">${b.ic || '·'}</span>${esc(b.h)}</h2>${b.html}</div>`
    case 'analogy':
      return `<div class="analogy"><div class="t">Real-life analogy</div>${b.html}</div>`
    case 'callout':
      return `<div class="callout ${b.k === 'warn' ? 'warn' : ''}"><div class="t">${esc(b.tag)}</div>${b.html}</div>`
    case 'code':
      return `<pre class="code">${b.html}</pre>`
    case 'diagram':
      return `<div class="diagram"><div class="dt">${esc(b.title)}</div>${b.html}</div>`
    case 'table':
      return `<div class="block"><div class="tbl-wrap"><table class="tbl"><thead><tr>${b.head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`
    case 'playground':
      return renderPG(b, lid, i)
    default:
      return ''
  }
}

/* ---------- playground (real JS, sandboxed console) ---------- */
function renderPG(b, lid, i) {
  const id = `pg-${lid}-${i}`
  return `<div class="pg">
    <div class="pg-bar"><span class="ttl">▸ ${esc(b.title || 'playground.js')}</span><span class="sp"></span>
      <button class="btn sm solid" onclick="runPG('${id}')">▶ Run</button>
      <button class="btn sm ghost" onclick="resetPG('${id}')">↺ Reset</button></div>
    <div class="pg-body">
      <textarea class="pg-edit" id="${id}" spellcheck="false" data-init="${encodeURIComponent(b.code)}">${esc(b.code)}</textarea>
      <div class="pg-out" id="${id}-out"><div class="lbl">Console</div><div class="empty">Click Run.</div></div>
    </div></div>`
}
window.runPG = function (id) {
  const code = $('#' + id).value,
    out = $('#' + id + '-out'),
    logs = []
  const fmt = (v) =>
    typeof v === 'string'
      ? v
      : v === undefined
        ? 'undefined'
        : v === null
          ? 'null'
          : typeof v === 'object'
            ? (() => {
                try {
                  return JSON.stringify(v)
                } catch {
                  return String(v)
                }
              })()
            : String(v)
  const con = {
    log: (...a) => logs.push({ t: 'o', m: a.map(fmt).join(' ') }),
    error: (...a) => logs.push({ t: 'err', m: a.map(fmt).join(' ') }),
    warn: (...a) => logs.push({ t: 'o', m: a.map(fmt).join(' ') }),
    info: (...a) => logs.push({ t: 'o', m: a.map(fmt).join(' ') }),
  }
  try {
    new Function('console', 'prompt', 'alert', code)(
      con,
      (m) => {
        logs.push({ t: 'o', m: '[prompt] ' + (m || '') })
        return ''
      },
      () => {},
    )
  } catch (e) {
    logs.push({ t: 'err', m: '⚠ ' + e.name + ': ' + e.message })
  }
  out.innerHTML =
    `<div class="lbl">Console</div>` +
    (logs.length
      ? logs
          .map(
            (l) =>
              `<div class="o ${l.t === 'err' ? 'err' : ''}">${esc(l.m)}</div>`,
          )
          .join('')
      : `<div class="empty">Ran with no output.</div>`)
}
window.resetPG = function (id) {
  const ta = $('#' + id)
  ta.value = decodeURIComponent(ta.dataset.init)
  $('#' + id + '-out').innerHTML =
    `<div class="lbl">Console</div><div class="empty">Reset. Click Run.</div>`
}

/* tab indent in editors */
document.addEventListener('keydown', (e) => {
  if (
    e.key === 'Tab' &&
    e.target.classList &&
    (e.target.classList.contains('pg-edit') || e.target.id === 'tr-code')
  ) {
    e.preventDefault()
    const t = e.target,
      s = t.selectionStart
    t.value = t.value.slice(0, s) + '  ' + t.value.slice(t.selectionEnd)
    t.selectionStart = t.selectionEnd = s + 2
  }
})

/* ---------- quiz ---------- */
function renderQuizQ(lid, q, qi) {
  return `<div class="qz" id="qz-${lid}-${qi}">
    <div class="head"><span class="n">Q${qi + 1}.</span><span>${esc(q.q)}</span></div>
    ${q.opts.map((o, oi) => `<div class="opt" onclick="ansQuiz('${lid}',${qi},${oi})"><span class="mk"></span><span>${esc(o)}</span></div>`).join('')}
    <div class="exp" id="exp-${lid}-${qi}"></div></div>`
}
let qz = {}
window.ansQuiz = function (lid, qi, oi) {
  const l = COURSE.lessons.find((x) => x.id === lid),
    q = l.quiz[qi],
    box = $(`#qz-${lid}-${qi}`)
  if (box.dataset.done) return
  box.dataset.done = '1'
  box.querySelectorAll('.opt').forEach((el, i) => {
    el.classList.add('dis')
    if (i === q.ans) {
      el.classList.add('correct')
      el.querySelector('.mk').textContent = '✓'
    } else if (i === oi) {
      el.classList.add('wrong')
      el.querySelector('.mk').textContent = '✕'
    }
  })
  const exp = $(`#exp-${lid}-${qi}`)
  exp.textContent = q.exp
  exp.classList.add('show')
  qz[lid] = qz[lid] || { c: 0, done: new Set() }
  qz[lid].done.add(qi)
  if (oi === q.ans) qz[lid].c++
  if ((S.quizScore[lid] || 0) < qz[lid].c) S.quizScore[lid] = qz[lid].c
  $(`#qs-${lid}`).textContent = `Score: ${qz[lid].c} / ${l.quiz.length}`
  if (qz[lid].done.size === l.quiz.length && qz[lid].c === l.quiz.length) {
    S.quizPerfect[lid] = true
    $(`#qs-${lid}`).textContent += '  ◆ Perfect!'
  }
  refreshHeader()
  save()
  checkAch()
}
window.resetQuiz = function (lid) {
  const l = COURSE.lessons.find((x) => x.id === lid)
  qz[lid] = { c: 0, done: new Set() }
  $(`#quizArea-${lid}`).innerHTML =
    l.quiz.map((q, qi) => renderQuizQ(lid, q, qi)).join('') +
    `<div class="qz-bar"><button class="btn ghost sm" onclick="resetQuiz('${lid}')">↺ Retry</button><span class="qz-score" id="qs-${lid}"></span></div>`
}

/* ---------- practice ---------- */
window.solveP = function (lid, i, btn) {
  const el = $(`#pa-${lid}-${i}`)
  el.classList.toggle('show')
  const key = lid + ':' + i
  if (el.classList.contains('show') && !S.practice.includes(key)) {
    S.practice.push(key)
    refreshHeader()
    save()
    checkAch()
  }
  btn.textContent = el.classList.contains('show')
    ? '✓ Solved — Toggle Answer'
    : 'Solved — Show Answer'
}

/* ---------- complete ---------- */
window.complete = function (lid) {
  if (!S.completed.includes(lid)) {
    S.completed.push(lid)
    refreshHeader()
    save()
    const si = document.querySelector(`.side-item[data-nav="${lid}"]`)
    if (si) si.classList.add('done')
    const b = $('#mcBtn')
    if (b) {
      b.classList.add('done')
      b.textContent = '✓ Completed'
    }
    // unlock the next lesson visually
    buildSidebar()
    highlightNav()
    const idx = COURSE.lessons.findIndex((x) => x.id === lid)
    const nxt = COURSE.lessons[idx + 1]
    if (nxt) toast(`✓ Complete · +10 XP — “${nxt.title}” unlocked`)
    else toast('✓ Lesson complete · +10 XP')
  }
  checkAch()
}

/* ============================================================
   EXECUTION TRACER — steps through real for-loops too
   ============================================================ */
let trSteps = [],
  trCur = 0
function renderTracer() {
  S.usedTracer = true
  save()
  checkAch()
  $('#view-tracer').innerHTML = `
   <div class="wrap">
    <div class="lh"><div class="crumb">Tool</div><h1>Execution Tracer</h1>
      <p>Watch code run line by line and see variables change. Supports <code>let</code>/<code>const</code>, reassignment, and real <code>for</code> loops.</p>
      <div class="meta">${lvlTag('adv')}</div></div>
    <div class="tr-ex">
      <button class="btn ghost sm" onclick="loadTrace('vars')">Variables</button>
      <button class="btn ghost sm" onclick="loadTrace('loop')">For Loop</button>
      <button class="btn ghost sm" onclick="loadTrace('reassign')">Reassignment</button>
      <button class="btn ghost sm" onclick="loadTrace('types')">Type Coercion</button>
    </div>
    <div class="pg">
      <div class="pg-bar"><span class="ttl">▸ trace.js</span><span class="sp"></span>
        <button class="btn sm solid" onclick="startTrace()">▶ Trace</button>
        <button class="btn sm ghost" onclick="resetTrace()">↺ Reset</button></div>
      <div class="tr-grid">
        <textarea class="pg-edit" id="tr-code" spellcheck="false" style="min-height:240px">let total = 0;
for (let i = 1; i <= 4; i++) {
  total = total + i;
}
let done = true;</textarea>
        <div class="tr-vars"><div class="lbl">Variable State</div><div id="tr-live"></div></div>
      </div>
    </div>
    <div class="tr-steps" id="tr-steps">
      <div class="tr-nav">
        <button class="btn ghost sm" id="tr-prev" onclick="trStep(-1)">← Prev</button>
        <div class="tr-ind" id="tr-ind"></div>
        <button class="btn solid sm" id="tr-next" onclick="trStep(1)">Next →</button>
      </div>
      <div class="tr-out" id="tr-out"></div>
    </div>
   </div>`
}
window.loadTrace = function (k) {
  $('#tr-code').value = TRACE_EXAMPLES[k] || TRACE_EXAMPLES.vars
  $('#tr-steps').style.display = 'none'
  $('#tr-live').innerHTML = ''
}

/* A tiny tracer: tokenize into simple statements, execute a 'for' by unrolling at runtime.
   Supported: let/const decl, plain reassignment, single-level for(let i=..;cond;i++/i--/i+=n){ body }.
   Anything else → honest message. */
window.startTrace = function () {
  S.usedTracer = true
  save()
  checkAch()
  const src = $('#tr-code').value
  try {
    trSteps = buildTrace(src)
  } catch (e) {
    trSteps = [{ line: '(unsupported)', vars: {}, note: e.message }]
  }
  trCur = 0
  $('#tr-steps').style.display = 'block'
  drawTrace()
}
function evalExpr(expr, vars) {
  const ctx = Object.entries(vars)
    .map(([k, v]) => `let ${k}=${JSON.stringify(v)};`)
    .join('\n')
  return new Function(ctx + '\nreturn (' + expr.replace(/;+$/, '') + ');')()
}
function buildTrace(src) {
  const steps = []
  let vars = {}
  // crude statement splitter that respects for(...) headers and { } blocks
  const tokens = tokenize(src)
  function run(list) {
    for (const stmt of list) {
      if (stmt.type === 'decl' || stmt.type === 'assign') {
        let val
        try {
          val = evalExpr(stmt.expr, vars)
        } catch (e) {
          val = '(error: ' + e.message + ')'
        }
        vars[stmt.name] = val
        steps.push({ line: stmt.raw, vars: { ...vars } })
      } else if (stmt.type === 'for') {
        // init
        let val
        try {
          val = evalExpr(stmt.init.expr, vars)
        } catch (e) {
          val = '(err)'
        }
        vars[stmt.init.name] = val
        steps.push({ line: stmt.initRaw, vars: { ...vars } })
        let guard = 0
        while (true) {
          if (++guard > 500)
            throw new Error('loop too long for tracer (>500 iterations)')
          let cond
          try {
            cond = evalExpr(stmt.cond, vars)
          } catch (e) {
            cond = false
          }
          steps.push({
            line: 'check: ' + stmt.cond + ' → ' + cond,
            vars: { ...vars },
            faint: true,
          })
          if (!cond) break
          run(stmt.body)
          try {
            vars[stmt.upd.name] = evalExpr(stmt.upd.expr, vars)
          } catch (e) {}
          steps.push({ line: stmt.updRaw, vars: { ...vars } })
        }
      }
    }
  }
  run(tokens)
  if (!steps.length) throw new Error('nothing traceable found')
  return steps
}
function tokenize(src) {
  const out = []
  let i = 0
  const n = src.length
  function skipWs() {
    while (i < n && /\s/.test(src[i])) i++
  }
  while (i < n) {
    skipWs()
    if (i >= n) break
    // for loop
    if (/^for\b/.test(src.slice(i))) {
      const hStart = src.indexOf('(', i)
      let depth = 0,
        j = hStart
      for (; j < n; j++) {
        if (src[j] === '(') depth++
        else if (src[j] === ')') {
          depth--
          if (!depth) {
            break
          }
        }
      }
      const header = src.slice(hStart + 1, j)
      const parts = header.split(';')
      const initM = parts[0]
        .trim()
        .match(/(?:let|const|var)\s+(\w+)\s*=\s*(.+)/)
      const cond = (parts[1] || '').trim()
      const updRaw = (parts[2] || '').trim()
      const upd = parseUpdate(updRaw)
      // body
      let k = src.indexOf('{', j)
      let d2 = 0,
        m = k
      for (; m < n; m++) {
        if (src[m] === '{') d2++
        else if (src[m] === '}') {
          d2--
          if (!d2) {
            break
          }
        }
      }
      const bodySrc = src.slice(k + 1, m)
      out.push({
        type: 'for',
        init: { name: initM[1], expr: initM[2] },
        initRaw: 'init: ' + parts[0].trim(),
        cond,
        upd,
        updRaw: 'update: ' + updRaw,
        body: tokenize(bodySrc),
      })
      i = m + 1
      continue
    }
    // statement up to ;
    let semi = src.indexOf(';', i)
    if (semi < 0) semi = n
    const raw = src.slice(i, semi).trim()
    i = semi + 1
    if (!raw) {
      continue
    }
    const dM = raw.match(/^(?:let|const|var)\s+(\w+)\s*=\s*(.+)$/)
    const aM = raw.match(/^(\w+)\s*=\s*(.+)$/)
    if (dM) out.push({ type: 'decl', name: dM[1], expr: dM[2], raw })
    else if (aM) out.push({ type: 'assign', name: aM[1], expr: aM[2], raw })
    // else ignore (unsupported single statement)
  }
  return out
}
function parseUpdate(u) {
  let m
  if ((m = u.match(/^(\w+)\+\+$/))) return { name: m[1], expr: m[1] + '+1' }
  if ((m = u.match(/^\+\+(\w+)$/))) return { name: m[1], expr: m[1] + '+1' }
  if ((m = u.match(/^(\w+)--$/))) return { name: m[1], expr: m[1] + '-1' }
  if ((m = u.match(/^--(\w+)$/))) return { name: m[1], expr: m[1] + '-1' }
  if ((m = u.match(/^(\w+)\s*\+=\s*(.+)$/)))
    return { name: m[1], expr: m[1] + '+(' + m[2] + ')' }
  if ((m = u.match(/^(\w+)\s*-=\s*(.+)$/)))
    return { name: m[1], expr: m[1] + '-(' + m[2] + ')' }
  if ((m = u.match(/^(\w+)\s*=\s*(.+)$/))) return { name: m[1], expr: m[2] }
  return { name: '_', expr: 'undefined' }
}
window.trStep = function (d) {
  trCur = Math.max(0, Math.min(trSteps.length - 1, trCur + d))
  drawTrace()
}
function drawTrace() {
  const st = trSteps[trCur]
  $('#tr-ind').textContent = `Step ${trCur + 1} of ${trSteps.length}`
  $('#tr-prev').disabled = trCur === 0
  $('#tr-next').disabled = trCur === trSteps.length - 1
  const cells =
    Object.entries(st.vars)
      .map(
        ([k, v]) =>
          `<div class="tr-cell"><div class="nm">${esc(k)}</div><div class="vl">${esc(JSON.stringify(v))}</div><div class="ty">${typeof v}</div></div>`,
      )
      .join('') ||
    '<span class="muted" style="color:var(--ink3)">no variables yet</span>'
  $('#tr-out').innerHTML =
    `<div class="tr-line">${esc(st.line)}${st.note ? '  — ' + esc(st.note) : ''}</div><div class="dt" style="font-family:var(--font-mono);font-size:.66rem;text-transform:uppercase;letter-spacing:.1em;color:var(--ink3);margin-bottom:10px">Memory after this line</div><div class="tr-mem">${cells}</div>`
  $('#tr-live').innerHTML =
    Object.entries(st.vars)
      .map(
        ([k, v]) =>
          `<div class="row"><span class="nm">${esc(k)}</span> → ${esc(JSON.stringify(v))} <span class="ty">(${typeof v})</span></div>`,
      )
      .join('') ||
    '<div style="color:#5a5a57;font-size:.78rem">no variables yet</div>'
}
window.resetTrace = function () {
  trSteps = []
  trCur = 0
  $('#tr-steps').style.display = 'none'
  $('#tr-live').innerHTML = ''
}

/* ============================================================
   CHALLENGES
   ============================================================ */
function renderChallenges() {
  $('#view-challenges').innerHTML = `
   <div class="wrap">
    <div class="lh"><div class="crumb">Tool</div><h1>Code Challenges</h1>
      <p>Solve real problems. Reveal hints when stuck, check the solution when done, run your code live.</p></div>
    ${CHALLENGES.map(
      (ch, idx) => `
      <div class="ch" id="ch-${ch.id}">
        <div class="ch-head">
          <div><h3>${idx + 1}. ${esc(ch.title)}</h3>
            <div class="ch-meta">${ch.diff} · ${ch.topic} · ⚡ ${ch.xp} XP</div></div>
          <span class="ch-done" id="chdone-${ch.id}" style="display:${S.challenges.includes(ch.id) ? 'inline' : 'none'}">✓</span>
        </div>
        <div class="prob">${ch.problem}</div>
        <div class="pg">
          <div class="pg-bar"><span class="ttl">▸ solution.js</span><span class="sp"></span>
            <button class="btn sm solid" onclick="runPG('chc-${ch.id}')">▶ Run</button>
            <button class="btn sm ghost" onclick="resetPG('chc-${ch.id}')">↺ Reset</button></div>
          <div class="pg-body">
            <textarea class="pg-edit" id="chc-${ch.id}" spellcheck="false" data-init="${encodeURIComponent(ch.starter)}">${esc(ch.starter)}</textarea>
            <div class="pg-out" id="chc-${ch.id}-out"><div class="lbl">Console</div><div class="empty">Click Run.</div></div>
          </div>
        </div>
        <div class="reveal">
          <button class="btn ghost sm" onclick="toggleEl('hints-${ch.id}')">Hints</button>
          <button class="btn ghost sm" onclick="toggleEl('sol-${ch.id}')">Solution</button>
          <button class="btn solid sm" onclick="solveCh('${ch.id}',${ch.xp})">Mark Solved · +${ch.xp} XP</button>
        </div>
        <div id="hints-${ch.id}" style="display:none;margin-top:12px"><div class="callout"><div class="t">Hints</div><ol style="margin:6px 0 0 18px">${ch.hints.map((h) => `<li>${esc(h)}</li>`).join('')}</ol></div></div>
        <div id="sol-${ch.id}" style="display:none;margin-top:12px"><pre class="code">${esc(ch.solution)}</pre><div class="callout"><div class="t">Why</div><p>${esc(ch.explanation)}</p></div></div>
      </div>`,
    ).join('')}
   </div>`
}
window.toggleEl = function (id) {
  const e = $('#' + id)
  e.style.display = e.style.display === 'none' ? 'block' : 'none'
}
window.solveCh = function (id, xp) {
  if (S.challenges.includes(id)) {
    toast('Already solved ✓')
    return
  }
  S.challenges.push(id)
  refreshHeader()
  save()
  $('#chdone-' + id).style.display = 'inline'
  toast('◈ Challenge solved · +' + xp + ' XP')
  checkAch()
}

/* ============================================================
   FLASHCARDS
   ============================================================ */
let deck = []
function buildDeck() {
  deck = []
  COURSE.lessons.forEach((l) =>
    l.flashcards.forEach((f) => deck.push({ ...f, topic: l.title })),
  )
}
function renderFlashcards() {
  if (!deck.length) buildDeck()
  if (S.fcIndex >= deck.length) S.fcIndex = 0
  $('#view-flashcards').innerHTML = `
   <div class="wrap">
    <div class="lh"><div class="crumb">Tool</div><h1>Flashcards</h1>
      <p>Tap a card to flip. Drawn from every lesson's key concepts.</p>
      <div class="meta"><span class="lvl-tag">${deck.length} cards</span></div></div>
    <div class="fc-stage">
      <div class="flashcard" id="fc" onclick="flip()">
        <div class="fc-in">
          <div class="fc-face fc-front"><span class="fc-topic" id="fcTopic"></span><div class="lb">Question</div><div class="qq" id="fcQ"></div><div class="hint">tap to flip ↻</div></div>
          <div class="fc-face fc-back"><div class="lb">Answer</div><div class="aa" id="fcA"></div></div>
        </div>
      </div>
      <div class="fc-count" id="fcCount"></div>
      <div class="fc-ctrl">
        <button class="btn ghost sm" onclick="fcMove(-1)">← Prev</button>
        <button class="btn ghost sm" onclick="fcShuffle()">⤮ Shuffle</button>
        <button class="btn solid sm" onclick="fcMove(1)">Next →</button>
      </div>
    </div>
   </div>`
  showCard()
}
function showCard() {
  const c = deck[S.fcIndex]
  $('#fc').classList.remove('flip')
  $('#fcTopic').textContent = c.topic
  $('#fcQ').textContent = c.q
  $('#fcA').textContent = c.a
  $('#fcCount').textContent = `${S.fcIndex + 1} / ${deck.length}`
}
window.flip = function () {
  $('#fc').classList.toggle('flip')
  S.flips++
  save()
  checkAch()
}
window.fcMove = function (d) {
  S.fcIndex = (S.fcIndex + d + deck.length) % deck.length
  save()
  showCard()
}
window.fcShuffle = function () {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  S.fcIndex = 0
  showCard()
  toast('⤮ Shuffled')
}

/* ============================================================
   REVISION
   ============================================================ */
function renderRevision() {
  $('#view-revision').innerHTML = `
   <div class="wrap">
    <div class="lh"><div class="crumb">Tool</div><h1>Quick Revision</h1>
      <p>Condensed key concepts, flash definitions, and the top interview questions for each module.</p></div>
    ${COURSE.lessons
      .map(
        (l) => `
      <div class="rev">
        <h3>${esc(l.title)} ${lvlTag(l.level)}</h3>
        <div class="key-grid">${l.summary.map((s) => `<div class="key">${s}</div>`).join('')}</div>
        <div style="margin-top:8px"><strong style="font-size:.88rem">Flash definitions</strong>
          <div class="key-grid">${l.flashcards.map((f) => `<div class="key"><b>${esc(f.q)}</b>${esc(f.a)}</div>`).join('')}</div></div>
        <div style="margin-top:12px"><strong style="font-size:.88rem">Top interview questions</strong>
          ${l.interview
            .slice(0, 3)
            .map(
              (q) =>
                `<div class="iq" onclick="this.classList.toggle('open')"><div class="q"><span class="q-lvl">${lvlName[q.lvl]}</span><span>${esc(q.q)}</span><span class="ar">›</span></div><div class="a"><div class="in">${q.a}</div></div></div>`,
            )
            .join('')}</div>
        <button class="btn ghost sm" style="margin-top:14px" onclick="go('lesson','${l.id}')">Open full lesson →</button>
      </div>`,
      )
      .join('')}
   </div>`
}

/* ============================================================
   ACHIEVEMENTS
   ============================================================ */
function checkAch() {
  let unlocked = []
  if (!S._ach) S._ach = []
  ACHIEVEMENTS.forEach((a) => {
    if (!S._ach.includes(a.id) && a.test(S)) {
      S._ach.push(a.id)
      unlocked.push(a)
    }
  })
  if (unlocked.length) {
    save()
    unlocked.forEach((a) => toast('🏆 ' + a.t))
  }
  if (current === 'achievements') renderAchievements()
}
function renderAchievements() {
  if (!S._ach) S._ach = []
  $('#view-achievements').innerHTML = `
   <div class="wrap">
    <div class="lh"><div class="crumb">Progress</div><h1>Achievements</h1>
      <p>Earn badges by completing modules, acing quizzes, solving challenges, and exploring.</p>
      <div class="meta"><span class="lvl-tag">${S._ach.length} / ${ACHIEVEMENTS.length} unlocked</span> <span class="lvl-tag">⚡ ${S.xp} XP</span></div></div>
    <div class="ach-grid">${ACHIEVEMENTS.map(
      (a) => `
      <div class="ach ${S._ach.includes(a.id) ? 'on' : ''}"><span class="em">${a.em}</span>
        <div><div class="t">${a.t} ${S._ach.includes(a.id) ? '✓' : ''}</div><div class="d">${a.d}</div></div></div>`,
    ).join('')}</div>
   </div>`
}

/* ============================================================
   STATS
   ============================================================ */
function renderStats() {
  const total = COURSE.lessons.length,
    done = S.completed.length
  const qIds = Object.keys(S.quizScore)
  const qAvg = qIds.length
    ? Math.round(
        (qIds.reduce((a, id) => {
          const l = COURSE.lessons.find((x) => x.id === id)
          return a + (l ? S.quizScore[id] / l.quiz.length : 0)
        }, 0) /
          qIds.length) *
          100,
      )
    : 0
  if (!S._ach) S._ach = []
  $('#view-stats').innerHTML = `
   <div class="wrap">
    <div class="lh"><div class="crumb">Progress</div><h1>My Stats</h1><p>Your complete learning journey at a glance.</p></div>
    <div class="st-grid">
      ${[
        ['◆', 'Lessons', done + ' / ' + total],
        ['⚡', 'Total XP', S.xp],
        ['▣', 'Quiz Avg', qAvg + '%'],
        ['◈', 'Challenges', S.challenges.length + ' / ' + CHALLENGES.length],
        ['✦', 'Badges', S._ach.length + ' / ' + ACHIEVEMENTS.length],
        ['❖', 'Flips', S.flips],
      ]
        .map(
          ([em, k, v]) =>
            `<div class="st-cell"><div class="em">${em}</div><div class="v">${v}</div><div class="k">${k}</div></div>`,
        )
        .join('')}
    </div>
    <div class="block"><h2><span class="ic">·</span>Lesson Progress</h2>
      ${COURSE.lessons
        .map((l) => {
          const d = S.completed.includes(l.id)
          return `<div class="st-row"><span>${d ? '✓' : '○'}</span><span class="nm">${esc(l.title)}</span><div class="bar"><div style="width:${d ? 100 : 0}%"></div></div><span class="pc">${d ? 100 : 0}%</span></div>`
        })
        .join('')}
    </div>
    <div class="block"><h2><span class="ic">·</span>Quiz Results</h2>
      ${
        qIds.length
          ? qIds
              .map((id) => {
                const l = COURSE.lessons.find((x) => x.id === id)
                const pc = Math.round((S.quizScore[id] / l.quiz.length) * 100)
                return `<div class="st-row"><span class="nm">${esc(l.title)}</span><div class="bar"><div style="width:${pc}%"></div></div><span class="pc">${S.quizScore[id]}/${l.quiz.length}</span></div>`
              })
              .join('')
          : '<p class="muted" style="color:var(--ink3);font-size:.88rem">Take a quiz to see results.</p>'
      }
    </div>
    <div class="block"><h2><span class="ic">·</span>Challenge Progress</h2>
      ${CHALLENGES.map((ch) => {
        const d = S.challenges.includes(ch.id)
        return `<div class="st-row"><span>${d ? '✓' : '○'}</span><span class="nm">${esc(ch.title)}</span><span class="pc" style="width:auto">${ch.diff} · ${ch.xp}XP</span></div>`
      }).join('')}
    </div>
   </div>`
}

/* ============================================================
   NOTES (aggregate)
   ============================================================ */
function renderNotes() {
  $('#view-notes').innerHTML = `
   <div class="wrap">
    <div class="lh"><div class="crumb">Tool</div><h1>My Notes</h1><p>Per-lesson notes, saved in this browser. Pick a lesson to edit.</p></div>
    <div class="tabs">${COURSE.lessons.map((l, i) => `<button class="tab ${i === 0 ? 'active' : ''}" onclick="noteTab(this,'${l.id}')">${esc(l.title)}</button>`).join('')}</div>
    ${COURSE.lessons
      .map(
        (
          l,
          i,
        ) => `<div class="tabpane ${i === 0 ? 'active' : ''}" id="nt-${l.id}">
      <textarea class="notes" id="gn-${l.id}" placeholder="Notes for ${esc(l.title)}…">${esc(S.notes[l.id] || '')}</textarea>
      <div style="display:flex;gap:12px;align-items:center;margin-top:12px"><button class="btn solid sm" onclick="saveGN('${l.id}')">Save</button><span class="saved" id="gsaved-${l.id}">✓ saved</span></div>
    </div>`,
      )
      .join('')}
   </div>`
  COURSE.lessons.forEach((l) => {
    const ta = $('#gn-' + l.id)
    let t
    ta.addEventListener('input', () => {
      clearTimeout(t)
      t = setTimeout(() => {
        S.notes[l.id] = ta.value
        S.notedOnce = true
        save()
        flashGN(l.id)
        checkAch()
      }, 600)
    })
  })
}
window.noteTab = function (btn, id) {
  const p = btn.closest('.tabs').parentElement
  p.querySelectorAll('.tab').forEach((b) => b.classList.remove('active'))
  p.querySelectorAll('.tabpane').forEach((x) => x.classList.remove('active'))
  btn.classList.add('active')
  $('#nt-' + id).classList.add('active')
}
window.saveGN = function (id) {
  S.notes[id] = $('#gn-' + id).value
  S.notedOnce = true
  save()
  flashGN(id)
  checkAch()
}
function flashGN(id) {
  const e = $('#gsaved-' + id)
  if (!e) return
  e.classList.add('show')
  setTimeout(() => e.classList.remove('show'), 1300)
}
window.saveNote = function (id) {
  S.notes[id] = $('#note-' + id).value
  S.notedOnce = true
  save()
  flashSaved(id)
  checkAch()
}
function flashSaved(id) {
  const e = $('#saved-' + id)
  if (!e) return
  e.classList.add('show')
  setTimeout(() => e.classList.remove('show'), 1300)
}

/* ============================================================
   SEARCH
   ============================================================ */
let INDEX = []
function buildIndex() {
  INDEX = []
  COURSE.lessons.forEach((l) => {
    INDEX.push({
      type: 'Lesson',
      title: l.title,
      sub: l.num,
      lid: l.id,
      text: (l.title + ' ' + l.blurb).toLowerCase(),
    })
    l.blocks.forEach((b) => {
      if (b.h)
        INDEX.push({
          type: 'Concept',
          title: b.h,
          sub: l.title,
          lid: l.id,
          text: (b.h + ' ' + strip(b.html || '')).toLowerCase(),
        })
    })
    l.interview.forEach((q) =>
      INDEX.push({
        type: 'Interview',
        title: q.q,
        sub: l.title,
        lid: l.id,
        text: (q.q + ' ' + q.a).toLowerCase(),
      }),
    )
    l.practice.forEach((p) =>
      INDEX.push({
        type: 'Practice',
        title: p.q,
        sub: l.title,
        lid: l.id,
        text: (p.q + ' ' + p.a).toLowerCase(),
      }),
    )
  })
}
function strip(h) {
  return h.replace(/<[^>]+>/g, ' ')
}
function doSearch(q) {
  const box = $('#searchRes')
  q = q.trim().toLowerCase()
  if (q.length < 2) {
    box.classList.remove('show')
    return
  }
  const hits = INDEX.filter((it) => it.text.includes(q)).slice(0, 12)
  box.innerHTML = hits.length
    ? hits
        .map(
          (h) =>
            `<div class="sr" onclick="go('lesson','${h.lid}');closeSearch()"><div class="tag">${h.type} · ${esc(h.sub)}</div><div>${hl(esc(h.title), q)}</div></div>`,
        )
        .join('')
    : `<div class="sr-empty">No results for "${esc(q)}"</div>`
  box.classList.add('show')
}
function hl(t, q) {
  const i = t.toLowerCase().indexOf(q)
  return i < 0
    ? t
    : t.slice(0, i) +
        '<mark>' +
        t.slice(i, i + q.length) +
        '</mark>' +
        t.slice(i + q.length)
}
window.closeSearch = function () {
  $('#searchRes').classList.remove('show')
  $('#search').value = ''
}

/* ============================================================
   THEME / TOAST / SCROLL / INIT
   ============================================================ */
function initTheme() {
  const t = localStorage.getItem(THEME_KEY) || 'dark'
  document.documentElement.setAttribute('data-theme', t)
  $('#themeBtn').textContent = t === 'dark' ? '☾' : '☀'
}
$('#themeBtn').addEventListener('click', () => {
  const c = document.documentElement.getAttribute('data-theme'),
    n = c === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', n)
  localStorage.setItem(THEME_KEY, n)
  $('#themeBtn').textContent = n === 'dark' ? '☾' : '☀'
})

let toastT
function toast(m) {
  let e = $('#toast')
  e.textContent = m
  e.classList.add('show')
  clearTimeout(toastT)
  toastT = setTimeout(() => e.classList.remove('show'), 2200)
}

window.addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - window.innerHeight
  $('#topbar').style.width =
    (h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0) + '%'
})

$('#search').addEventListener('input', (e) => doSearch(e.target.value))
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search')) $('#searchRes').classList.remove('show')
})
$('#menuBtn').addEventListener('click', () => {
  $('#sidebar').classList.toggle('open')
  $('#backdrop').classList.toggle('show')
})
$('#backdrop').addEventListener('click', () => {
  $('#sidebar').classList.remove('open')
  $('#backdrop').classList.remove('show')
})

initTheme()
buildSidebar()
buildDeck()
buildIndex()
refreshHeader()
checkAch()
go('home')

/* ============================================================
   INTRO MODAL — rules, details & how-it-works (shown on load)
   ============================================================ */
const INTRO_SEEN = 'jsmono_introSeen'
function buildIntro() {
  const about = [
    [
      'A free, self-paced JavaScript course built from real lecture notes — five modules from the origin story to type conversion.',
    ],
    [
      'Each lesson packs an explanation, real-world analogy, visual diagrams, runnable code, a quiz, interview questions and practice problems.',
    ],
  ]
  const rules = [
    [
      'Lessons unlock in order. Lesson 01 is open; finish a lesson to unlock the next one.',
    ],
    [
      'Hit <b>Mark Complete</b> at the end of a lesson to earn XP and open the next module.',
    ],
    ['Quizzes can be retried — your best score is what counts.'],
    [
      'Run any code block live in the playground, and use the Tracer to watch variables change line by line.',
    ],
    [
      'Your progress (XP, completions, notes) is saved on this device only. Clearing browser data resets it.',
    ],
  ]
  const feat = [
    ['Execution Tracer', 'steps through real <code>for</code> loops'],
    ['Code Challenges', '8 hands-on problems with hints & solutions'],
    ['Flashcards & Revision', 'quick recall before interviews'],
    ['Light / Dark', 'toggle in the top bar'],
  ]
  $('#introBox').innerHTML = `
    <div class="modal-head">
      <button class="modal-x" onclick="closeIntro()" aria-label="Close">✕</button>
      <div class="modal-eyebrow">Welcome · Please read</div>
      <h2>JS Forge</h2>
      <p>A black & white, interactive course. Here's what it is and how it works.</p>
    </div>
    <div class="modal-body">
      <div class="modal-sec">
        <h3>About</h3>
        <ul class="modal-list">${about.map((r) => `<li><span class="mn">i</span><span>${r[0]}</span></li>`).join('')}</ul>
      </div>
      <div class="modal-sec">
        <h3>Rules & how it works</h3>
        <ul class="modal-list">${rules.map((r, i) => `<li><span class="mn">${i + 1}</span><span>${r[0]}</span></li>`).join('')}</ul>
      </div>
      <div class="modal-sec">
        <h3>What's inside</h3>
        <ul class="modal-list feat">${feat.map((f) => `<li><span class="mn">◆</span><span><b>${f[0]}</b> — ${f[1]}</span></li>`).join('')}</ul>
      </div>
    </div>
    <div class="modal-foot">
      <label class="chkbox"><input type="checkbox" id="introDont"> Don't show this again</label>
      <button class="btn solid" onclick="closeIntro()">Start Learning →</button>
    </div>`
}
window.openIntro = function () {
  buildIntro()
  const w = $('#introModal')
  w.classList.add('show')
  w.setAttribute('aria-hidden', 'false')
}
window.closeIntro = function () {
  const dont = $('#introDont')
  if (dont && dont.checked) {
    try {
      localStorage.setItem(INTRO_SEEN, '1')
    } catch {}
  }
  const w = $('#introModal')
  w.classList.remove('show')
  w.setAttribute('aria-hidden', 'true')
}
// close on backdrop click or Escape
$('#introModal').addEventListener('click', (e) => {
  if (e.target.id === 'introModal') closeIntro()
})
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && $('#introModal').classList.contains('show'))
    closeIntro()
})
// show on load unless dismissed before
;(function () {
  let seen
  try {
    seen = localStorage.getItem(INTRO_SEEN)
  } catch {}
  if (!seen) openIntro()
})()
