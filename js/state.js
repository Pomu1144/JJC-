import { INTERPRETATIONS, RANKS } from "./data.js";

export const SAVE_KEY = "programManipulationSavesV1";

export function newState(name = "Unnamed Sorcerer") {
  return {
    sorcererName: name,
    currentRank: RANKS[0],
    cursedEnergy: 100,
    cursedEnergyReinforcement: 0,
    title: "reinforcedbody",
    control: 0.20,
    mastery: 0,
    completedLessons: [],
    solvedTrials: [],
    solvedDebugs: [],
    completedMissions: [],
    wonBattles: [],
    unlockedSkills: [],
    battleLog: [],
    accuracyRecord: [],
    conceptMastery: {},
    interpretation: INTERPRETATIONS[0],
    unlockedTechniques: ["Basic Script Cast"],
    streak: 0,
    lastPlayDate: null,
    storyProgress: 0,
    skillPoints: 2,
    hintEnergy: 8,
    physicalAttack: 12,
    vowHistory: [],
    vowScore: 0,
    techniqueProgress: {},
    settings: { uiGlow: true, slot: 1 }
  };
}

export function saveToSlot(state, slot) {
  const all = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}");
  all[slot] = state;
  localStorage.setItem(SAVE_KEY, JSON.stringify(all));
}

export function loadFromSlot(slot) {
  const all = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}");
  return all[slot] || null;
}

export function resetSlot(slot) {
  const all = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}");
  delete all[slot];
  localStorage.setItem(SAVE_KEY, JSON.stringify(all));
}

export function calcAccuracy(state) {
  if (!state.accuracyRecord.length) return 0;
  const total = state.accuracyRecord.reduce((a,b) => a + b, 0);
  return Math.round(total / state.accuracyRecord.length);
}

export function markConcept(state, concept, success) {
  state.conceptMastery[concept] ??= { ok: 0, fail: 0 };
  if (success) state.conceptMastery[concept].ok += 1;
  else state.conceptMastery[concept].fail += 1;
}

export function strongestWeakest(state) {
  const entries = Object.entries(state.conceptMastery).map(([k,v]) => ({
    concept: k,
    score: v.ok - v.fail
  }));
  if (!entries.length) return { strongest: "N/A", weakest: "N/A" };
  entries.sort((a,b) => b.score - a.score);
  return { strongest: entries[0].concept, weakest: entries[entries.length-1].concept };
}
