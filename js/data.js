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
  ["saves", "Save / Load / Settings"]
];

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

export const MISSIONS = Array.from({ length: 9 }, (_, i) => ({
  id: `mission-${i+1}`,
  title: i === 8 ? "Special Event: Domain Awakening" : `Training Arc Mission ${i+1}`,
  type: i < 3 ? "Supervised Training" : i < 6 ? "Field Incident" : "Promotion Arc",
  summary: `Instructor-guided scenario where Program Manipulation is tested through lessons, trials, and a battle checkpoint.`,
  reqLessons: i + 1,
  reqBattles: Math.max(0, i - 1),
  reqChallenges: i + 2,
  reward: 30 + i * 10,
  unlockText: i === 8 ? "Unlock Interpretation: Domain of Execution" : `Unlock technique fragment ${i+1}`
}));

export const BATTLES = Array.from({ length: 6 }, (_, i) => ({
  id: `battle-${i+1}`,
  enemy: ["Null Curse", "Malformed Shikigami", "Loop Wraith", "Memory Rot Beast", "Runtime Tyrant", "Domain Parasite"][i],
  hp: 110 + i * 45,
  attack: 14 + i * 5,
  conceptFocus: LESSONS[(i * 3) % LESSONS.length].id,
  reward: 45 + i * 20,
  prompt: `Use ${LESSONS[(i * 3) % LESSONS.length].id} logic in your code cast to weaken this curse.`
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
