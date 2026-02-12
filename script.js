// =======================
// EDIT HERE (Easy Revisions)
// =======================

// Scrambled letters students will see at the MASTER LOCK:
const SCRAMBLED_SET = "RDXOYIBNECPHGAINODER"; // 20 letters

// The correct master phrase (teacher-only). Students must type this to escape:
const MASTER_PHRASE = "BINARYHEXDECODINGPRO"; // 20 letters, no spaces

// 20 locks total.
// Each lock: title, directions, prompt, answers[], letter
// answers[]: acceptable answers (case-insensitive). For hex, accept "FF" and "0xFF" if you want.
const locks = [
  // ---------- 1–10: Conversions ----------
  { title: "Lock 1 (Conversion)", directions: "Convert Binary → Decimal", prompt: "1011₂ = ?₁₀", answers: ["11"], letter: "R" },
  { title: "Lock 2 (Conversion)", directions: "Convert Hex → Decimal", prompt: "2A₁₆ = ?₁₀", answers: ["42"], letter: "D" },
  { title: "Lock 3 (Conversion)", directions: "Convert Decimal → Hex", prompt: "25₁₀ = ?₁₆", answers: ["19", "0x19"], letter: "X" },
  { title: "Lock 4 (Conversion)", directions: "Convert Binary → Hex (two-step ok)", prompt: "11110000₂ = ?₁₆", answers: ["F0", "0xF0"], letter: "O" },
  { title: "Lock 5 (Conversion)", directions: "Convert Hex → Binary", prompt: "3F₁₆ = ?₂  (no spaces)", answers: ["111111"], letter: "Y" },
  { title: "Lock 6 (Conversion)", directions: "Convert Binary → Decimal", prompt: "100111₂ = ?₁₀", answers: ["39"], letter: "I" },
  { title: "Lock 7 (Conversion)", directions: "Convert Decimal → Binary", prompt: "16₁₀ = ?₂  (no spaces)", answers: ["10000"], letter: "B" },
  { title: "Lock 8 (Conversion)", directions: "Convert Binary → Decimal", prompt: "1100100₂ = ?₁₀", answers: ["100"], letter: "N" },
  { title: "Lock 9 (Conversion)", directions: "Convert Hex → Decimal", prompt: "7B₁₆ = ?₁₀", answers: ["123"], letter: "E" },
  { title: "Lock 10 (Conversion)", directions: "Convert Decimal → Hex", prompt: "255₁₀ = ?₁₆", answers: ["FF", "0xFF"], letter: "C" },

  // ---------- 11–15: Definitions ----------
  { title: "Lock 11 (Definition)", directions: "Enter the base value", prompt: "What is the base of BINARY?", answers: ["2", "base2", "base-2", "base 2"], letter: "P" },
  { title: "Lock 12 (Definition)", directions: "Enter the base value", prompt: "What is the base of HEXADECIMAL?", answers: ["16", "base16", "base-16", "base 16"], letter: "H" },
  { title: "Lock 13 (Definition)", directions: "Vocabulary", prompt: "A group of 4 bits is called a ______.", answers: ["nibble"], letter: "G" },
  { title: "Lock 14 (Definition)", directions: "Vocabulary", prompt: "A group of 8 bits is called a ______.", answers: ["byte"], letter: "A" },
  { title: "Lock 15 (Definition)", directions: "Concept check", prompt: "Hex digits after 9 are: ", answers: ["a-f", "a–f", "a to f", "abcdef"], letter: "I" },

  // ---------- 16–20: Word / Pattern Puzzles ----------
  {
    title: "Lock 16 (Word Puzzle)",
    directions: "Binary ASCII → Text",
    prompt: "Decode these 8-bit binary ASCII bytes:\n01000010 01001001 01010100\n\nType the word:",
    answers: ["bit"],
    letter: "N",
  },
  {
    title: "Lock 17 (Word Puzzle)",
    directions: "Hex ASCII → Text",
    prompt: "Decode these hex ASCII bytes:\n48 45 58\n\nType the word:",
    answers: ["hex"],
    letter: "O",
  },
  {
    title: "Lock 18 (Pattern Puzzle)",
    directions: "Find the missing value (binary pattern)",
    prompt: "Pattern:\n2₁₀ → 10₂\n5₁₀ → 101₂\n?\n\nRule: write the decimal in binary.\nWhat is 6₁₀ in binary? (no spaces)",
    answers: ["110"],
    letter: "D",
  },
  {
    title: "Lock 19 (Puzzle)",
    directions: "Hex ↔ Binary mapping",
    prompt: "Complete the pattern:\nA₁₆ → 1010₂\nC₁₆ → 1100₂\nE₁₆ → ????₂\n\nType the 4-bit binary:",
    answers: ["1110"],
    letter: "E",
  },
  {
    title: "Lock 20 (Word Puzzle)",
    directions: "Decimal ASCII → Text",
    prompt: "Decode these decimal ASCII codes:\n76 83 85\n\nType the word:",
    answers: ["LSU"],
    letter: "R",
  },
];

// =======================
// GAME ENGINE (No need to edit)
// =======================

let timeLeft = 3600; // 30 minutes
let attempts = 0;
let idx = 0;
let collected = [];

const $ = (id) => document.getElementById(id);

function normalize(s) {
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")     // remove spaces
    .replace(/–/g, "-");      // normalize en-dash
}

function startTimer() {
  setInterval(() => {
    timeLeft--;
    if ($("timer")) $("timer").textContent = `⏱ Time: ${formatTime(timeLeft)}`;
    if (timeLeft <= 0) {
      alert("TIME EXPIRED. The vault re-locks.");
      location.reload();
    }
  }, 1000);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" + s : s}`;
}

function renderLetterBank() {
  const bank = $("letterBank");
  bank.innerHTML = "";
  collected.forEach((ch) => {
    const d = document.createElement("div");
    d.className = "letter";
    d.textContent = ch;
    bank.appendChild(d);
  });
}

function loadLock() {
  const lock = locks[idx];
  $("lockTitle").textContent = lock.title;
  $("lockDirections").textContent = lock.directions;
  $("lockPrompt").textContent = lock.prompt;

  $("answer").value = "";
  $("feedback").textContent = "";
  $("feedback").className = "";

  $("progress").textContent = `🔒 Lock: ${idx + 1} / ${locks.length}`;
  $("attempts").textContent = `❗ Attempts: ${attempts}`;

  renderLetterBank();
}

function checkAnswer() {
  const input = normalize($("answer").value);
  const lock = locks[idx];
  const ok = lock.answers.some(a => normalize(a) === input);

  if (ok) {
    collected.push(lock.letter);
    $("feedback").textContent = `✅ Unlocked! You earned letter: ${lock.letter}`;
    $("feedback").className = "success";
    idx++;

    if (idx < locks.length) {
      setTimeout(loadLock, 450);
    } else {
      // All locks solved — show master lock
      $("lockTitle").textContent = "All 20 Locks Cleared!";
      $("lockDirections").textContent = "MASTER LOCK is now available.";
      $("lockPrompt").textContent = "";
      $("answer").style.display = "none";
      $("submitBtn").style.display = "none";

      $("masterLock").style.display = "block";
      $("scrambleDisplay").textContent =
        `Scrambled Letters (20):\n${SCRAMBLED_SET.split("").join(" ")}\n\n(You should also have 20 letters collected.)`;

      renderLetterBank();
    }
  } else {
    attempts++;
    $("attempts").textContent = `❗ Attempts: ${attempts}`;
    $("feedback").textContent = "❌ Incorrect. Try again.";
    $("feedback").className = "error";
  }
}

function checkMaster() {
  const input = normalize($("masterInput").value);
  const target = normalize(MASTER_PHRASE);

  if (input === target) {
    window.location.href = "final.html";
  } else {
    $("masterFeedback").textContent = "❌ Not quite. Check spelling and order (no spaces).";
    $("masterFeedback").className = "error";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  if (!$("submitBtn")) return;

  startTimer();
  loadLock();

  $("submitBtn").addEventListener("click", checkAnswer);
  $("answer").addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkAnswer();
  });

  $("masterBtn").addEventListener("click", checkMaster);
  $("masterInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkMaster();
  });
});
