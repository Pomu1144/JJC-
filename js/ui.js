import { ARCHIVE_TERMS, BATTLES, CHALLENGES, DEBUG_DRILLS, INTERPRETATIONS, LESSONS, MISSIONS, NAV_ITEMS, RANKS, SKILLS, TAB_ICONS, TECHNIQUE_PATHS } from "./data.js";
import { applyReinforcement, attemptRankUp, checkMission, completeBattle, completeLesson, evaluateBindingVow, getProgress, runBattleTurn, solveDebug, solveTrial, trainTechniquePath, unlockSkill } from "./engine.js";
import { calcAccuracy, strongestWeakest } from "./state.js";

export function bindShell(state, actions) {
  const nav = document.getElementById("main-nav");
  NAV_ITEMS.forEach(([id, name]) => {
    const b = document.createElement("button");
    b.innerHTML = `${TAB_ICONS[id] || ""}<span>${name}</span>`;
    b.onclick = () => actions.changeScreen(id);
    b.dataset.screen = id;
    nav.appendChild(b);
  });

  document.getElementById("daily-btn").onclick = () => {
    const today = new Date().toISOString().slice(0,10);
    if (state.lastPlayDate !== today) {
      state.streak += 1;
      state.lastPlayDate = today;
      state.cursedEnergy += 15;
      state.hintEnergy += 1;
      modal("Daily Training Bonus", `Streak ${state.streak}. +15 energy, +1 hint token.`);
      actions.persist();
      actions.refresh();
    } else modal("Daily Bonus", "Already claimed today.");
  };

  document.getElementById("save-btn").onclick = () => actions.save();
  document.getElementById("load-btn").onclick = () => actions.load();
  document.getElementById("reset-btn").onclick = () => actions.reset();
}

export function render(state, screen, actions) {
  highlightNav(screen);
  renderMini(state);
  const root = document.getElementById("screen-root");
  const [title, subtitle] = screenMeta(screen);
  document.getElementById("screen-title").textContent = title;
  document.getElementById("screen-subtitle").textContent = subtitle;

  const renderers = {
    title: () => renderTitle(root, state),
    profile: () => renderProfile(root, state, actions),
    hub: () => renderHub(root, state, actions),
    missions: () => renderMissions(root, state, actions),
    lessons: () => renderLessons(root, state, actions),
    trials: () => renderTrials(root, state, actions),
    debug: () => renderDebug(root, state, actions),
    battle: () => renderBattle(root, state, actions),
    skills: () => renderSkills(root, state, actions),
    rank: () => renderRank(root, state, actions),
    archives: () => renderArchive(root, state),
    vows: () => renderVows(root, state, actions),
    saves: () => renderSaves(root, state, actions)
  };
  renderers[screen]?.();
}

function screenMeta(screen) {
  const map = {
    title: ["Title Screen", "Cursed Technique Training Camp"],
    profile: ["Sorcerer Profile", "Your current technique status"],
    hub: ["Academy Hub", "Narrative progression and key systems"],
    missions: ["Mission Board", "Dispatches, incidents, and exams"],
    lessons: ["C++ Training Lessons", "Guided concept cultivation"],
    trials: ["LeetCode-Style Cursed Trials", "Training / Combat / Catastrophe"],
    debug: ["Bug Sight Drills", "Cursed flow correction"],
    battle: ["Combat Simulation", "Code-powered cursed battles"],
    skills: ["Technique Skill Tree", "Unlock branch evolutions"],
    rank: ["Rank Status", "Promotion ceremony and exam gate"],
    archives: ["Archives / Glossary", "Lore-linked terminology"],
    vows: ["Binding Vows AI", "Risk-reward contracts measured by oracle"],
    saves: ["Save & Settings", "Slots, preferences, and reset"]
  };
  return map[screen] || ["Screen", ""];
}

function highlightNav(screen) {
  document.querySelectorAll("#main-nav button").forEach(btn => btn.classList.toggle("active", btn.dataset.screen === screen));
}

function renderMini(state) {
  const p = getProgress(state);
  document.getElementById("mini-status").innerHTML = `
    <div><span class="rank-badge">${state.currentRank}</span></div>
    <div class="kv"><span>Energy</span><b>${state.cursedEnergy}</b></div>
    <div class="kv"><span>Mastery</span><b>${state.mastery}</b></div>
    <div class="kv"><span>Accuracy</span><b>${p.accuracy}%</b></div>
    <div class="kv"><span>Streak</span><b>${state.streak}</b></div>
  `;
}

function renderTitle(root, state) {
  root.innerHTML = `
    <section class="panel">
      <h3>Cursed Technique: C++ Combat Genesis</h3>
      <p>You begin as a ${state.currentRank} sorcerer with unstable command over loops, vectors, and cursed flow control. 
      Train through lessons, trials, incidents, and rank exams to ascend to Special Grade.</p>
      <div class="grid two">
        <article class="card"><h4>Core Fantasy</h4><p>Code mastery fuels battle execution. Correct syntax sharpens cursed techniques.</p></article>
        <article class="card"><h4>Interpretation Path</h4><p>Current path: <b>${state.interpretation}</b>. Unlock deeper branches in the skill tree.</p></article>
      </div>
    </section>
  `;
}

function renderProfile(root, state, actions) {
  const sw = strongestWeakest(state);
  const p = getProgress(state);
  root.innerHTML = `
    <section class="panel grid two">
      <article class="card">
        <h4>${state.sorcererName}</h4>
        <p><span class="rank-badge">${state.currentRank}</span></p>
        <div class="kv"><span>Cursed Energy</span><b>${state.cursedEnergy}</b></div>
        <div class="kv"><span>Technique Mastery</span><b>${state.mastery}</b></div>
        <div class="kv"><span>Physical Attack</span><b>${state.physicalAttack}</b></div>
        <div class="kv"><span>Reinforcement Pool</span><b>${state.cursedEnergyReinforcement}</b></div>
        <div class="kv"><span>Body Control</span><b>${Math.round(state.control * 100)}%</b></div>
        <div class="kv"><span>Interpretation</span><b>${state.interpretation}</b></div>
        <div class="kv"><span>Battle Record</span><b>${state.wonBattles.length} wins</b></div>
      </article>
      <article class="card">
        <h4>Growth Analytics</h4>
        <div class="kv"><span>Lessons Completed</span><b>${state.completedLessons.length}</b></div>
        <div class="kv"><span>Trials Solved</span><b>${state.solvedTrials.length}</b></div>
        <div class="kv"><span>Accuracy</span><b>${calcAccuracy(state)}%</b></div>
        <div class="kv"><span>Strongest Concept</span><b>${sw.strongest}</b></div>
        <div class="kv"><span>Weakest Concept</span><b>${sw.weakest}</b></div>
      </article>
    </section>
    <section class="panel">
      <h4>Body Reinforcement Training</h4>
      <p>int cursedEnergyReinforcement; string title = "reinforcedbody"; double control = 0.20;</p>
      <div style="display:flex; gap:8px; align-items:center;">
        <input id="reinforce-input" type="range" min="0" max="60" value="15" />
        <button class="btn" id="reinforce-btn">Reinforce Body</button>
      </div>
      <div class="small" id="reinforce-fb"></div>
    </section>
    ${progressBars(p)}
  `;
  root.querySelector("#reinforce-btn").onclick = () => {
    const spend = Number(root.querySelector("#reinforce-input").value);
    const out = applyReinforcement(state, spend);
    root.querySelector("#reinforce-fb").innerHTML = `<span class='good'>Spent ${out.spend} CE. Physical attack now ${out.physicalAttack}.</span>`;
    actions.persist(); actions.refresh();
  };
}

function renderHub(root, state, actions) {
  root.innerHTML = `
    <section class="panel">
      <h3>Academy Story Arc</h3>
      <p>Instructors are calibrating your cursed technique control through supervised training, field dispatches, and ceremonial promotion tests.</p>
      <div class="card">
        <p>Story Progress: ${state.storyProgress}/${MISSIONS.length} missions</p>
        <div class="progress"><span style="width:${Math.round((state.storyProgress/MISSIONS.length)*100)}%"></span></div>
      </div>
      <div class="grid two" id="hub-events"></div>
    </section>
  `;
  const wrap = root.querySelector("#hub-events");
  MISSIONS.slice(0,3).forEach(m => wrap.appendChild(missionCard(m, state, actions)));
}

function renderMissions(root, state, actions) {
  root.innerHTML = `<section class="panel"><h3>Mission Board</h3><div class="grid three" id="mission-grid"></div></section>`;
  const grid = root.querySelector("#mission-grid");
  MISSIONS.forEach(m => grid.appendChild(missionCard(m, state, actions)));
}

function missionCard(m, state, actions) {
  const done = state.completedMissions.includes(m.id);
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = `
    <h4>${m.title}</h4>
    <p class="meta">${m.type}</p>
    <p>${m.summary}</p>
    <p class="small">Req: lessons ${m.reqLessons}, trials ${m.reqChallenges}, battles ${m.reqBattles}</p>
    <button class="btn">${done ? "Completed" : "Attempt Mission"}</button>
  `;
  el.querySelector("button").onclick = () => {
    if (done) return;
    const result = checkMission(state, m.id);
    modal(m.title, result.msg);
    actions.persist(); actions.refresh();
  };
  return el;
}

function renderLessons(root, state, actions) {
  root.innerHTML = `<section class="panel"><h3>Guided Lessons</h3><div class="grid" id="lesson-list"></div></section>`;
  const list = root.querySelector("#lesson-list");
  LESSONS.forEach(lesson => {
    const done = state.completedLessons.includes(lesson.id);
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h4>${lesson.title}</h4>
      <p class="meta">${lesson.difficulty} • tags: ${lesson.tags.join(", ")}</p>
      <p>${lesson.explain}</p>
      <p><b>Technique metaphor:</b> ${lesson.lore}</p>
      <pre>${lesson.syntax}</pre>
      <p><b>Guided:</b> ${lesson.guidedPrompt}</p>
      <p><b>Challenge:</b> ${lesson.challengePrompt}</p>
      <p><b>Hard:</b> ${lesson.hardPrompt}</p>
      <textarea class="editor" placeholder="Write C++ here..."></textarea>
      <div style="display:flex; gap:8px; margin-top:8px;">
        <button class="btn run">Submit Lesson</button>
        <button class="btn hint">Use Hint (-1 Hint Energy)</button>
        <span class="small">${done ? "Completed" : "Not completed"}</span>
      </div>
      <div class="small feedback"></div>
    `;
    card.querySelector(".hint").onclick = () => {
      if (state.hintEnergy <= 0) return modal("Hint", "Not enough hint energy.");
      state.hintEnergy -= 1;
      modal("Hint", lesson.hint);
      actions.persist(); actions.refresh();
    };
    card.querySelector(".run").onclick = () => {
      const code = card.querySelector("textarea").value;
      const out = completeLesson(state, lesson.id, code);
      card.querySelector(".feedback").innerHTML = out.ok
        ? `<span class='good'>Lesson stabilized (${out.judged.score}%).</span>`
        : `<span class='bad'>Unstable cast (${out.judged.score}%). ${out.judged.feedback.join(" ")}</span>`;
      actions.persist(); actions.refresh();
    };
    list.appendChild(card);
  });
}

function renderTrials(root, state, actions) {
  root.innerHTML = `<section class="panel"><h3>Cursed Trials</h3><div class="grid" id="trial-list"></div></section>`;
  const list = root.querySelector("#trial-list");
  CHALLENGES.forEach(trial => {
    const done = state.solvedTrials.includes(trial.id);
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h4>${trial.title}</h4>
      <p class="meta">Difficulty: ${trial.difficulty} | Rank recommendation: ${trial.rankRec}</p>
      <p><b>Tags:</b> ${trial.tags.join(", ")}</p>
      <p>${trial.statement}</p>
      <p><b>Examples:</b> ${trial.examples}</p>
      <p><b>Constraints:</b> ${trial.constraints}</p>
      <p class="small">Visible tests: ${trial.visibleTests.join(", ")} | Hidden tests: ${trial.hiddenTests.length}</p>
      <textarea class="editor" placeholder="Solve in C++"></textarea>
      <div style="display:flex; gap:8px; margin-top:8px;"><button class="btn run">Run Judge</button><button class="btn hint">Hint</button></div>
      <div class="small feedback">${done ? "Solved" : ""}</div>
    `;
    card.querySelector(".hint").onclick = () => modal("Trial Hint", trial.hints.join("\n"));
    card.querySelector(".run").onclick = () => {
      const t0 = performance.now();
      const code = card.querySelector("textarea").value;
      const elapsed = Math.round((performance.now() - t0) / 1000);
      const out = solveTrial(state, trial.id, code, elapsed);
      card.querySelector(".feedback").innerHTML = out.ok
        ? `<span class='good'>Accepted (${out.judged.score}%). ${out.blackFlash ? "Black Flash achieved!" : ""}</span><br>${trial.explanation}`
        : `<span class='bad'>Wrong technique (${out.judged.score}%).</span> ${out.judged.feedback.join(" ")}`;
      actions.persist(); actions.refresh();
    };
    const techBlock = document.createElement("div");
    techBlock.className = "small";
    techBlock.innerHTML = `Technique Overlay: ${TECHNIQUE_PATHS.map(t => t.name).join(" • ")}`;
    card.appendChild(techBlock);
    list.appendChild(card);
  });
  const themed = document.createElement("section");
  themed.className = "panel";
  themed.innerHTML = `<h3>Assimilated Technique Development</h3><div class="grid three" id="tech-grid"></div>`;
  root.appendChild(themed);
  const tg = themed.querySelector("#tech-grid");
  TECHNIQUE_PATHS.forEach(path => {
    const tier = state.techniqueProgress[path.id] || 0;
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h4>${path.name}</h4>
      <p class="meta">Theme: ${path.theme}</p>
      <p>Current objective: ${path.tiers[Math.min(tier, path.tiers.length - 1)]}</p>
      <textarea class="editor" placeholder="Develop ${path.name} script"></textarea>
      <button class="btn train-tech">Develop Technique</button>
      <div class="small fb"></div>
    `;
    card.querySelector(".train-tech").onclick = () => {
      const code = card.querySelector("textarea").value;
      const out = trainTechniquePath(state, path.id, code);
      card.querySelector(".fb").innerHTML = out.ok ? `<span class='good'>${out.msg}</span>` : `<span class='bad'>${out.msg}</span>`;
      actions.persist(); actions.refresh();
    };
    tg.appendChild(card);
  });
}

function renderDebug(root, state, actions) {
  root.innerHTML = `<section class="panel"><h3>Debug Drills</h3><div class="grid two" id="debug-list"></div></section>`;
  const list = root.querySelector("#debug-list");
  DEBUG_DRILLS.forEach(d => {
    const done = state.solvedDebugs.includes(d.id);
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h4>${d.title}</h4><p>${d.hint}</p>
      <pre>${d.broken}</pre>
      <textarea class="editor" placeholder="Write corrected code..."></textarea>
      <button class="btn run">Validate Fix</button>
      <div class="small feedback">${done ? "Corrected" : ""}</div>
    `;
    card.querySelector(".run").onclick = () => {
      const out = solveDebug(state, d, card.querySelector("textarea").value);
      card.querySelector(".feedback").innerHTML = out.ok ? `<span class='good'>Flow corrected.</span>` : `<span class='bad'>Residual bug remains.</span>`;
      actions.persist(); actions.refresh();
    };
    list.appendChild(card);
  });
}

function renderBattle(root, state, actions) {
  root.innerHTML = `<section class="panel"><h3>Battle Simulations</h3><div class="grid two" id="battle-list"></div><h4>Battle Log</h4><div class="log" id="battle-log"></div></section>`;
  const list = root.querySelector("#battle-list");
  const log = root.querySelector("#battle-log");
  state.battleLog.slice(0, 20).forEach(entry => {
    const p = document.createElement("p"); p.textContent = entry; log.appendChild(p);
  });

  BATTLES.forEach(b => {
    const done = state.wonBattles.includes(b.id);
    const runtime = { ...b };
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h4>${b.enemy}</h4>
      <p class="meta">Focus: ${b.conceptFocus} | Reward: +${b.reward} energy</p>
      <p>${b.prompt}</p>
      <div class="kv"><span>Enemy HP</span><b class="enemy-hp">${runtime.hp}</b></div>
      <textarea class="editor" placeholder="string target = \"...\";\nstring technique = \"...\";\nint output = 0;\n\nif (target == \"enemy\") {\n    output = 42;\n    cout << output << \"\\n\";\n}"></textarea>
      <div style="display:flex; gap:8px; margin-top:8px;">
        <input class="energy-alloc" type="range" min="0" max="60" value="20"/>
        <button class="btn cast">Execute Attack Code</button>
        <button class="btn">Vector Barrage</button>
      </div>
      <div class="small feedback">${done ? "Defeated" : ""}</div>
    `;
    const action = { name: "Vector Barrage", base: 15 };
    card.querySelector(".cast").onclick = () => {
      const code = card.querySelector("textarea").value;
      const allocated = Number(card.querySelector(".energy-alloc").value);
      const turn = runBattleTurn(state, runtime, action, code, allocated);
      card.querySelector(".enemy-hp").textContent = Math.max(0, runtime.hp);
      card.querySelector(".feedback").innerHTML = turn.won
        ? `<span class='good'>Enemy exorcised.</span>`
        : `<span class='warn'>Allocated ${allocated} CE. Dealt ${turn.playerDmg}. Received ${turn.enemyDmg}.</span> ${turn.judged.feedback[turn.judged.feedback.length - 1] || ""}`;
      if (turn.won && !done) {
        completeBattle(state, b.id);
        state.cursedEnergy += b.reward;
      }
      actions.persist(); actions.refresh();
    };
    list.appendChild(card);
  });
}

function renderVows(root, state, actions) {
  root.innerHTML = `
    <section class="panel">
      <h3>Binding Vow Console</h3>
      <p>Draft a vow. The in-game AI oracle measures integrity, risk, and exploitability to rate output potential.</p>
      <label class="small">Vow Terms</label>
      <textarea id="vow-text" class="editor" placeholder="I cannot use healing for 3 turns, if fail I lose 40 CE, in exchange +40% cast output."></textarea>
      <div class="resource-row">
        <label class="resource-chip">Risk <input id="vow-risk" type="range" min="1" max="10" value="6"></label>
        <label class="resource-chip">Reward Demand <input id="vow-reward" type="range" min="1" max="10" value="6"></label>
      </div>
      <button id="vow-eval" class="btn glow">Evaluate Binding Vow</button>
      <div id="vow-result" class="small"></div>
    </section>
    <section class="panel">
      <h4>Vow History</h4>
      <div class="log">${state.vowHistory.slice(0,12).map(v => `<p>Score ${v.score}: ${v.vowText}</p>`).join("")}</div>
    </section>
  `;
  root.querySelector("#vow-eval").onclick = () => {
    const vowText = root.querySelector("#vow-text").value;
    const risk = Number(root.querySelector("#vow-risk").value);
    const reward = Number(root.querySelector("#vow-reward").value);
    const out = evaluateBindingVow(state, vowText, risk, reward);
    root.querySelector("#vow-result").innerHTML = `Oracle score: <b>${out.score}</b>. ${out.score >= 75 ? "Approved for amplification." : "Vow lacks sufficient consequence."}`;
    actions.persist(); actions.refresh();
  };
}

function renderSkills(root, state, actions) {
  root.innerHTML = `<section class="panel"><h3>Skill Tree</h3><p>Skill Points: <b>${state.skillPoints}</b></p><div class="grid three" id="skill-grid"></div></section>`;
  const grid = root.querySelector("#skill-grid");
  SKILLS.forEach(s => {
    const unlocked = state.unlockedSkills.includes(s.id);
    const el = document.createElement("article");
    el.className = `skill-node ${unlocked ? "unlocked" : ""}`;
    el.innerHTML = `
      <h4>${s.name}</h4>
      <p class="meta">${s.branch} | Cost ${s.cost}</p>
      <p class="small">Requires: ${s.requires.length ? s.requires.join(", ") : "None"}</p>
      <button class="btn">${unlocked ? "Unlocked" : "Unlock"}</button>
    `;
    el.querySelector("button").onclick = () => {
      if (unlocked) return;
      const out = unlockSkill(state, s.id);
      modal("Skill Unlock", out.msg);
      actions.persist(); actions.refresh();
    };
    grid.appendChild(el);
  });
}

function renderRank(root, state, actions) {
  const idx = RANKS.indexOf(state.currentRank);
  root.innerHTML = `
    <section class="panel">
      <h3>Ceremonial Rank Gate</h3>
      <p>Current Rank: <span class="rank-badge">${state.currentRank}</span></p>
      <p>${idx >= 3 ? "Intermediate and elite rank exams now demand combat-proof coding discipline." : "Foundational grades prioritize syntax stability and mission discipline."}</p>
      <button id="rank-btn" class="btn glow">Attempt Promotion Exam</button>
      <div class="small" id="rank-feedback"></div>
    </section>
  `;
  root.querySelector("#rank-btn").onclick = () => {
    const out = attemptRankUp(state);
    root.querySelector("#rank-feedback").innerHTML = out.ok ? `<span class='good'>${out.msg}</span>` : `<span class='bad'>${out.msg}</span>`;
    if (out.ok) modal("Promotion Ceremony", out.msg);
    actions.persist(); actions.refresh();
  };
}

function renderArchive(root, state) {
  root.innerHTML = `
    <section class="panel grid two">
      <article class="card">
        <h4>Glossary of Cursed Coding Terms</h4>
        ${ARCHIVE_TERMS.map(([t,d]) => `<p><b>${t}:</b> ${d}</p>`).join("")}
      </article>
      <article class="card">
        <h4>Cursed Technique Archive</h4>
        <p>Active Interpretation: <b>${state.interpretation}</b></p>
        <p>Unlocked Techniques:</p>
        <ul>${state.unlockedTechniques.map(t => `<li>${t}</li>`).join("")}</ul>
        <p>Known interpretations: ${INTERPRETATIONS.join(", ")}</p>
      </article>
    </section>
  `;
}

function renderSaves(root, state, actions) {
  root.innerHTML = `
    <section class="panel">
      <h3>Save Slots</h3>
      <p>Active Slot: ${state.settings.slot}</p>
      <div style="display:flex; gap:8px; margin-bottom:10px;">
        <button class="btn" data-slot="1">Slot 1</button>
        <button class="btn" data-slot="2">Slot 2</button>
        <button class="btn" data-slot="3">Slot 3</button>
      </div>
      <label class="small">Sorcerer Name <input id="rename" value="${state.sorcererName}" /></label>
      <button class="btn" id="apply-name">Apply Name</button>
      <p class="small">UI Glow: ${state.settings.uiGlow ? "On" : "Off"}</p>
      <button id="toggle-glow" class="btn">Toggle Glow</button>
    </section>
  `;
  root.querySelectorAll("[data-slot]").forEach(b => b.onclick = () => actions.switchSlot(Number(b.dataset.slot)));
  root.querySelector("#apply-name").onclick = () => {
    state.sorcererName = root.querySelector("#rename").value.trim() || state.sorcererName;
    actions.persist(); actions.refresh();
  };
  root.querySelector("#toggle-glow").onclick = () => {
    state.settings.uiGlow = !state.settings.uiGlow;
    document.body.style.filter = state.settings.uiGlow ? "none" : "saturate(.7)";
    actions.persist(); actions.refresh();
  };
}

function progressBars(p) {
  return `<section class="panel grid two">
    ${bar("Lessons", p.lessonPct)}
    ${bar("Trials", p.trialPct)}
    ${bar("Battles", p.battlePct)}
    ${bar("Missions", p.missionPct)}
  </section>`;
}

function bar(label, pct) {
  return `<article class="card"><p>${label}: ${pct}%</p><div class="progress"><span style="width:${pct}%"></span></div></article>`;
}

export function modal(title, content) {
  const tpl = document.getElementById("modal-template");
  const frag = tpl.content.cloneNode(true);
  const root = frag.querySelector(".modal-backdrop");
  frag.querySelector(".modal-title").textContent = title;
  frag.querySelector(".modal-content").innerHTML = `<p>${content}</p>`;
  frag.querySelector(".close-modal").onclick = () => root.remove();
  root.addEventListener("click", e => { if (e.target === root) root.remove(); });
  document.body.appendChild(frag);
}
