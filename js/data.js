export const RANKS = [
  "Grade 5",
  "Grade 4",
  "Grade 3",
  "Grade 2",
  "Semi Grade 1",
  "Grade 1",
  "Semi Special Grade",
  "Special Grade"
];

export const NAV_ITEMS = [
  ["title", "Title"],
  ["profile", "Profile"],
  ["hub", "Academy Hub"],
  ["missions", "Mission Board"],
  ["lessons", "Lessons"],
  ["trials", "Cursed Trials"],
  ["debug", "Debug Drills"],
  ["battle", "Battle Sim"],
  ["skills", "Skill Tree"],
  ["rank", "Rank Status"],
  ["archives", "Archive"],
  ["vows", "Binding Vows"],
  ["saves", "Save / Load / Settings"]
];

export const TAB_ICONS = {
  title: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 3 7l9 5 9-5-9-5Zm-7 8v7l7 4v-7l-7-4Zm9 11 7-4v-7l-7 4v7Z"/></svg>`,
  profile: `<svg viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.4 0-8 2-8 4.5V22h16v-3.5c0-2.5-3.6-4.5-8-4.5Z"/></svg>`,
  hub: `<svg viewBox="0 0 24 24"><path d="M12 3 2 9l10 6 10-6-10-6Zm-8 9v6l8 4 8-4v-6l-8 5-8-5Z"/></svg>`,
  missions: `<svg viewBox="0 0 24 24"><path d="M6 3h12v18H6zM8 7h8M8 11h8M8 15h5"/></svg>`,
  lessons: `<svg viewBox="0 0 24 24"><path d="M4 5h16v14H4zM8 9h8M8 13h6"/></svg>`,
  trials: `<svg viewBox="0 0 24 24"><path d="m12 2 9 4v6c0 5-3.8 9.4-9 10-5.2-.6-9-5-9-10V6l9-4Zm0 5v10"/></svg>`,
  debug: `<svg viewBox="0 0 24 24"><path d="M9 3h6v3h3v3h3v6h-3v3h-3v3H9v-3H6v-3H3V9h3V6h3V3Z"/></svg>`,
  battle: `<svg viewBox="0 0 24 24"><path d="m4 20 8-16 8 16h-4l-4-8-4 8H4Z"/></svg>`,
  skills: `<svg viewBox="0 0 24 24"><path d="M12 2 9 8l-7 1 5 5-1 8 6-3 6 3-1-8 5-5-7-1-3-6Z"/></svg>`,
  rank: `<svg viewBox="0 0 24 24"><path d="M4 4h16v4H4zM6 10h12l-2 10H8L6 10Z"/></svg>`,
  archives: `<svg viewBox="0 0 24 24"><path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5"/></svg>`,
  vows: `<svg viewBox="0 0 24 24"><path d="M12 2 4 7v10l8 5 8-5V7l-8-5Zm-3 9 2 2 4-4"/></svg>`,
  saves: `<svg viewBox="0 0 24 24"><path d="M4 4h14l2 2v14H4zM7 4v6h8V4M8 18h8"/></svg>`
};

const concepts = [
  ["variables", "Variables & Data Types"],
  ["io", "Input / Output"],
  ["ifelse", "if / else"],
  ["loops", "Loops"],
  ["functions", "Functions"],
  ["vectors", "Vectors"],
  ["strings", "Strings"],
  ["references", "References &"],
  ["sorting", "Sorting"],
  ["searching", "Searching"],
  ["hashmaps", "unordered_map"],
  ["stacksqueues", "Stacks / Queues"],
  ["recursion", "Recursion"],
  ["binarysearch", "Binary Search"],
  ["twopointers", "Two Pointers"],
  ["slidingwindow", "Sliding Window"],
  ["treesgraphs", "Trees / Graphs"],
  ["interviewmedium", "Interview Medium"],
];

export const LESSONS = concepts.map((c, i) => ({
  id: c[0],
  title: `${i + 1}. ${c[1]}`,
  difficulty: i < 7 ? "Foundational" : i < 14 ? "Intermediate" : "Advanced",
  lore: `${c[1]} is trained as a Program Manipulation kata inside the Cursed Compiler Hall.`,
  explain: `You learn ${c[1]} in plain C++ with examples, mistakes, and tactical usage in combat simulations.`,
  syntax: sampleSyntax(c[0]),
  guidedPrompt: guidedPrompt(c[0]),
  challengePrompt: challengePrompt(c[0]),
  hardPrompt: hardPrompt(c[0]),
  requiredTokens: requiredTokens(c[0]),
  hint: hintFor(c[0]),
  tags: [c[0], i > 8 ? "algorithm" : "fundamental"]
}));

function sampleSyntax(id) {
  const map = {
    variables: `int cursedEnergy = 80;\nstring title = "Novice";\ndouble control = 0.72;`,
    io: `int x;\ncin >> x;\ncout << x << "\\n";`,
    ifelse: `if (energy > 50) cout << "Stable";\nelse cout << "Unstable";`,
    loops: `for (int i = 0; i < n; i++) total += i;`,
    functions: `int amplify(int x){ return x * 2; }`,
    vectors: `vector<int> v = {1,2,3};\nv.push_back(4);`,
    strings: `string s = "curse";\ncout << s.size();`,
    references: `void heal(int &hp){ hp += 10; }`,
    sorting: `sort(v.begin(), v.end());`,
    searching: `for(int x : v) if(x==target) return true;`,
    hashmaps: `unordered_map<string,int> mp;\nmp["loop"]++;`,
    stacksqueues: `stack<int> st; queue<int> q;`,
    recursion: `int f(int n){ if(n<=1) return 1; return n*f(n-1); }`,
    binarysearch: `int l=0,r=n-1; while(l<=r){ int m=(l+r)/2; }`,
    twopointers: `int l=0,r=n-1; while(l<r){ ... }`,
    slidingwindow: `for(int r=0;r<n;r++){ sum += a[r]; while(sum>k) sum -= a[l++]; }`,
    treesgraphs: `vector<vector<int>> g(n);\nqueue<int> q;`,
    interviewmedium: `Combine data structures + patterns under time pressure.`
  };
  return map[id] || "";
}
function guidedPrompt(id) { return `Guided Practice: write a small C++ snippet using ${id}.`; }
function challengePrompt(id) { return `Challenge: solve a mini trial with ${id} and print correct output.`; }
function hardPrompt(id) { return `Harder Challenge: optimize your ${id} approach for better runtime.`; }
function requiredTokens(id) {
  const map = { variables:["int"], io:["cin","cout"], ifelse:["if","else"], loops:["for"], functions:["(" ,")","return"], vectors:["vector"], strings:["string"], references:["&"], sorting:["sort"], searching:["for"], hashmaps:["unordered_map"], stacksqueues:["stack"], recursion:["(" ,")"], binarysearch:["while"], twopointers:["l","r"], slidingwindow:["while"], treesgraphs:["vector"], interviewmedium:["for"] };
  return map[id] || [];
}
function hintFor(id) {
  return `Cursed Flow Hint: focus on ${id} syntax first, then output accuracy. Stable code beats flashy brute force.`;
}

export const CHALLENGES = Array.from({ length: 27 }, (_, i) => {
  const concept = LESSONS[i % LESSONS.length];
  const tier = i < 10 ? "Training" : i < 20 ? "Combat" : "Catastrophe";
  return {
    id: `trial-${i+1}`,
    title: `${tier} Trial ${i+1}: ${concept.title.split('. ')[1]}`,
    difficulty: tier,
    rankRec: RANKS[Math.min(Math.floor(i / 4), RANKS.length - 1)],
    tags: [concept.id, tier.toLowerCase()],
    statement: `Harness ${concept.title.split('. ')[1]} to stabilize corrupted data flow and return the required result.`,
    examples: `Input: sample-${i+1}\nOutput: stabilized-${i+1}`,
    constraints: i < 15 ? "n <= 1e3" : "n <= 2e5",
    hints: [
      `Start with ${concept.id} fundamentals.`,
      i > 12 ? "Consider optimized O(log n) or O(n)." : "Brute force may pass visible tests only.",
    ],
    explanation: `Correct solutions combine syntax accuracy and concept mastery in ${concept.id}.`,
    visibleTests: [`visible-${i+1}-A`, `visible-${i+1}-B`],
    hiddenTests: [`hidden-${i+1}-A`, `hidden-${i+1}-B`],
    requiredTokens: concept.requiredTokens,
    bannedTokens: i > 12 ? ["goto"] : []
  };
});

export const DEBUG_DRILLS = Array.from({ length: 10 }, (_, i) => ({
  id: `debug-${i+1}`,
  title: `Cursed Flow Correction ${i+1}`,
  broken: i % 2 ? `for(int i=0;i<n;i++) sum += a[i]\ncout << sum;` : `if(x = 5){ cout << "five"; }`,
  expectedFix: i % 2 ? [";", "for"] : ["==", "if"],
  concept: LESSONS[i % LESSONS.length].id,
  hint: "Bug Sight reveals assignment-vs-comparison and missing semicolons as common curses."
}));

const missionLore = [
  "Dorm Breach Cleanup","First-Year Cursed Console Drill","Night Patrol: Data Fog",
  "Kanda Underpass Incident","Detention Wing Ritual Sweep","Broken Registry Recovery",
  "Kyoto Exchange Simulation","Shibuya Signal Distortion","Loop Cathedral Exorcism",
  "Archive Vault Lockdown","Culling Script Outbreak","Barrier Node Collapse",
  "Nanami Protocol Endurance","Unstable Domain Mapping","Sukuna Finger Trace Analysis",
  "Grade 2 Certification Convoy","Semi Grade 1 Emergency Dispatch","Grade 1 Tactical Raid",
  "Semi Special Grade Zero-Hour","Special Event: Domain Awakening","Special Grade Ascension Rite"
];
export const MISSIONS = missionLore.map((name, i) => ({
  id: `mission-${i+1}`,
  title: name,
  type: i < 6 ? "Supervised Training" : i < 14 ? "Field Incident" : "Promotion Arc",
  summary: `Lore operation ${i+1}: stabilize cursed infrastructure through coding trials, combat pressure, and command decisions.`,
  reqLessons: Math.min(18, Math.max(1, i)),
  reqBattles: Math.min(20, Math.floor(i * 1.1)),
  reqChallenges: Math.min(27, i + 2),
  reward: 30 + i * 9,
  unlockText: i >= 19 ? "Domain-level interpretation data unlocked." : `Unlock technique fragment ${i+1}`
}));

const battleNames = [
  "Null Curse","Malformed Shikigami","Loop Wraith","Memory Rot Beast","Runtime Tyrant","Domain Parasite",
  "Greed Curse: Overflow Maw","Asymptote Shade","Infinity Knot Curse","Pointer Ghoul","Queue Devourer","Hash Hollower",
  "Recursive Apostle","Branching Widow","Adjacency Stalker","Binary Phantom","Sliding Maw","Two-Pointer Reaper",
  "Deadlock Oni","Compiler Revenant","Barrier Leech","Shibuya Lattice Curse","Catastrophe Kernel","Abyssal Register Curse",
  "Heian Echo Construct","Singularity of Broken Logic"
];
export const BATTLES = battleNames.map((enemy, i) => ({
  id: `battle-${i+1}`,
  enemy,
  hp: 110 + i * 38,
  attack: 14 + i * 3,
  conceptFocus: LESSONS[(i * 2) % LESSONS.length].id,
  reward: 45 + i * 12,
  prompt: `Deploy ${LESSONS[(i * 2) % LESSONS.length].id} inside your cast. Allocate cursed energy to overpower ${enemy}.`
}));

export const RANK_EXAMS = [
  { id:"exam-1", to:"Grade 4", lessons:4, trials:4, battles:1, accuracy:60 },
  { id:"exam-2", to:"Grade 3", lessons:8, trials:8, battles:2, accuracy:65 },
  { id:"exam-3", to:"Grade 2", lessons:12, trials:14, battles:3, accuracy:70 },
  { id:"exam-4", to:"Grade 1", lessons:16, trials:20, battles:5, accuracy:75 },
  { id:"exam-5", to:"Special Grade", lessons:18, trials:26, battles:6, accuracy:82 }
];

export const SKILLS = [
  {id:"syntax_1", branch:"Syntax Weaving", name:"Rune Grammar", cost:1, effect:"hintDiscount", value:1, requires:[]},
  {id:"syntax_2", branch:"Syntax Weaving", name:"Clean Cast", cost:2, effect:"judgeLeniency", value:1, requires:["syntax_1"]},
  {id:"data_1", branch:"Data Structure Shaping", name:"Vector Barrage", cost:2, effect:"battleDmg", value:7, requires:[]},
  {id:"data_2", branch:"Data Structure Shaping", name:"Hash Bind", cost:3, effect:"battleDmg", value:10, requires:["data_1"]},
  {id:"runtime_1", branch:"Runtime Perception", name:"Complexity Sense", cost:2, effect:"xpBoost", value:.1, requires:[]},
  {id:"bugs_1", branch:"Bug Sight", name:"Error Tracing", cost:1, effect:"debugBonus", value:1, requires:[]},
  {id:"compiler_1", branch:"Compiler Invocation", name:"Cast Validation", cost:2, effect:"battleCrit", value:.08, requires:[]},
  {id:"flow_1", branch:"Algorithmic Flow State", name:"Combo Sequence", cost:2, effect:"combo", value:1, requires:[]},
  {id:"domain_1", branch:"Domain of Execution", name:"Runtime Domination", cost:5, effect:"ultimate", value:1, requires:["runtime_1","compiler_1","flow_1"]}
];

export const ARCHIVE_TERMS = [
  ["Variable", "A sealed container holding cursed data during battle logic."],
  ["Vector", "A summoned expandable chain of data shards."],
  ["Reference (&)", "A direct spiritual thread to original memory."],
  ["unordered_map", "Binding registry that maps names to values instantly."],
  ["Recursion", "Self-referential cursed echo until base condition anchors reality."],
  ["Binary Search", "Precision target acquisition by repeatedly halving the zone."],
  ["Sliding Window", "Moving focus barrier to track optimal subarray energy."],
  ["Big O", "The true cost of your cursed technique at scale."]
];

export const INTERPRETATIONS = [
  "Code Weaving",
  "Runtime Domination",
  "Recursive Echo",
  "Pointer Threading",
  "Memory Carving",
  "Domain of Execution"
];

export const TECHNIQUE_PATHS = [
  {
    id: "limitless",
    name: "Limitless Emulation",
    owner: "Infinity User Echo",
    theme: "infinity, asymptotes, divergence",
    tiers: [
      "Compute harmonic growth and discuss divergence.",
      "Binary search an asymptote threshold with precision.",
      "Optimize infinite-process simulation with convergence checks."
    ]
  },
  {
    id: "blood",
    name: "Blood Weave Script",
    owner: "Hemostasis Caster Echo",
    theme: "flows, pressure, dynamic updates",
    tiers: [
      "Track blood packet flow with prefix sums.",
      "Detect pressure bursts using sliding windows.",
      "Balance flow graph under combat constraints."
    ]
  },
  {
    id: "ten_shadows",
    name: "Ten Shadows Patterning",
    owner: "Shikigami Tactician Echo",
    theme: "summons, state trees, branching",
    tiers: [
      "Model summon roster with vectors/maps.",
      "Traverse shikigami tree with DFS.",
      "Plan minimal summon chain with DP + graph search."
    ]
  }
];
