// ==========================================
// 1. CONFIGURATION & STATE
// ==========================================

let currentScript = "Lasina"; // Default script
let currentRawSequence = "";
let spaceClickState = 0;      // 0 = SPACE, 1 = '.', 2 = ':'
let isCartoucheActive = false;

// Dictionary of Toki Pona words
const DICTIONARY = [
  "a", "akesi", "ala", "alasa", "ale", "anpa", "ante", "anu", "awen",
  "e", "en", "esun", "ijo", "ike", "ilo", "insa", "jaki", "jan",
  "jelo", "jo", "kala", "kalama", "kama", "kasi", "ken", "kepeken",
  "kijetesantakalu", "kili", "kin", "kiwen", "ko", "kokosila", "kon",
  "kule", "kulupu", "kute", "la", "lape", "laso", "lawa", "leko",
  "len", "lete", "li", "lili", "linja", "lipu", "loje", "lon",
  "luka", "lukin", "lupa", "ma", "mama", "mani", "meli", "mi",
  "mije", "moku", "moli", "monsi", "mu", "mulapisu", "mun", "musi",
  "mute", "nanpa", "nasa", "nasin", "nena", "ni", "nimi", "noka",
  "o", "olin", "ona", "open", "pakala", "pali", "palisa", "pan",
  "pana", "pi", "pilin", "pimeja", "pini", "pipi", "poka", "poki",
  "pona", "pu", "sama", "seli", "selo", "seme", "sewi", "sijelo",
  "sike", "sin", "sina", "sinpin", "sitelen", "sona", "soweli", "suli",
  "suno", "supa", "suwi", "tan", "taso", "tawa", "telo", "tenpo",
  "toki", "tomo", "tonsi", "tu", "unpa", "uta", "utala", "walo",
  "wan", "waso", "wawa", "weka", "wile", "yupekosi"
];

// Physical Key Definitions (Top Row: a s d f g | Bottom Row: h j k l ;)
const TOKI_KEYS = [
  { id: 'a', label: 'X', role: 'a / e' },
  { id: 's', label: '6', role: 's' },
  { id: 't', label: 'II', role: 't' },
  { id: 'p', label: 'L', role: 'p' },
  { id: 'm', label: 'P', role: 'm' },
  { id: 'n', label: '#', role: 'n' },
  { id: 'i', label: '+', role: 'i / j' },
  { id: 'k', label: 'K', role: 'k' },
  { id: 'l', label: ')', role: 'l' },
  { id: 'w', label: '1', role: 'w / u / o' }
];

// Map Physical Keyboard Positions (e.code) to 10-Key Inputs
const PHYSICAL_CODE_MAP = {
  'KeyA': 'a',
  'KeyS': 's',
  'KeyD': 't', 'KeyT': 't',
  'KeyF': 'p', 'KeyP': 'p',
  'KeyG': 'm', 'KeyM': 'm',
  'KeyH': 'n', 'KeyN': 'n',
  'KeyJ': 'i', 'KeyI': 'i',
  'KeyK': 'k',
  'KeyL': 'l',
  'Semicolon': 'w', 'Quote': 'w', 'KeyW': 'w', 'KeyU': 'w', 'KeyO': 'w'
};

// Mappings for alternative scripts
const AKESI_MAP =  {"a":"`a","akesi":"=","ala":"X","alasa":"-D>","ale":"8","anpa":"L.|","ante":"><","anu":"Y","awen":"_A_",
  "e":">>","en":"+","esun":"$","ijo":"O","ike":"n","ilo":"[]-","insa":"L'|","jaki":"&","jan":",O,","jelo":"-O-<|","jo":"OG",
  "kala":">o","kalama":"\"u'","kama":"_A","kasi":"cp","ken":"K","kepeken":"[]-C","kijetesantakalu":"cm","kili":"o'","kin":"`*",
  "kiwen":"[>","ko":"(3","kokosila":"E3","kon":"SS","kule":"/-\\\\","kulupu":"o8","kute":"')","la":")","lape":"-o","laso":"8-<|",
  "lawa":"O-","leko":"[[]]","len":"[,]","lete":"*","li":">","lili":"v","linja":"~","lipu":"[]","loje":"D<|","lon":"'_",
  "luka":",A","lukin":"<->","lupa":"U","ma":"(+)","mama":"Oo","mani":"`O'","meli":"/o\\","mi":"P","mije":"rO,","moku":"DC",
  "moli":"(XX)","monsi":"-[","mu":"O(.)O","mulapisu":"(> <)","mun":"))","musi":"OUO","mute":"|||","nanpa":"#","nasa":"@",
  "nasin":"/|\\","nena":"A","ni":",|,","nimi":"<_>","noka":"L5","o":"`o","olin":"<<3","ona":"\\o","open":"|=|","pakala":"[S]",
  "pali":"oC","palisa":"0","pan":">>>","pana":"\"n'","pi":"L","pilin":"<3","pimeja":"/x\\","pini":"I","pipi":"'E'","poka":"u.",
  "poki":"L|","pona":"u","pu":"[\"(u)\']","sama":"=","seli":"\\!/","selo":"|TT|","seme":"?","sewi":"wl","sijelo":"|T|",
  "sike":"(O)","sin":"-'-","sina":"6","sinpin":"]-","sitelen":"[\"']","sona":"\"[]'","soweli":"m\")","suli":"V","suno":"-O-",
  "supa":"TT","suwi":"^.^","tan":"L/\\","taso":"-|","tawa":"A_","telo":"~~","tenpo":"(L)","toki":"\"O'","tomo":"<]","tonsi":"`Q'",
  "tu":"||","unpa":"(<)3","uta":"D","utala":",X,","walo":"`/'","wan":"1","waso":"\"} ","wawa":"\\o/","weka":"::","wile":"W",
  "yupekosi":"yk"};

  const UCSUR_MAP = {
  "a": "󱤀",
  "akesi": "󱤁",
  "ala": "󱤂",
  "alasa": "󱤃",
  "ale": "󱤄",
  "ali": "󱤄",
  "anpa": "󱤅",
  "ante": "󱤆",
  "anu": "󱤇",
  "awen": "󱤈",
  "e": "󱤉",
  "en": "󱤊",
  "esun": "󱤋",
  "ijo": "󱤌",
  "ike": "󱤍",
  "ilo": "󱤎",
  "insa": "󱤏",
  "jaki": "󱤐",
  "jan": "󱤑",
  "jelo": "󱤒",
  "jo": "󱤓",
  "kala": "󱤔",
  "kalama": "󱤕",
  "kama": "󱤖",
  "kasi": "󱤗",
  "ken": "󱤘",
  "kepeken": "󱤙",
  "kili": "󱤚",
  "kiwen": "󱤛",
  "ko": "󱤜",
  "kon": "󱤝",
  "kule": "󱤞",
  "kulupu": "󱤟",
  "kute": "󱤠",
  "la": "󱤡",
  "lape": "󱤢",
  "laso": "󱤣",
  "lawa": "󱤤",
  "len": "󱤥",
  "lete": "󱤦",
  "li": "󱤧",
  "lili": "󱤨",
  "linja": "󱤩",
  "lipu": "󱤪",
  "loje": "󱤫",
  "lon": "󱤬",
  "luka": "󱤭",
  "lukin": "󱤮",
  "lupa": "󱤯",
  "ma": "󱤰",
  "mama": "󱤱",
  "mani": "󱤲",
  "meli": "󱤳",
  "mi": "󱤴",
  "mije": "󱤵",
  "moku": "󱤶",
  "moli": "󱤷",
  "monsi": "󱤸",
  "mu": "󱤹",
  "mun": "󱤺",
  "musi": "󱤻",
  "mute": "󱤼",
  "nanpa": "󱤽",
  "nasa": "󱤾",
  "nasin": "󱤿",
  "nena": "󱥀",
  "ni": "󱥁",
  "nimi": "󱥂",
  "noka": "󱥃",
  "o": "󱥄",
  "olin": "󱥅",
  "ona": "󱥆",
  "open": "󱥇",
  "pakala": "󱥈",
  "pali": "󱥉",
  "palisa": "󱥊",
  "pan": "󱥋",
  "pana": "󱥌",
  "pi": "󱥍",
  "pilin": "󱥎",
  "pimeja": "󱥏",
  "pini": "󱥐",
  "pipi": "󱥑",
  "poka": "󱥒",
  "poki": "󱥓",
  "pona": "󱥔",
  "pu": "󱥕",
  "sama": "󱥖",
  "seli": "󱥗",
  "selo": "󱥘",
  "seme": "󱥙",
  "sewi": "󱥚",
  "sijelo": "󱥛",
  "sike": "󱥜",
  "sin": "󱥝",
  "sina": "󱥞",
  "sinpin": "󱥟",
  "sitelen": "󱥠",
  "sona": "󱥡",
  "soweli": "󱥢",
  "suli": "󱥣",
  "suno": "󱥤",
  "supa": "󱥥",
  "suwi": "󱥦",
  "tan": "󱥧",
  "taso": "󱥨",
  "tawa": "󱥩",
  "telo": "󱥪",
  "tenpo": "󱥫",
  "toki": "󱥬",
  "tomo": "󱥭",
  "tu": "󱥮",
  "unpa": "󱥯",
  "uta": "󱥰",
  "utala": "󱥱",
  "walo": "󱥲",
  "wan": "󱥳",
  "waso": "󱥴",
  "wawa": "󱥵",
  "weka": "󱥶",
  "wile": "󱥷",
  "namako": "󱥸",
  "kin": "󱥹",
  "oko": "󱥺",
  "kipisi": "󱥻",
  "leko": "󱥼",
  "monsuta": "󱥽",
  "tonsi": "󱥾",
  "jasima": "󱥿",
  "kijetesantakalu": "󱦀",
  "soko": "󱦁",
  "meso": "󱦂",
  "epiku": "󱦃",
  "kokosila": "󱦄",
  "lanpan": "󱦅",
  "n": "󱦆",
  "misikeke": "󱦇",
  "ku": "󱦈",
  "pake": "󱦠",
  "apeja": "󱦡",
  "majuna": "󱦢",
  "powe": "󱦣",
  "linluwi": "󱦤",
  "kiki": "󱦥",
  "su": "󱦦",
  "isipin": "󱦧",
  "kamalawala": "󱦨",
  "kapesi": "󱦩",
  "melome": "󱦪",
  "mijomi": "󱦫",
  "misa": "󱦬",
  "nimisin": "󱦭",
  "nja": "󱦮",
  "oke": "󱦯",
  "omekapo": "󱦰",
  "puwa": "󱦱",
  "san": "󱦲",
  "taki": "󱦳",
  "te": "󱦴",
  "to": "󱦵",
  "unu": "󱦶",
  "usawi": "󱦷",
  "wa": "󱦸",
  "wuwojiti": "󱦹",
  "yupekosi": "󱦺",
  "cartouche_start": "󱦐",
  "cartouche_end": "󱦑",
  "middle_dot": "󱦜",
  "colon": "󱦝",
  "tally_mark": "󱦞"
};

// ==========================================
// 2. DOM ELEMENTS & INIT
// ==========================================

let outputEl, rawBufferEl, liveMatchEl, keyboardEl, btnSpace, btnCopy;

document.addEventListener('DOMContentLoaded', () => {
  outputEl = document.getElementById('output');
  rawBufferEl = document.getElementById('rawBuffer');
  liveMatchEl = document.getElementById('liveMatch');
  keyboardEl = document.getElementById('keyboard');
  btnSpace = document.getElementById('btnSpace');
  btnCopy = document.getElementById('btnCopy');

  renderKeyboard();
  setupScriptSelectors();
  setupActionButtons();
  setupKeyInterception();
  updateLiveState();
});

// ==========================================
// 3. PREDICTIVE MATCHING ENGINE
// ==========================================

function findBestWord(seq) {
  if (!seq) return "";

  // 1. Diphthong Normalization ('ai' -> 'e', 'aw' -> 'o')
  let normalizedSeq = seq
    .replace(/ai/g, 'e')
    .replace(/aw/g, 'o');

  // Single-key standalone overrides
  if (normalizedSeq === "i") return "e";
  if (normalizedSeq === "w") return "o";
  if (normalizedSeq === "e") return "e";
  if (normalizedSeq === "o") return "o";

  function buildRegex(isStrict) {
    let patternStr = "^";

    for (let i = 0; i < normalizedSeq.length; i++) {
      const char = normalizedSeq[i];
      const nextChar = normalizedSeq[i + 1];

      const hasFollowingVowel = (nextChar === 'a' || nextChar === 'i' || nextChar === 'w' || nextChar === 'e' || nextChar === 'o');

      if (char === 'i') {
        if (hasFollowingVowel) {
          patternStr += "j"; // Consonant /j/
        } else {
          // Strict: 'i' = 'i' | Fallback: 'i' = 'i' or 'e'
          patternStr += isStrict ? "i" : "[ie]";
        }
      } else if (char === 'w') {
        if (hasFollowingVowel) {
          patternStr += "w"; // Consonant /w/
        } else {
          patternStr += "[uo]";
        }
      } else if (char === 'a') {
        patternStr += "a";
      } else if (char === 'e') {
        patternStr += "e";
      } else if (char === 'o') {
        patternStr += "o";
      } else {
        patternStr += char;
      }

      // Allow implicit vowel filler ('a' / 'e') for consonant-only sequences
      if (i < normalizedSeq.length - 1 && char !== 'i' && char !== 'w' && char !== 'a' && char !== 'e' && char !== 'o') {
        patternStr += "[ae]*";
      }
    }

    patternStr += "[ae]*$";
    return new RegExp(patternStr);
  }

  // PASS 1: Strict Check (Picks 'kin' for 'kjh')
  const strictRegex = buildRegex(true);
  const strictMatches = DICTIONARY.filter(w => strictRegex.test(w));
  if (strictMatches.length > 0) return strictMatches[0];

  // PASS 2: Fallback Check (Picks 'ken' for 'kh')
  const fallbackRegex = buildRegex(false);
  const fallbackMatches = DICTIONARY.filter(w => fallbackRegex.test(w));
  if (fallbackMatches.length > 0) return fallbackMatches[0];

  return seq;
}

// Convert Latin word to chosen script
function convertToScript(word, script) {
  if (script === "Akesi") {
    return AKESI_MAP[word] || word;
  }
  if (script === "UCSUR") {
    return UCSUR_MAP[word] || word; 
  }
  return word; // Default: Lasina
}

// ==========================================
// 4. INPUT HANDLERS & STATE
// ==========================================

// 1. Intercept 'kk' in handleInputKey()
function handleInputKey(keyId) {
  resetSpaceState();

  // Check if typing 'k' when the buffer already ends with 'k'
  if (keyId === 'k' && currentRawSequence === 'k') {
    // Clear buffer so 'kk' isn't sent to the word matcher
    currentRawSequence = ""; 
    toggleCartouche();
    updateLiveState();
    return;
  }

  currentRawSequence += keyId;
  updateLiveState();
}

function toggleCartouche() {
  if (!isCartoucheActive) {
    // ENTER CARTOUCHE
    isCartoucheActive = true;
    outputEl.value += (outputEl.value && !outputEl.value.endsWith(" ") ? " [" : "[");
  } else {
    // EXIT CARTOUCHE
    isCartoucheActive = false;
    outputEl.value += "]";
  }
}

function confirmWord() {
  if (currentRawSequence) {
    const matchedWord = findBestWord(currentRawSequence);
    const formattedWord = convertToScript(matchedWord, currentScript);
    outputEl.value += (outputEl.value ? " " : "") + formattedWord;
    currentRawSequence = "";
    resetSpaceState();
  } else {
    // Multi-click Space logic
    if (spaceClickState === 0) {
      if (outputEl.value) outputEl.value += " ";
      spaceClickState = 1;
      if (btnSpace) btnSpace.textContent = ".";
    } else if (spaceClickState === 1) {
      outputEl.value += ".";
      spaceClickState = 2;
      if (btnSpace) btnSpace.textContent = ":";
    } else if (spaceClickState === 2) {
      outputEl.value += ":";
      resetSpaceState();
    }
  }
  updateLiveState();
}

function handleBackspace() {
  resetSpaceState();
  if (currentRawSequence.length > 0) {
    currentRawSequence = currentRawSequence.slice(0, -1);
  } else if (outputEl.value.length > 0) {
    const lastChar = outputEl.value.slice(-1);
    if (lastChar === '[') isCartoucheActive = false;
    if (lastChar === ']') isCartoucheActive = true;
    outputEl.value = outputEl.value.slice(0, -1);
  }
  updateLiveState();
}

function resetSpaceState() {
  spaceClickState = 0;
  if (btnSpace) btnSpace.textContent = "SPACE";
}

function updateLiveState() {
  if (rawBufferEl) rawBufferEl.textContent = currentRawSequence || "-";
  if (liveMatchEl) {
    const match = findBestWord(currentRawSequence);
    liveMatchEl.textContent = match ? convertToScript(match, currentScript) : "-";
  }
}

// ==========================================
// 5. KEYBOARD INTERCEPTION & UI EVENTS
// ==========================================

function setupKeyInterception() {
  if (!outputEl) return;

  outputEl.addEventListener('keydown', (e) => {
    // Allow browser shortcuts (Ctrl/Cmd + C, V, R, etc.)
    if (e.ctrlKey || e.altKey || e.metaKey || e.key === 'Tab') return;

    // Intercept physical layout positions
    if (e.code in PHYSICAL_CODE_MAP) {
      e.preventDefault();
      handleInputKey(PHYSICAL_CODE_MAP[e.code]);
      return;
    }

    if (e.code === 'Space') {
      e.preventDefault();
      confirmWord();
      return;
    }

    if (e.code === 'Backspace') {
      e.preventDefault();
      handleBackspace();
      return;
    }

    // Prevent direct typing of unmatched printable keys
    if (e.key.length === 1) {
      e.preventDefault();
    }
  });
}

function renderKeyboard() {
  if (!keyboardEl) return;
  keyboardEl.innerHTML = '';

  TOKI_KEYS.forEach(k => {
    const btn = document.createElement('button');
    btn.className = 'key-btn';
    btn.type = 'button';
    btn.innerHTML = `<span>${k.label}</span><span class="sub">${k.role}</span>`;

    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      handleInputKey(k.id);
    });

    keyboardEl.appendChild(btn);
  });
}

function setupActionButtons() {
  if (btnSpace) {
    btnSpace.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      confirmWord();
    });
  }

  const btnBackspace = document.getElementById('btnBackspace');
  if (btnBackspace) {
    btnBackspace.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      handleBackspace();
    });
  }

  const btnClear = document.getElementById('btnClear');
  if (btnClear) {
    btnClear.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      currentRawSequence = "";
      if (outputEl) outputEl.value = "";
      resetSpaceState();
      updateLiveState();
    });
  }

  if (btnCopy) {
    btnCopy.onclick = async () => {
      if (!outputEl || !outputEl.value) return;
      try {
        await navigator.clipboard.writeText(outputEl.value);
        const originalText = btnCopy.textContent;
        btnCopy.textContent = "COPIED!";
        setTimeout(() => { btnCopy.textContent = originalText; }, 1200);
      } catch (err) {
        outputEl.select();
        document.execCommand('copy');
      }
    };
  }
}

function setupScriptSelectors() {
  const btnLasina = document.getElementById('btnLasina');
  const btnAkesi = document.getElementById('btnAkesi');
  const btnUcsur = document.getElementById('btnUcsur');

  const scriptBtns = [btnLasina, btnAkesi, btnUcsur].filter(Boolean);

  scriptBtns.forEach(btn => {
    btn.onclick = () => {
      scriptBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (btn === btnLasina) currentScript = "Lasina";
      if (btn === btnAkesi) currentScript = "Akesi";
      if (btn === btnUcsur) currentScript = "UCSUR";

      updateLiveState();
    };
  });
}