import { newState, loadFromSlot, resetSlot, saveToSlot } from "./state.js";
import { bindShell, modal, render } from "./ui.js";

const state = loadFromSlot(1) || newState(promptName());
let currentScreen = "title";

const actions = {
  changeScreen(screen) { currentScreen = screen; refresh(); },
  persist() { saveToSlot(state, state.settings.slot); },
  refresh,
  save() {
    saveToSlot(state, state.settings.slot);
    modal("Save Complete", `Progress written to slot ${state.settings.slot}.`);
  },
  load() {
    const loaded = loadFromSlot(state.settings.slot);
    if (!loaded) return modal("Load", "No save data in this slot.");
    Object.keys(state).forEach(k => delete state[k]);
    Object.assign(state, loaded);
    refresh();
    modal("Load Complete", `Loaded slot ${state.settings.slot}.`);
  },
  reset() {
    const slot = state.settings.slot;
    resetSlot(slot);
    const fresh = newState(state.sorcererName);
    fresh.settings.slot = slot;
    Object.keys(state).forEach(k => delete state[k]);
    Object.assign(state, fresh);
    refresh();
    modal("Slot Reset", `Slot ${slot} has been reset.`);
  },
  switchSlot(slot) {
    state.settings.slot = slot;
    const loaded = loadFromSlot(slot);
    if (loaded) {
      Object.keys(state).forEach(k => delete state[k]);
      Object.assign(state, loaded);
    }
    refresh();
  }
};

bindShell(state, actions);
refresh();

function refresh() {
  render(state, currentScreen, actions);
}

function promptName() {
  const n = window.prompt("Enter your sorcerer name:", "Fushiguro Coder");
  return (n || "Unnamed Sorcerer").slice(0, 30);
}

window.__game = { get state() { return state; }, actions };
