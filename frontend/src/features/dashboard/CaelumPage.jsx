import { useState, useCallback, useRef, useMemo, useEffect } from "react";

// -- Binary constants ------------------------------------------------
const FLAT = 0x253F0;
const SZ = 1024;
const SOFF = 548;
const TOFF = 591;
const SN = 43;
const TN = 69;

// -- CRC-32 (no & inside JSX - all in plain JS scope) ---------------
function makeCrcTable() {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) {
            if (c & 1) { c = 0xedb88320 ^ (c >>> 1); }
            else { c = c >>> 1; }
        }
        t[i] = c;
    }
    return t;
}
const CTBL = makeCrcTable();

function crc32(buf, start, end) {
    let c = 0xffffffff;
    for (let i = start; i < end; i++) {
        c = (c >>> 8) ^ CTBL[(c ^ buf[i]) & 0xff];
    }
    return (c ^ 0xffffffff) >>> 0;
}

function bswap32(v) {
    return (
        ((v & 0xff) << 24) |
        (((v >> 8) & 0xff) << 16) |
        (((v >> 16) & 0xff) << 8) |
        ((v >> 24) & 0xff)
    ) >>> 0;
}

function fixCRC(buf) {
    const val = bswap32(crc32(buf, 4, buf.length));
    new DataView(buf.buffer).setUint32(0, val, true);
}

// -- Stat codec ------------------------------------------------------
const dS = b => Math.floor(b / 3) + 25;
const eS = v => Math.max(0, Math.min(222, (v - 25) * 3));
const dT = b => Math.min(99, Math.max(0, b));

// -- Slot read / write -----------------------------------------------
function rdSlot(buf, slot) {
    const r = FLAT + slot * SZ;
    if (r + SZ > buf.length) return null;
    return {
        slot,
        stats: Array.from({ length: SN }, (_, i) => dS(buf[r + SOFF + i])),
        tends: Array.from({ length: TN }, (_, i) => dT(buf[r + TOFF + i])),
        ovr: dS(buf[r + SOFF]),
    };
}

function wStat(buf, slot, i, v) {
    buf[FLAT + slot * SZ + SOFF + i] = eS(v);
    fixCRC(buf);
}
function wTend(buf, slot, i, v) {
    buf[FLAT + slot * SZ + TOFF + i] = Math.max(0, Math.min(99, v));
    fixCRC(buf);
}
function applyStats(buf, slot, arr) {
    const r = FLAT + slot * SZ;
    arr.forEach((v, i) => { if (i < SN) buf[r + SOFF + i] = eS(v); });
    fixCRC(buf);
}
function applyTends(buf, slot, arr) {
    const r = FLAT + slot * SZ;
    arr.forEach((v, i) => { if (i < TN) buf[r + TOFF + i] = Math.max(0, Math.min(99, v)); });
    fixCRC(buf);
}

// -- Lookup tables ---------------------------------------------------
const TEAMS = [
    "76ers", "Bucks", "Bulls", "Cavaliers", "Celtics", "Clippers", "Grizzlies", "Hawks",
    "Heat", "Hornets", "Jazz", "Kings", "Knicks", "Lakers", "Magic", "Mavericks", "Nets",
    "Nuggets", "Pacers", "Pistons", "Raptors", "Rockets", "Spurs", "Suns", "Thunder",
    "Timberwolves", "Trail Blazers", "Warriors", "Wizards", "FA",
];
const POS = ["PG", "SG", "SF", "PF", "C", "-"];
const HZ_LBL = ["Under", "Close-L", "Close-T", "Close-R", "Mid-L", "Mid-ML", "Mid-T", "Mid-MR", "Mid-R", "3PT-L", "3PT-ML", "3PT-T", "3PT-MR", "3PT-R"];
const HZ_VAL = ["Cold", "Neutral", "Hot", "Burned"];
const HZ_COL = { Cold: "#3b82f6", Neutral: "#4b5563", Hot: "#f97316", Burned: "#ef4444" };
// Verified from RED MC Enums.txt — 2K14 order (reshuffled vs 2K13 at index 5+)
const SIG = [
    "None", "Posterizer", "Highlight Film", "Finisher", "Acrobat",
    "Catch and Shoot", "Shot Creator", "Deadeye", "Corner Specialist", "Screen Outlet",
    "Post Proficiency", "Ankle Breaker", "Pick & Roll Maestro", "One Man Fastbreak", "Post Playmaker",
    "Dimer", "Break Starter", "Alley-Ooper", "Flashy Passer", "Brick Wall",
    "Hustle Points", "Lockdown Defender", "Charge Card", "Interceptor", "Pick Pocket",
    "Active Hands", "Pick Dodger", "Eraser", "Chasedown Artist", "Floor General",
    "Defensive Anchor", "Bruiser", "Scrapper", "Tenacious Rebounder", "Anti-Freeze",
    "Microwave", "Heat Retention", "Closer", "Gatorade Perform Pack", "On Court Coach",
    "LeBron Coast to Coast",
];

// -- STAT columns: binary index -> { csv column name, display label }
// Verified against actual Players.csv (357 cols, UTF-16)
const SCOLS = [
    { c: "Overall_I", l: "Overall" }, // [0]
    { c: "SShtLoP", l: "Low Post Shot" }, // [1]
    { c: "SShtCls", l: "Close Shot" }, // [2]
    { c: "SShtFT", l: "Free Throw" }, // [3]
    { c: "SStdDunk", l: "Std Dunk" }, // [4]
    { c: "SLayUp", l: "Layup" }, // [5]
    { c: "SLayUpSpin", l: "Spin Layup" }, // [6]
    { c: "SSht3PT", l: "3-Point" }, // [7]
    { c: "SShtMed", l: "Mid-Range" }, // [8]
    { c: "SDunk", l: "Dunk" }, // [9]
    { c: "SSpeed", l: "Speed" }, // [10]
    { c: "SQuick", l: "Quickness" }, // [11]
    { c: "SStrength", l: "Strength" }, // [12]
    { c: "SBlock", l: "Block" }, // [13]
    { c: "SSteal", l: "Steal" }, // [14]
    { c: "SShtInT", l: "Shot In Traffic" }, // [15]
    { c: "SLayUpEuro", l: "Euro Layup" }, // [16]
    { c: "SLayUpHop", l: "Hop Layup" }, // [17]
    { c: "SRunner", l: "Runner" }, // [18]
    { c: "SStpThru", l: "Step-Thru" }, // [19]
    { c: "SLayUpStnd", l: "Standing Layup" }, // [20]
    { c: "SPstFdaway", l: "Post Fade" }, // [21]
    { c: "SPstHook", l: "Post Hook" }, // [22]
    { c: "SShtOfD", l: "Shot Off Drib" }, // [23]
    { c: "SBallHndl", l: "Ball Handling" }, // [24]
    { c: "SOffHDrib", l: "Off-Hand Drib" }, // [25]
    { c: "SBallSec", l: "Ball Security" }, // [26]
    { c: "SPass", l: "Passing" }, // [27]
    { c: "SOReb", l: "Off Rebound" }, // [28]
    { c: "SDReb", l: "Def Rebound" }, // [29]
    { c: "SOLowPost", l: "Off Low Post" }, // [30]
    { c: "SDLowPost", l: "Def Low Post" }, // [31]
    { c: "SOAwar", l: "Off Awareness" }, // [32]
    { c: "SDAwar", l: "Def Awareness" }, // [33]
    { c: "SConsis", l: "Consistency" }, // [34]
    { c: "SStamina", l: "Stamina" }, // [35]
    { c: "SHands", l: "Hands" }, // [36]
    { c: "SOnBallD", l: "On Ball Def" }, // [37]
    { c: "SEmotion", l: "Emotion" }, // [38]
    { c: "SVertical", l: "Vertical" }, // [39]
    { c: "SHustle", l: "Hustle" }, // [40]
    { c: "SDurab", l: "Durability" }, // [41]
    { c: "SPOT", l: "Potential" }, // [42]
];

// -- TENDENCY columns: binary index -> { csv column name, display label }
// 57 mapped to Players.csv; [57-68] are internal-only (written as 0)
const TCOLS = [
    { c: "TShtTend", l: "Shot Tend" }, // [0]
    { c: "TInsShots", l: "Inside Shot" }, // [1]
    { c: "TCloseSht", l: "Close Shot" }, // [2]
    { c: "TMidShots", l: "Mid-Range" }, // [3]
    { c: "T3PTShots", l: "3-Point" }, // [4]
    { c: "TPutbacks", l: "Putback" }, // [5]
    { c: "TDriveLn", l: "Drive Lane" }, // [6]
    { c: "TPullUp", l: "Pull-Up" }, // [7]
    { c: "TPumpFake", l: "Pump Fake" }, // [8]
    { c: "TTrplThrt", l: "Triple Threat" }, // [9]
    { c: "TNoTT", l: "No Triple Threat" }, // [10]
    { c: "TTTShot", l: "TT Shot" }, // [11]
    { c: "TSizeUp", l: "Size Up" }, // [12]
    { c: "THesitat", l: "Hesitation" }, // [13]
    { c: "TStrghtDr", l: "Straight Drive" }, // [14]
    { c: "TCrossov", l: "Crossover" }, // [15]
    { c: "TSpin", l: "Spin" }, // [16]
    { c: "TStepBack", l: "Step Back" }, // [17]
    { c: "THalfSpin", l: "Half Spin" }, // [18]
    { c: "TDblCross", l: "Double Cross" }, // [19]
    { c: "TBhndBack", l: "Behind Back" }, // [20]
    { c: "THesCross", l: "Hesi-Cross" }, // [21]
    { c: "TInAndOut", l: "In and Out" }, // [22]
    { c: "TDPSimpDr", l: "Simple Drive" }, // [23]
    { c: "TAttackB", l: "Attack Basket" }, // [24]
    { c: "TPassOut", l: "Pass Out" }, // [25]
    { c: "TFadeaway", l: "Fadeaway" }, // [26]
    { c: "TStpbJmpr", l: "Stepback Jumper" }, // [27]
    { c: "TSpinJmpr", l: "Spin Jumper" }, // [28]
    { c: "TDunkvLU", l: "Dunk vs Layup" }, // [29]
    { c: "TAlleyOop", l: "Alley-Oop Rec" }, // [30]
    { c: "TUseGlass", l: "Use Glass" }, // [31]
    { c: "TDrawFoul", l: "Draw Foul" }, // [32]
    { c: "TVShCrash", l: "Crash Board" }, // [33]
    { c: "TPckRlvFd", l: "PnR Fade" }, // [34]
    { c: "TPostUp", l: "Post Up" }, // [35]
    { c: "TTouches", l: "Touches to Post" }, // [36]
    { c: "TPostSpn", l: "Post Spin" }, // [37]
    { c: "TPostDrv", l: "Post Drive" }, // [38]
    { c: "TPostAgBd", l: "Post vs Big" }, // [39]
    { c: "TLeavePost", l: "Leave Post" }, // [40]
    { c: "TPostDrpSt", l: "Drop Step" }, // [41]
    { c: "TPostFaceU", l: "Face Up" }, // [42]
    { c: "TPostBDown", l: "Back Down" }, // [43]
    { c: "TPostShots", l: "Post Shots" }, // [44]
    { c: "TPostHook", l: "Post Hook" }, // [45]
    { c: "TPostFdawy", l: "Post Fade" }, // [46]
    { c: "TPostShmSh", l: "Post Shimmy" }, // [47]
    { c: "TPostHopSh", l: "Hop Shot" }, // [48]
    { c: "TFlshPass", l: "Flashy Pass" }, // [49]
    { c: "TThrowAO", l: "Throw Alley-Oop" }, // [50]
    { c: "THardFoul", l: "Hard Foul" }, // [51]
    { c: "TTakeChrg", l: "Take Charge" }, // [52]
    { c: "TPassLane", l: "Pass Lane" }, // [53]
    { c: "TOnBalStl", l: "On-Ball Steal" }, // [54]
    { c: "TContShot", l: "Contest Shot" }, // [55]
    { c: "TCommFoul", l: "Commit Foul" }, // [56]
    { c: null, l: "Help Defense" }, // [57] not in CSV
    { c: null, l: "Fight Rebound" }, // [58]
    { c: null, l: "High-Low" }, // [59]
    { c: null, l: "Std Dunk Tend" }, // [60]
    { c: null, l: "Mid Game" }, // [61]
    { c: null, l: "Self Alley-Oop" }, // [62]
    { c: null, l: "Guard Post" }, // [63]
    { c: null, l: "Transition" }, // [64]
    { c: null, l: "Off Screen" }, // [65]
    { c: null, l: "Isolation" }, // [66]
    { c: null, l: "PnR Handler" }, // [67]
    { c: null, l: "PnR Roll" }, // [68]
];

// -- Stat groups (indices verified against CSV column audit) ----------
const SG = [
    { n: "Core", c: "#f97316", s: [0, 1, 2, 3, 7, 8, 15] },
    { n: "Finish", c: "#ec4899", s: [4, 9, 5, 6, 16, 17, 18, 19, 20, 21, 22] },
    { n: "Offense", c: "#8b5cf6", s: [23, 24, 25, 26, 27] },
    { n: "Defense", c: "#06b6d4", s: [13, 14, 28, 29, 30, 31, 32, 33, 37] },
    { n: "Athletic", c: "#10b981", s: [10, 11, 12, 39, 40, 41] },
    { n: "Other", c: "#f59e0b", s: [34, 35, 36, 38, 42] },
];

// -- CSV parser -------------------------------------------------------
function parseCSV(text) {
    const lines = text.replace(/\r/g, "").split("\n").filter(l => l.trim());
    const hdr = lines[0].split(",").map(h => h.replace(/"/g, "").trim());
    const C = {};
    hdr.forEach((h, i) => { C[h] = i; });

    function gn(cols, key) {
        if (!(key in C)) return 0;
        const v = (cols[C[key]] || "").replace(/"/g, "").trim();
        const n = parseInt(v, 10);
        return isNaN(n) ? 0 : Math.max(0, Math.min(99, n));
    }
    function gs(cols, key) {
        if (!(key in C)) return "";
        return (cols[C[key]] || "").replace(/"/g, "").trim();
    }

    const db = {};
    lines.slice(1).forEach((line, idx) => {
        const cols = line.split(",");
        const fn = gs(cols, "First_Name");
        const ln = gs(cols, "Last_Name");
        if (!fn && !ln) return;
        db[idx] = {
            fn, ln,
            team: parseInt(gs(cols, "TeamID1") || "-1", 10),
            pos: parseInt(gs(cols, "Pos") || "0", 10),
            jersey: parseInt(gs(cols, "Number") || "0", 10),
            s: SCOLS.map(({ c }) => c ? gn(cols, c) : 0),
            td: TCOLS.map(({ c }) => c ? gn(cols, c) : 0),
            hz: Array.from({ length: 14 }, (_, i) => {
                const v = parseInt(gs(cols, `HZ${i + 1}`) || "1", 10);
                return isNaN(v) ? 1 : Math.max(0, Math.min(3, v));
            }),
            ss: [1, 2, 3, 4, 5].map(k => {
                const v = parseInt(gs(cols, `SigSkill${k}`) || "0", 10);
                return isNaN(v) ? 0 : Math.max(0, Math.min(44, v));
            }),
        };
    });
    return db;
}

// -- Embedded player DB (slot = CSV row index, confirmed 1:1) ---------
const EP = [
    [0, "M.C.", "Williams", 0, 0, 1], [1, "Jason", "Richardson", 0, 1, 23], [2, "Evan", "Turner", 0, 2, 12],
    [3, "Thaddeus", "Young", 0, 3, 21], [4, "Nerlens", "Noel", 0, 4, 4], [5, "Spencer", "Hawes", 0, 1, 0],
    [22, "O.J.", "Mayo", 1, 1, 10], [23, "Brandon", "Knight", 1, 0, 11], [24, "Ersan", "Ilyasova", 1, 3, 7],
    [25, "Larry", "Sanders", 1, 4, 8], [30, "Giannis", "Antetokounmpo", 1, 3, 34], [31, "Khris", "Middleton", 1, 2, 22],
    [40, "Derrick", "Rose", 2, 0, 1], [41, "Jimmy", "Butler", 2, 2, 21], [42, "Luol", "Deng", 2, 3, 9],
    [43, "Carlos", "Boozer", 2, 4, 5], [44, "Joakim", "Noah", 2, 4, 13], [45, "Kirk", "Hinrich", 2, 0, 12],
    [52, "Kyrie", "Irving", 3, 0, 2], [55, "Tristan", "Thompson", 3, 4, 13], [57, "Anthony", "Bennett", 3, 4, 15],
    [65, "Rajon", "Rondo", 4, 0, 9], [66, "Paul", "Pierce", 4, 3, 34], [67, "Kevin", "Garnett", 4, 4, 5],
    [69, "Avery", "Bradley", 4, 1, 0], [70, "Jeff", "Green", 4, 3, 8], [74, "Kelly", "Olynyk", 4, 4, 41],
    [78, "Chris", "Paul", 5, 0, 3], [81, "Blake", "Griffin", 5, 4, 32], [82, "DeAndre", "Jordan", 5, 4, 6],
    [83, "J.J.", "Redick", 5, 1, 4], [85, "Darren", "Collison", 5, 0, 2],
    [93, "Mike", "Conley", 6, 0, 11], [95, "Zach", "Randolph", 6, 4, 50], [96, "Marc", "Gasol", 6, 4, 33],
    [97, "Tony", "Allen", 6, 2, 9],
    [104, "Al", "Horford", 7, 4, 15], [105, "Paul", "Millsap", 7, 4, 4], [106, "Kyle", "Korver", 7, 2, 26],
    [107, "Jeff", "Teague", 7, 0, 0], [109, "Josh", "Smith", 7, 3, 5],
    [119, "Mario", "Chalmers", 8, 0, 6], [120, "Dwyane", "Wade", 8, 1, 3], [121, "LeBron", "James", 8, 2, 6],
    [122, "Udonis", "Haslem", 8, 4, 40], [123, "Chris", "Bosh", 8, 4, 1], [124, "Ray", "Allen", 8, 1, 34],
    [133, "Trey", "Burke", 9, 0, 3], [135, "Gordon", "Hayward", 9, 3, 20], [137, "Al", "Jefferson", 9, 4, 25],
    [152, "DeMarcus", "Cousins", 10, 4, 15], [155, "Isaiah", "Thomas", 10, 0, 21], [156, "Rudy", "Gay", 10, 3, 8],
    [160, "Carmelo", "Anthony", 11, 3, 7], [161, "Raymond", "Felton", 11, 0, 2], [162, "Tyson", "Chandler", 11, 4, 6],
    [164, "J.R.", "Smith", 11, 2, 8], [165, "Amare", "Stoudemire", 11, 4, 1],
    [173, "Kobe", "Bryant", 12, 1, 24], [174, "Pau", "Gasol", 12, 4, 16], [175, "Steve", "Nash", 12, 0, 10],
    [176, "Dwight", "Howard", 12, 4, 12], [179, "Nick", "Young", 12, 2, 0],
    [186, "Victor", "Oladipo", 13, 1, 5], [187, "Jameer", "Nelson", 13, 0, 14], [188, "Nikola", "Vucevic", 13, 4, 9],
    [195, "Monta", "Ellis", 14, 1, 11], [196, "Dirk", "Nowitzki", 14, 4, 41], [197, "Jose", "Calderon", 14, 0, 8],
    [198, "Vince", "Carter", 14, 2, 25], [199, "Shawn", "Marion", 14, 3, 0],
    [208, "Deron", "Williams", 15, 0, 8], [209, "Brook", "Lopez", 15, 4, 11], [210, "Joe", "Johnson", 15, 2, 7],
    [211, "Kevin", "Garnett", 15, 4, 2], [212, "Paul", "Pierce", 15, 3, 34],
    [219, "Ty", "Lawson", 16, 0, 3], [220, "Danilo", "Gallinari", 16, 3, 8], [222, "Kenneth", "Faried", 16, 4, 35],
    [225, "Andre", "Iguodala", 16, 2, 9],
    [229, "Paul", "George", 17, 2, 24], [230, "George", "Hill", 17, 0, 3], [231, "Roy", "Hibbert", 17, 4, 55],
    [232, "David", "West", 17, 4, 21], [233, "Lance", "Stephenson", 17, 2, 1],
    [240, "Brandon", "Jennings", 18, 0, 7], [241, "Greg", "Monroe", 18, 4, 10], [243, "Andre", "Drummond", 18, 4, 0],
    [249, "DeMar", "DeRozan", 19, 1, 10], [250, "Kyle", "Lowry", 19, 0, 7], [253, "Jonas", "Valanciunas", 19, 4, 17],
    [258, "James", "Harden", 20, 1, 13], [259, "Chandler", "Parsons", 20, 3, 25], [260, "Dwight", "Howard", 20, 4, 12],
    [261, "Jeremy", "Lin", 20, 0, 7], [263, "Patrick", "Beverley", 20, 0, 2],
    [267, "Tony", "Parker", 21, 0, 9], [268, "Tim", "Duncan", 21, 4, 21], [269, "Manu", "Ginobili", 21, 2, 20],
    [270, "Kawhi", "Leonard", 21, 3, 2], [271, "Boris", "Diaw", 21, 3, 33], [272, "Danny", "Green", 21, 2, 14],
    [274, "Patty", "Mills", 21, 0, 8],
    [280, "Goran", "Dragic", 22, 0, 1], [283, "Marcin", "Gortat", 22, 4, 13], [285, "Eric", "Bledsoe", 22, 0, 2],
    [291, "Kevin", "Durant", 23, 3, 35], [292, "Russell", "Westbrook", 23, 0, 0], [293, "Serge", "Ibaka", 23, 4, 9],
    [294, "Kevin", "Martin", 23, 2, 23], [296, "Reggie", "Jackson", 23, 0, 15],
    [302, "Kevin", "Love", 24, 4, 42], [303, "Nikola", "Pekovic", 24, 4, 14], [304, "Ricky", "Rubio", 24, 0, 9],
    [313, "LaMarcus", "Aldridge", 25, 4, 12], [314, "Damian", "Lillard", 25, 0, 0], [315, "Wesley", "Matthews", 25, 2, 2],
    [316, "Nicolas", "Batum", 25, 3, 88], [317, "Robin", "Lopez", 25, 4, 42],
    [324, "Stephen", "Curry", 26, 0, 30], [325, "Klay", "Thompson", 26, 1, 11], [326, "David", "Lee", 26, 4, 10],
    [327, "Draymond", "Green", 26, 4, 23], [328, "Andrew", "Bogut", 26, 4, 12], [329, "Andre", "Iguodala", 26, 3, 9],
    [335, "John", "Wall", 27, 0, 2], [336, "Bradley", "Beal", 27, 1, 3], [337, "Nene", "Hilario", 27, 4, 42],
    [339, "Trevor", "Ariza", 27, 3, 1],
];

// Fast slot lookup
const SM = {};
EP.forEach(([s, fn, ln, t, p, j]) => { SM[s] = { slot: s, fn, ln, team: t, pos: p, jersey: j }; });

// -- Color helper -----------------------------------------------------
function ovrCol(v) {
    if (v >= 90) return "#ff6b00";
    if (v >= 85) return "#f97316";
    if (v >= 75) return "#10b981";
    if (v >= 65) return "#3b82f6";
    return "#4b5563";
}

// -- Sub-components ---------------------------------------------------
function Bar({ v, isTend }) {
    const pct = isTend ? v : (v - 25) / 74 * 100;
    return (
        <div style={{ height: 2, background: "#050f1d", flex: 1, borderRadius: 1, overflow: "hidden" }}>
            <div style={{ width: `${Math.max(0, Math.min(100, pct))}%`, height: "100%", background: ovrCol(v), transition: "width .1s" }} />
        </div>
    );
}

function Editable({ v, onChange, isTend }) {
    const [ed, setEd] = useState(false);
    const [d, setD] = useState(String(v));
    useEffect(() => { if (!ed) setD(String(v)); }, [v, ed]);
    function commit() {
        setEd(false);
        const n = parseInt(d, 10);
        const mn = isTend ? 0 : 25;
        if (!isNaN(n) && n >= mn && n <= 99) onChange(n);
        else setD(String(v));
    }
    if (ed) return (
        <input autoFocus value={d} onChange={e => setD(e.target.value)}
            onBlur={commit}
            onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setEd(false); setD(String(v)); } }}
            style={{
                width: 34, background: "#010810", border: "1px solid #f97316", color: "#f1f5f9",
                borderRadius: 2, padding: "0 3px", fontSize: 11, fontFamily: "monospace", textAlign: "right", outline: "none"
            }} />
    );
    return (
        <span onClick={() => setEd(true)}
            style={{
                fontSize: 11, fontWeight: 700, color: ovrCol(v), cursor: "pointer",
                fontFamily: "monospace", minWidth: 24, display: "inline-block", textAlign: "right"
            }}>
            {v}
        </span>
    );
}

function SRow({ label, bin, csv, onChange, isTend }) {
    const diff = csv != null && csv !== bin;
    return (
        <div style={{
            display: "grid", gridTemplateColumns: "1fr 34px 28px 1fr", gap: 5,
            alignItems: "center", padding: "2px 0", borderBottom: "1px solid rgba(255,255,255,0.02)"
        }}>
            <span style={{ fontSize: 9, color: "#2d4a6a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
            <Editable v={bin} onChange={onChange} isTend={isTend} />
            <span style={{
                fontSize: 9, fontFamily: "monospace", textAlign: "right",
                color: csv != null ? (diff ? "#ef4444" : "#10b981") : "#111"
            }}>
                {csv != null ? csv : "-"}
            </span>
            <Bar v={isTend ? (csv != null ? csv : bin) : bin} isTend={isTend} />
        </div>
    );
}

function Ring({ v }) {
    const r = 30, circ = 2 * Math.PI * r;
    const pct = Math.max(0, (v - 25) / 74);
    const col = ovrCol(v);
    return (
        <svg width={70} height={70} viewBox="0 0 70 70">
            <circle cx={35} cy={35} r={r} fill="none" stroke="#050f1d" strokeWidth={5} />
            <circle cx={35} cy={35} r={r} fill="none" stroke={col} strokeWidth={5}
                strokeDasharray={`${circ * pct} ${circ}`} strokeLinecap="round"
                transform="rotate(-90 35 35)" style={{ transition: "stroke-dasharray .25s" }} />
            <text x={35} y={40} textAnchor="middle" fill="#f1f5f9" fontSize={15} fontWeight={900} fontFamily="monospace">{v}</text>
            <text x={35} y={51} textAnchor="middle" fill="#1e3a5f" fontSize={6} letterSpacing={3} fontFamily="monospace">OVR</text>
        </svg>
    );
}

function Tag({ col, children }) {
    return (
        <span style={{
            fontSize: 8, padding: "1px 5px", borderRadius: 2,
            background: col ? col + "10" : "#050f1d", color: col || "#1e3a5f",
            border: `1px solid ${col ? col + "28" : "#0a1828"}`
        }}>
            {children}
        </span>
    );
}

function TabBtn({ active, onClick, col, children }) {
    const c = col || "#f97316";
    return (
        <button onClick={onClick} style={{
            background: "none", border: "none",
            borderBottom: active ? `2px solid ${c}` : "2px solid transparent",
            padding: "5px 10px", fontSize: 8, letterSpacing: "0.12em",
            color: active ? c : "#1e3a5f", cursor: "pointer", fontFamily: "monospace"
        }}>
            {children}
        </button>
    );
}

// -- Main component ---------------------------------------------------
export default function Caelum() {
    const [buf, setBuf] = useState(null);
    const [ovrs, setOvrs] = useState({});
    const [csvDb, setCsvDb] = useState(null);
    const [sel, setSel] = useState(null);
    const [q, setQ] = useState("");
    const [grp, setGrp] = useState(0);
    const [tab, setTab] = useState("stats");
    const [status, setStatus] = useState("");
    const [crcOk, setCrcOk] = useState(null);
    const rosRef = useRef();
    const csvRef = useRef();

    // Load ROS
    const onROS = useCallback(e => {
        const f = e.target.files?.[0]; if (!f) return;
        const rd = new FileReader();
        rd.onload = ev => {
            const d = new Uint8Array(ev.target.result);
            setBuf(d);
            const stored = new DataView(d.buffer).getUint32(0, true);
            const computed = bswap32(crc32(d, 4, d.length));
            setCrcOk(stored === computed);
            const o = {};
            for (let i = 0; i < 1664; i++) o[i] = dS(d[FLAT + i * SZ + SOFF]);
            setOvrs(o);
            setStatus(`Loaded ${f.name} - ${d.length.toLocaleString()} bytes`);
        };
        rd.readAsArrayBuffer(f);
    }, []);

    // Load CSV
    const onCSV = useCallback(e => {
        const f = e.target.files?.[0]; if (!f) return;
        const rd = new FileReader();
        rd.onload = ev => {
            try {
                const db = parseCSV(ev.target.result);
                setCsvDb(db);
                setStatus(`CSV loaded - ${Object.keys(db).length} players`);
            } catch (err) {
                setStatus("CSV error: " + err.message);
            }
        };
        rd.readAsText(f, "utf-16");
    }, []);

    const cur = useMemo(() => buf && sel != null ? rdSlot(buf, sel) : null, [buf, sel]);
    const emb = SM[sel] ?? null;
    const csv = csvDb?.[sel] ?? null;
    const info = csv || emb;

    // Sidebar list
    const list = useMemo(() => {
        const ql = q.toLowerCase().trim();
        let rows = EP.map(([s, fn, ln, t, p, j]) => {
            const c = csvDb?.[s];
            return { slot: s, fn: c?.fn || fn, ln: c?.ln || ln, team: c?.team ?? t, pos: c?.pos ?? p, jersey: c?.jersey ?? j, ovr: ovrs[s] ?? 25 };
        });
        if (ql) {
            if (/^\d+$/.test(ql)) {
                const n = parseInt(ql, 10);
                if (n >= 0 && n < 1664 && !SM[n]) rows.push({ slot: n, fn: "", ln: `Slot ${n}`, team: 29, pos: 5, jersey: 0, ovr: ovrs[n] ?? 25 });
            }
            rows = rows.filter(p => `${p.fn} ${p.ln}`.toLowerCase().includes(ql) || String(p.slot) === ql);
        }
        return rows.sort((a, b) => b.ovr - a.ovr);
    }, [q, ovrs, csvDb]);

    // Edit actions
    const doStat = useCallback((i, v) => {
        if (!buf || sel == null) return;
        const nb = new Uint8Array(buf); wStat(nb, sel, i, v); setBuf(nb);
        if (i === 0) setOvrs(o => ({ ...o, [sel]: v }));
        setStatus(`[${sel}] ${SCOLS[i].l} = ${v}`);
    }, [buf, sel]);

    const doTend = useCallback((i, v) => {
        if (!buf || sel == null) return;
        const nb = new Uint8Array(buf); wTend(nb, sel, i, v); setBuf(nb);
        setStatus(`[${sel}] ${TCOLS[i].l} = ${v}`);
    }, [buf, sel]);

    const doApplyAll = useCallback(() => {
        if (!buf || sel == null || !csv) return;
        const nb = new Uint8Array(buf);
        applyStats(nb, sel, csv.s);
        applyTends(nb, sel, csv.td);
        setBuf(nb);
        setOvrs(o => ({ ...o, [sel]: dS(nb[FLAT + sel * SZ + SOFF]) }));
        setStatus(`[${sel}] all CSV stats + tendencies written`);
    }, [buf, sel, csv]);

    const doApplyStats = useCallback(() => {
        if (!buf || sel == null || !csv) return;
        const nb = new Uint8Array(buf); applyStats(nb, sel, csv.s); setBuf(nb);
        setOvrs(o => ({ ...o, [sel]: dS(nb[FLAT + sel * SZ + SOFF]) }));
        setStatus(`[${sel}] stats written`);
    }, [buf, sel, csv]);

    const doApplyTends = useCallback(() => {
        if (!buf || sel == null || !csv) return;
        const nb = new Uint8Array(buf); applyTends(nb, sel, csv.td); setBuf(nb);
        setStatus(`[${sel}] tendencies written`);
    }, [buf, sel, csv]);

    const doExport = useCallback(() => {
        if (!buf) return;
        const u = URL.createObjectURL(new Blob([buf], { type: "application/octet-stream" }));
        const a = document.createElement("a"); a.href = u; a.download = "NBA_Year_2013-14_edited.ROS"; a.click();
        URL.revokeObjectURL(u);
        setStatus("Exported - CRC updated");
    }, [buf]);

    // -- SPLASH ----------------------------------------------------------
    if (!buf) return (
        <div style={{
            minHeight: "100vh", background: "#010810", display: "flex", alignItems: "center",
            justifyContent: "center", fontFamily: "monospace", color: "#f1f5f9"
        }}>
            <div style={{ textAlign: "center", maxWidth: 460, padding: 40 }}>
                <div style={{ fontSize: 8, letterSpacing: "0.6em", color: "#f97316", marginBottom: 14, opacity: .6 }}>
                    NBA 2K14 - BINARY ROSTER EDITOR
                </div>
                <h1 style={{
                    margin: 0, fontSize: 76, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: .85,
                    background: "linear-gradient(135deg,#f97316,#fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                }}>
                    CAELUM
                </h1>
                <div style={{ fontSize: 8, color: "#1e3a5f", margin: "8px 0 30px", letterSpacing: "0.25em" }}>
                    v4 - ALL CSV COLUMNS VERIFIED - FULLY MAPPED
                </div>
                <div onClick={() => rosRef.current?.click()}
                    style={{
                        border: "1px dashed #1e3a5f", borderRadius: 8, padding: "26px 32px",
                        cursor: "pointer", transition: "all .15s", marginBottom: 10
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.background = "rgba(249,115,22,.03)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e3a5f"; e.currentTarget.style.background = "transparent"; }}>
                    <div style={{ fontSize: 26, marginBottom: 6 }}></div>
                    <div style={{ fontSize: 11, color: "#475569" }}>Click to load NBA_Year_2013-14.ROS</div>
                    <div style={{ fontSize: 8, color: "#1e293b", marginTop: 5 }}>Then load Players.csv for full write support</div>
                </div>
                <input ref={rosRef} type="file" accept=".ROS,.ros" onChange={onROS} style={{ display: "none" }} />
                <div style={{
                    fontSize: 8, color: "#0d1f35", lineHeight: 2.2, textAlign: "left",
                    padding: "10px 14px", border: "1px solid #090f1e", borderRadius: 4
                }}>
                    <span style={{ color: "#1e3a5f" }}>CONFIRMED:</span> Ratings 548-590 b/3+25 - Tendencies 591-659 raw 0-99<br />
                    <span style={{ color: "#1e3a5f" }}>CSV:</span> 357 cols UTF-16 - slot=row - 43 stats - 57 tends - 14 HZ
                </div>
            </div>
        </div>
    );

    // -- EDITOR ----------------------------------------------------------
    const pname = info ? `${info.fn || ""} ${info.ln || ""}`.trim() : sel != null ? `Slot ${sel}` : "";

    return (
        <div style={{
            height: "100vh", display: "flex", flexDirection: "column", background: "#010810",
            fontFamily: "monospace", color: "#f1f5f9", overflow: "hidden"
        }}>

            {/* TOP BAR */}
            <div style={{
                height: 40, background: "#020c1a", borderBottom: "1px solid #050f1d",
                display: "flex", alignItems: "center", padding: "0 12px", gap: 8, flexShrink: 0
            }}>
                <span style={{
                    fontSize: 14, fontWeight: 900, letterSpacing: "-0.04em",
                    background: "linear-gradient(135deg,#f97316,#fbbf24)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                }}>CAELUM</span>
                <span style={{ color: "#0a1828" }}>|</span>
                <div style={{
                    fontSize: 7, padding: "2px 6px", borderRadius: 2,
                    background: crcOk ? "rgba(16,185,129,.07)" : "rgba(239,68,68,.07)",
                    color: crcOk ? "#10b981" : "#ef4444",
                    border: `1px solid ${crcOk ? "rgba(16,185,129,.18)" : "rgba(239,68,68,.18)"}`
                }}>
                    {crcOk ? "CRC OK" : "CRC BAD"}
                </div>
                {csvDb
                    ? <div style={{
                        fontSize: 7, padding: "2px 6px", borderRadius: 2,
                        background: "rgba(16,185,129,.06)", color: "#10b981", border: "1px solid rgba(16,185,129,.15)"
                    }}>
                        CSV {Object.keys(csvDb).length}p
                    </div>
                    : <div onClick={() => csvRef.current?.click()} style={{
                        fontSize: 7, padding: "2px 6px", borderRadius: 2,
                        background: "rgba(99,102,241,.06)", color: "#6366f1", border: "1px solid rgba(99,102,241,.18)", cursor: "pointer"
                    }}>
                        + Load Players.csv
                    </div>
                }
                <input ref={csvRef} type="file" accept=".csv,.CSV" onChange={onCSV} style={{ display: "none" }} />
                <div style={{ flex: 1, fontSize: 8, color: "#1e3a5f", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{status}</div>
                <button onClick={doExport}
                    style={{
                        background: "linear-gradient(135deg,#f97316,#f59e0b)", border: "none", borderRadius: 3,
                        padding: "4px 11px", fontSize: 8, fontWeight: 700, color: "#000", cursor: "pointer"
                    }}>
                    EXPORT
                </button>
            </div>

            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

                {/* SIDEBAR */}
                <div style={{
                    width: 230, flexShrink: 0, borderRight: "1px solid #050f1d",
                    display: "flex", flexDirection: "column", overflow: "hidden"
                }}>
                    <div style={{ padding: "7px 8px", borderBottom: "1px solid #050f1d" }}>
                        <input placeholder="Name or slot number..." value={q} onChange={e => setQ(e.target.value)}
                            style={{
                                width: "100%", background: "#020c1a", border: "1px solid #0a1828", borderRadius: 3,
                                padding: "5px 7px", fontSize: 10, color: "#64748b", outline: "none",
                                boxSizing: "border-box", fontFamily: "monospace"
                            }} />
                        <div style={{ fontSize: 7, color: "#0a1828", marginTop: 2, textAlign: "right" }}>{list.length} players</div>
                    </div>
                    <div style={{ flex: 1, overflowY: "auto" }}>
                        {list.length === 0 && (
                            <div style={{ padding: 16, textAlign: "center", fontSize: 8, color: "#0a1828", lineHeight: 2 }}>
                                No match. Try name or slot number.
                            </div>
                        )}
                        {list.map(p => {
                            const act = sel === p.slot;
                            return (
                                <div key={p.slot} onClick={() => setSel(p.slot)}
                                    style={{
                                        padding: "5px 8px", cursor: "pointer",
                                        borderBottom: "1px solid rgba(5,15,29,.95)",
                                        background: act ? "rgba(249,115,22,.05)" : "transparent",
                                        borderLeft: act ? "2px solid #f97316" : "2px solid transparent"
                                    }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{
                                            fontSize: 10, color: act ? "#e2e8f0" : "#475569",
                                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160
                                        }}>
                                            {p.fn} {p.ln}
                                        </span>
                                        <span style={{ fontSize: 10, fontWeight: 700, flexShrink: 0, marginLeft: 4, color: ovrCol(p.ovr) }}>
                                            {p.ovr}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: 7, color: "#0a1828", marginTop: 1 }}>
                                        #{p.slot} {TEAMS[p.team] || "?"} {POS[p.pos] || "?"}
                                        {p.jersey ? ` #${p.jersey}` : ""}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* [PART_6] */}
            </div>
        </div>
    );
}
