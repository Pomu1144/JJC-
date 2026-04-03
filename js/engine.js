import { BATTLES, CHALLENGES, LESSONS, MISSIONS, RANKS, RANK_EXAMS, SKILLS, TECHNIQUE_PATHS } from "./data.js";
import { calcAccuracy, markConcept } from "./state.js";

export function judgeCode(input, activity) {
  const raw = input || "";
  const code = raw.toLowerCase();
  const req = activity.requiredTokens || [];
  const banned = activity.bannedTokens || [];
  const misses = req.filter(t => !code.includes(t.toLowerCase()));
  const violations = banned.filter(t => code.includes(t.toLowerCase()));
  const semicolonPenalty = raw.includes("cout") && !raw.includes(";") ? 1 : 0;
  let score = 100 - misses.length * 20 - violations.length * 20 - semicolonPenalty * 15;
  score = Math.max(0, Math.min(100, score));
  const pass = score >= 60;
  let feedback = [];
  if (misses.length) feedback.push(`Missing syntax patterns: ${misses.join(", ")}.`);
  if (violations.length) feedback.push(`Forbidden patterns detected: ${violations.join(", ")}.`);
  if (!feedback.length) feedback.push("Code pattern alignment stable. Cursed flow synchronized.");
  return { pass, score, feedback };
}

export function completeLesson(state, lessonId, code) {
  const lesson = LESSONS.find(l => l.id === lessonId);
  if (!lesson) return { ok:false, msg:"Lesson not found." };
  const judged = judgeCode(code, lesson);
  state.accuracyRecord.push(judged.score);
  markConcept(state, lesson.id, judged.pass);
  if (judged.pass && !state.completedLessons.includes(lessonId)) {
    state.completedLessons.push(lessonId);
    state.mastery += 4;
    state.cursedEnergy += 5;
  }
  return { ok: judged.pass, judged };
}

export function solveTrial(state, trialId, code, elapsedSec = 90) {
  const trial = CHALLENGES.find(t => t.id === trialId);
  if (!trial) return { ok:false, msg:"Trial missing." };
  const judged = judgeCode(code, trial);
  state.accuracyRecord.push(judged.score);
  markConcept(state, trial.tags[0], judged.pass);
  const blackFlash = judged.pass && elapsedSec <= 45;
  if (judged.pass && !state.solvedTrials.includes(trialId)) {
    state.solvedTrials.push(trialId);
    state.mastery += blackFlash ? 7 : 5;
    state.cursedEnergy += blackFlash ? 10 : 6;
    if (blackFlash) state.battleLog.push("Black Flash Cast: perfect speed and precision!");
  }
  return { ok: judged.pass, judged, blackFlash };
}

export function solveDebug(state, debug, fixedCode) {
  const ok = debug.expectedFix.every(token => fixedCode.includes(token));
  markConcept(state, debug.concept, ok);
  state.accuracyRecord.push(ok ? 95 : 35);
  if (ok && !state.solvedDebugs.includes(debug.id)) {
    state.solvedDebugs.push(debug.id);
    state.mastery += 2;
  }
  return { ok, score: ok ? 95 : 35 };
}

export function runBattleTurn(state, battle, action, code, allocatedEnergy = 15) {
  const attackScript = evaluateAttackScript(code);
  const judged = judgeCode(code, { requiredTokens: [battle.conceptFocus] });
  if (!attackScript.ok) {
    judged.score = Math.max(0, judged.score - 30);
    judged.pass = judged.score >= 60;
    judged.feedback.push(attackScript.msg);
  }
  const bonus = state.unlockedSkills.includes("data_2") ? 8 : 0;
  const crit = state.unlockedSkills.includes("compiler_1") && Math.random() < 0.08;
  const reinforced = Math.floor(state.cursedEnergyReinforcement / 4);
  const energyBoost = Math.floor(allocatedEnergy / 4);
  const playerDmg = (action.base + state.physicalAttack + reinforced + energyBoost + Math.floor(judged.score / 12) + bonus) * (crit ? 2 : 1);
  battle.hp -= playerDmg;
  state.cursedEnergy = Math.max(0, state.cursedEnergy - allocatedEnergy);
  const enemyDmg = Math.max(0, battle.attack - (judged.pass ? 4 : 0));
  state.cursedEnergy = Math.max(0, state.cursedEnergy - enemyDmg);
  state.battleLog.unshift(`${action.name} dealt ${playerDmg}. ${battle.enemy} dealt ${enemyDmg}.`);
  return { judged, playerDmg, enemyDmg, crit, won: battle.hp <= 0 };
}

export function completeBattle(state, battleId) {
  if (!state.wonBattles.includes(battleId)) {
    state.wonBattles.push(battleId);
    state.mastery += 6;
    state.skillPoints += 1;
  }
}

export function unlockSkill(state, skillId) {
  const s = SKILLS.find(x => x.id === skillId);
  if (!s) return {ok:false,msg:"Skill missing."};
  if (state.unlockedSkills.includes(skillId)) return {ok:false,msg:"Already unlocked."};
  if (state.skillPoints < s.cost) return {ok:false,msg:"Not enough skill points."};
  if (!s.requires.every(r => state.unlockedSkills.includes(r))) return {ok:false,msg:"Prerequisites not met."};
  state.skillPoints -= s.cost;
  state.unlockedSkills.push(skillId);
  state.unlockedTechniques.push(s.name);
  if (skillId === "domain_1") state.interpretation = "Domain of Execution";
  return {ok:true,msg:`Unlocked ${s.name}.`};
}

export function checkMission(state, missionId) {
  const m = MISSIONS.find(x => x.id === missionId);
  if (!m) return {ok:false,msg:"Mission missing."};
  const pass = state.completedLessons.length >= m.reqLessons
    && state.wonBattles.length >= m.reqBattles
    && state.solvedTrials.length >= m.reqChallenges;
  if (pass && !state.completedMissions.includes(missionId)) {
    state.completedMissions.push(missionId);
    state.cursedEnergy += m.reward;
    state.storyProgress += 1;
  }
  return { ok: pass, msg: pass ? `Mission complete. ${m.unlockText}` : "Requirements not met." };
}

export function attemptRankUp(state) {
  const accuracy = calcAccuracy(state);
  const currentIndex = RANKS.indexOf(state.currentRank);
  const exam = RANK_EXAMS.find(e => RANKS.indexOf(e.to) === currentIndex + 1) ||
    (state.currentRank === "Grade 1" ? RANK_EXAMS.find(e=>e.to==="Special Grade") : null);
  if (!exam) return {ok:false,msg:"No available exam at this rank."};

  const checks = state.completedLessons.length >= exam.lessons
    && state.solvedTrials.length >= exam.trials
    && state.wonBattles.length >= exam.battles
    && accuracy >= exam.accuracy;

  if (!checks) {
    return {
      ok:false,
      msg:`Exam failed. Need lessons ${exam.lessons}, trials ${exam.trials}, battles ${exam.battles}, accuracy ${exam.accuracy}%`
    };
  }
  if (state.currentRank === "Grade 1") {
    state.currentRank = "Semi Special Grade";
  } else if (state.currentRank === "Semi Special Grade") {
    state.currentRank = "Special Grade";
  } else {
    state.currentRank = exam.to;
  }
  state.skillPoints += 2;
  state.battleLog.unshift(`Ceremonial Promotion Complete: ${state.currentRank}`);
  return {ok:true,msg:`Promotion successful. New Rank: ${state.currentRank}`};
}

export function getProgress(state) {
  return {
    lessonPct: Math.round((state.completedLessons.length / LESSONS.length) * 100),
    trialPct: Math.round((state.solvedTrials.length / CHALLENGES.length) * 100),
    battlePct: Math.round((state.wonBattles.length / BATTLES.length) * 100),
    missionPct: Math.round((state.completedMissions.length / MISSIONS.length) * 100),
    accuracy: calcAccuracy(state)
  };
}

export function applyReinforcement(state, spentEnergy) {
  const spend = Math.min(state.cursedEnergy, Math.max(0, Number(spentEnergy) || 0));
  state.cursedEnergy -= spend;
  state.cursedEnergyReinforcement += spend;
  state.physicalAttack = 12 + Math.floor(state.cursedEnergyReinforcement / 8);
  state.control = Math.min(0.98, state.control + spend / 1000);
  return { spend, physicalAttack: state.physicalAttack, reinforcement: state.cursedEnergyReinforcement };
}

export function evaluateBindingVow(state, vowText, risk, reward) {
  const terms = vowText.toLowerCase();
  let score = 50;
  if (terms.includes("cannot") || terms.includes("never")) score += 12;
  if (terms.includes("if fail") || terms.includes("penalty")) score += 10;
  if (terms.includes("single use") || terms.includes("cooldown")) score += 8;
  score += Math.min(15, risk * 3);
  score -= Math.max(0, reward * 2 - risk);
  score = Math.max(1, Math.min(100, score));
  state.vowScore = score;
  const entry = { vowText, risk, reward, score, date: new Date().toISOString() };
  state.vowHistory.unshift(entry);
  if (score >= 75) {
    state.cursedEnergy += 20;
    state.skillPoints += 1;
    state.battleLog.unshift("Binding Vow AI approved a high-integrity vow. Technique output amplified.");
  }
  return entry;
}

export function trainTechniquePath(state, pathId, code) {
  const path = TECHNIQUE_PATHS.find(p => p.id === pathId);
  if (!path) return { ok:false, msg:"Technique path missing." };
  state.techniqueProgress[pathId] ??= 0;
  const tier = state.techniqueProgress[pathId];
  const requiredTokens = tier === 0 ? ["for"] : tier === 1 ? ["while","mid"] : ["vector","if"];
  const judged = judgeCode(code, { requiredTokens });
  if (!judged.pass) return { ok:false, judged, msg:"Technique script unstable." };
  state.techniqueProgress[pathId] += 1;
  state.mastery += 4 + tier;
  if (state.techniqueProgress[pathId] >= path.tiers.length) {
    state.unlockedTechniques.push(path.name);
    return { ok:true, judged, msg:`Technique ${path.name} fully developed and assimilated.` };
  }
  return { ok:true, judged, msg:`Technique training advanced to tier ${state.techniqueProgress[pathId] + 1}.` };
}

export function evaluateAttackScript(code) {
  const lines = (code || "").split("\n");
  const hasTarget = /target\s*=/.test(code);
  const hasTechnique = /technique\s*=/.test(code);
  const hasOutput = /output\s*=/.test(code);
  const indentationValid = lines.some(l => /^ {4}\S/.test(l));
  if (!hasTarget || !hasTechnique || !hasOutput) {
    return { ok:false, msg:"Attack script must declare target, technique, and output." };
  }
  if (!indentationValid) {
    return { ok:false, msg:"Attack script requires realistic C++ indentation (4 spaces inside scope)." };
  }
  return { ok:true, msg:"Attack script format accepted." };
}
