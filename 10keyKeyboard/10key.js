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

// Explicit overrides to disambiguate abjad collisions
const AMBIGUITY_MAP = {
  "a": "a",
  "j": "e",
  "aj": "e",
  "al": "ala",
  "alj": "ale",
  "jlw": "ilo",
  "jjlw": "jelo",
  "wn": "ona",
  "wan": "wan",
  "pn": "pan",
  "pna": "pana",
  "sm": "sama",
  "sjmj": "seme",
  "sjn": "sin",
  "sjna": "sina",
  "tw": "tu",
  "twa": "tawa",
  "jn": "en",
  "jan": "jan"
};

// Physical Key Definitions (Top Row: a s d f g | Bottom Row: h j k l ;)
const TOKI_KEYS = [
  { id: 'a', label: 'X', role: 'a / e' },
  { id: 's', label: '6', role: 's' },
  { id: 't', label: 'II', role: 't' },
  { id: 'p', label: 'L', role: 'p' },
  { id: 'm', label: 'P', role: 'm' },
  { id: 'n', label: '#', role: 'n' },
  { id: 'j', label: '+', role: 'i / j' },
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
  'KeyJ': 'j', 'KeyI': 'j',
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
  "a": "󱤀", "akesi": "󱤁", "ala": "󱤂", "alasa": "󱤃", "ale": "󱤄", "ali": "󱤄", "anpa": "󱤅", "ante": "󱤆",
  "anu": "󱤇", "awen": "󱤈", "e": "󱤉", "en": "󱤊", "esun": "󱤋", "ijo": "󱤌", "ike": "󱤍", "ilo": "󱤎",
  "insa": "󱤏", "jaki": "󱤐", "jan": "󱤑", "jelo": "󱤒", "jo": "󱤓", "kala": "󱤔", "kalama": "󱤕", "kama": "󱤖",
  "kasi": "󱤗", "ken": "󱤘", "kepeken": "󱤙", "kili": "󱤚", "kiwen": "󱤛", "ko": "󱤜", "kon": "󱤝", "kule": "󱤞",
  "kulupu": "󱤟", "kute": "󱤠", "la": "󱤡", "lape": "󱤢", "laso": "󱤣", "lawa": "󱤤", "len": "󱤥", "lete": "󱤦",
  "li": "󱤧", "lili": "󱤨", "linja": "󱤩", "lipu": "󱤪", "loje": "󱤫", "lon": "󱤬", "luka": "󱤭", "lukin": "󱤮",
  "lupa": "󱤯", "ma": "󱤰", "mama": "󱤱", "mani": "󱤲", "meli": "󱤳", "mi": "󱤴", "mije": "󱤵", "moku": "󱤶",
  "moli": "󱤷", "monsi": "󱤸", "mu": "󱤹", "mun": "󱤺", "musi": "󱤻", "mute": "󱤼", "nanpa": "󱤽", "nasa": "󱤾",
  "nasin": "󱤿", "nena": "󱥀", "ni": "󱥁", "nimi": "󱥂", "noka": "󱥃", "o": "󱥄", "olin": "󱥅", "ona": "󱥆",
  "open": "󱥇", "pakala": "󱥈", "pali": "󱥉", "palisa": "󱥊", "pan": "󱥋", "pana": "󱥌", "pi": "󱥍", "pilin": "󱥎",
  "pimeja": "󱥏", "pini": "󱥐", "pipi": "󱥑", "poka": "󱥒", "poki": "󱥓", "pona": "󱥔", "pu": "󱥕", "sama": "󱥖",
  "seli": "󱥗", "selo": "󱥘", "seme": "󱥙", "sewi": "󱥚", "sijelo": "󱥛", "sike": "󱥜", "sin": "󱥝", "sina": "󱥞",
  "sinpin": "󱥟", "sitelen": "󱥠", "sona": "󱥡", "soweli": "󱥢", "suli": "󱥣", "suno": "󱥤", "supa": "󱥥", "suwi": "󱥦",
  "tan": "󱥧", "taso": "󱥨", "tawa": "󱥩", "telo": "󱥪", "tenpo": "󱥫", "toki": "󱥬", "tomo": "󱥭", "tu": "󱥮",
  "unpa": "󱥯", "uta": "󱥰", "utala": "󱥱", "walo": "󱥲", "wan": "󱥳", "waso": "󱥴", "wawa": "󱥵", "weka": "󱥶",
  "wile": "󱥷", "namako": "󱥸", "kin": "󱥹", "oko": "󱥺", "kipisi": "󱥻", "leko": "󱥼", "monsuta": "󱥽", "tonsi": "󱥾",
  "jasima": "󱥿", "kijetesantakalu": "󱦀", "soko": "󱦁", "meso": "󱦂", "epiku": "󱦃", "kokosila": "󱦄", "lanpan": "󱦅", "n": "󱦆",
  "misikeke": "󱦇", "ku": "󱦈", "pake": "󱦠", "apeja": "󱦡", "majuna": "󱦢", "powe": "󱦣", "linluwi": "󱦤", "kiki": "󱦥",
  "su": "󱦦", "isipin": "󱦧", "kamalawala": "󱦨", "kapesi": "󱦩", "melome": "󱦪", "mijomi": "󱦫", "misa": "󱦬", "nimisin": "󱦭",
  "nja": "󱦮", "oke": "󱦯", "omekapo": "󱦰", "puwa": "󱦱", "san": "󱦲", "taki": "󱦳", "te": "󱦴", "to": "󱦵",
  "unu": "󱦶", "usawi": "󱦷", "wa": "󱦸", "wuwojiti": "󱦹", "yupekosi": "󱦺", "cartouche_start": "󱦐", "cartouche_end": "󱦑",
  "middle_dot": "󱦜", "colon": "󱦝", "tally_mark": "󱦞"
};

// Script converter helper
function convertToScript(word, script) {
  if (script === "Akesi") return AKESI_MAP[word] || word;
  if (script === "UCSUR") return UCSUR_MAP[word] || word;
  return word;
}

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

// Convert word to key sequence according to abjad rules
function wordToKeySequence(word) {
  for (const [key, targetWord] of Object.entries(AMBIGUITY_MAP)) {
    if (targetWord === word) return key;
  }

  let seq = "";
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const prevChar = word[i - 1];
    const nextChar = word[i + 1];

    if (char === 'a') {
      seq += (i === 0) ? 'a' : '';
    } 
    else if (char === 'e') {
      if (i === 0) seq += 'j';
      else if (prevChar === 'j' || prevChar === 'w') seq += 'j';
    } 
    else if (char === 'i') {
      seq += 'j';
    } 
    else if (char === 'o' || char === 'u') {
      seq += 'w';
    } 
    else if (char === 'n') {
      seq += 'n';
      if (nextChar === 'a') { seq += 'a'; i++; }
      else if (nextChar === 'i' || nextChar === 'e') { seq += 'j'; i++; }
      else if (nextChar === 'o' || nextChar === 'u') { seq += 'w'; i++; }
    } 
    else {
      seq += char;
    }
  }
  return seq;
}

// Predict matching Toki Pona word
function findBestWord(seq) {
  if (!seq) return "";
  const input = String(seq).toLowerCase();

  // 1. Check ambiguity map first
  if (AMBIGUITY_MAP[input]) {
    return AMBIGUITY_MAP[input];
  }

  // 2. Exact match check
  const exactMatches = DICTIONARY.filter(word => wordToKeySequence(word) === input);
  if (exactMatches.length > 0) return exactMatches[0];

  // 3. Prefix match while typing (live preview support)
  const prefixMatches = DICTIONARY.filter(word => wordToKeySequence(word).startsWith(input));
  return prefixMatches.length > 0 ? prefixMatches[0] : seq;
}

// ==========================================
// 4. INPUT HANDLERS & STATE
// ==========================================

function handleInputKey(keyId) {
  resetSpaceState();

  if (keyId === 'k' && currentRawSequence === 'k') {
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
    isCartoucheActive = true;
    outputEl.value += (outputEl.value && !outputEl.value.endsWith(" ") ? " [" : "[");
  } else {
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
    if (e.ctrlKey || e.altKey || e.metaKey || e.key === 'Tab') return;

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