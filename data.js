const championSeedData = [
  { name: "Aatrox", archetype: "juggernaut", lanes: ["Baron"], roles: ["Fighter", "Tank"], damageType: "AD", difficulty: "Medium", tags: ["engage", "sustain"] },
  { name: "Ahri", archetype: "burstMage", lanes: ["Mid"], roles: ["Mage", "Assassin"], damageType: "AP", difficulty: "Medium", tags: ["mobility", "pick"] },
  { name: "Akali", archetype: "assassin", lanes: ["Mid", "Baron"], roles: ["Assassin"], damageType: "Mixed", difficulty: "Hard", tags: ["mobility"] },
  { name: "Akshan", archetype: "marksmanAssassin", lanes: ["Mid", "Dragon"], roles: ["Marksman", "Assassin"], damageType: "AD", difficulty: "Hard", tags: ["mobility", "pick"] },
  { name: "Alistar", archetype: "warden", lanes: ["Support"], roles: ["Tank", "Support"], damageType: "AP", difficulty: "Easy", tags: ["engage", "peel", "cc"] },
  { name: "Ambessa", archetype: "diver", lanes: ["Baron", "Jungle"], roles: ["Fighter"], damageType: "AD", difficulty: "Hard", tags: ["mobility", "burst"] },
  { name: "Amumu", archetype: "warden", lanes: ["Jungle", "Support"], roles: ["Tank"], damageType: "AP", difficulty: "Easy", tags: ["engage", "cc"] },
  { name: "Annie", archetype: "burstMage", lanes: ["Mid", "Support"], roles: ["Mage"], damageType: "AP", difficulty: "Easy", tags: ["pick", "cc"] },
  { name: "Ashe", archetype: "utilityMarksman", lanes: ["Dragon"], roles: ["Marksman"], damageType: "AD", difficulty: "Easy", tags: ["poke", "cc"] },
  { name: "Aurelion Sol", archetype: "battlemage", lanes: ["Mid"], roles: ["Mage"], damageType: "AP", difficulty: "Hard", tags: ["scaling", "zone"] },
  { name: "Aurora", archetype: "burstMage", lanes: ["Mid"], roles: ["Mage"], damageType: "AP", difficulty: "Medium", tags: ["mobility", "pick"] },
  { name: "Bard", archetype: "catcher", lanes: ["Support"], roles: ["Support", "Catcher"], damageType: "AP", difficulty: "Hard", tags: ["pick", "roam"] },
  { name: "Blitzcrank", archetype: "catcher", lanes: ["Support"], roles: ["Tank", "Support"], damageType: "AP", difficulty: "Easy", tags: ["pick", "engage"] },
  { name: "Brand", archetype: "battlemage", lanes: ["Mid", "Support"], roles: ["Mage"], damageType: "AP", difficulty: "Easy", tags: ["poke", "antiTank"] },
  { name: "Braum", archetype: "guardian", lanes: ["Support"], roles: ["Tank", "Support"], damageType: "AP", difficulty: "Easy", tags: ["peel", "frontline", "cc"] },
  { name: "Caitlyn", archetype: "marksman", lanes: ["Dragon"], roles: ["Marksman"], damageType: "AD", difficulty: "Easy", tags: ["poke", "range"] },
  { name: "Camille", archetype: "diver", lanes: ["Baron", "Jungle"], roles: ["Fighter"], damageType: "AD", difficulty: "Hard", tags: ["pick", "mobility"] },
  { name: "Corki", archetype: "artillery", lanes: ["Mid", "Dragon"], roles: ["Marksman", "Mage"], damageType: "Mixed", difficulty: "Medium", tags: ["poke", "scaling"] },
  { name: "Darius", archetype: "juggernaut", lanes: ["Baron"], roles: ["Fighter"], damageType: "AD", difficulty: "Easy", tags: ["frontline", "antiMelee"] },
  { name: "Diana", archetype: "diver", lanes: ["Mid", "Jungle"], roles: ["Fighter", "Mage"], damageType: "AP", difficulty: "Medium", tags: ["engage", "burst"] },
  { name: "Dr. Mundo", archetype: "juggernaut", lanes: ["Baron", "Jungle"], roles: ["Tank", "Fighter"], damageType: "AD", difficulty: "Easy", tags: ["frontline", "sustain"] },
  { name: "Draven", archetype: "marksman", lanes: ["Dragon"], roles: ["Marksman"], damageType: "AD", difficulty: "Hard", tags: ["burst", "laneBully"] },
  { name: "Ekko", archetype: "assassin", lanes: ["Mid", "Jungle"], roles: ["Assassin", "Mage"], damageType: "AP", difficulty: "Hard", tags: ["mobility", "burst"] },
  { name: "Evelynn", archetype: "assassin", lanes: ["Jungle"], roles: ["Assassin"], damageType: "AP", difficulty: "Hard", tags: ["pick", "burst"] },
  { name: "Ezreal", archetype: "pokeMarksman", lanes: ["Dragon"], roles: ["Marksman"], damageType: "Mixed", difficulty: "Medium", tags: ["poke", "mobility"] },
  { name: "Fiddlesticks", archetype: "battlemage", lanes: ["Jungle", "Support"], roles: ["Mage"], damageType: "AP", difficulty: "Medium", tags: ["engage", "zone", "sustain"] },
  { name: "Fiora", archetype: "skirmisher", lanes: ["Baron"], roles: ["Fighter"], damageType: "AD", difficulty: "Hard", tags: ["duelist", "splitpush"] },
  { name: "Fizz", archetype: "assassin", lanes: ["Mid"], roles: ["Assassin", "Mage"], damageType: "AP", difficulty: "Medium", tags: ["burst", "mobility"] },
  { name: "Galio", archetype: "guardian", lanes: ["Mid", "Support"], roles: ["Tank", "Mage"], damageType: "AP", difficulty: "Easy", tags: ["engage", "peel", "antiMagic"] },
  { name: "Garen", archetype: "juggernaut", lanes: ["Baron"], roles: ["Fighter"], damageType: "AD", difficulty: "Easy", tags: ["frontline", "sustain"] },
  { name: "Gnar", archetype: "skirmisher", lanes: ["Baron"], roles: ["Fighter", "Tank"], damageType: "AD", difficulty: "Hard", tags: ["poke", "engage"] },
  { name: "Gragas", archetype: "battlemage", lanes: ["Baron", "Jungle", "Mid"], roles: ["Tank", "Mage"], damageType: "AP", difficulty: "Medium", tags: ["engage", "peel"] },
  { name: "Graves", archetype: "marksmanFighter", lanes: ["Jungle"], roles: ["Marksman", "Fighter"], damageType: "AD", difficulty: "Medium", tags: ["burst", "durable"] },
  { name: "Gwen", archetype: "skirmisher", lanes: ["Baron", "Jungle"], roles: ["Fighter"], damageType: "AP", difficulty: "Medium", tags: ["antiTank", "scaling"] },
  { name: "Hecarim", archetype: "diver", lanes: ["Jungle"], roles: ["Fighter", "Tank"], damageType: "AD", difficulty: "Medium", tags: ["engage", "mobility"] },
  { name: "Heimerdinger", archetype: "artillery", lanes: ["Mid", "Baron"], roles: ["Mage"], damageType: "AP", difficulty: "Medium", tags: ["poke", "zone"] },
  { name: "Irelia", archetype: "skirmisher", lanes: ["Mid", "Baron"], roles: ["Fighter"], damageType: "AD", difficulty: "Hard", tags: ["mobility", "duelist"] },
  { name: "Janna", archetype: "enchanter", lanes: ["Support"], roles: ["Support", "Enchanter"], damageType: "AP", difficulty: "Easy", tags: ["peel", "sustain"] },
  { name: "Jarvan IV", archetype: "diver", lanes: ["Jungle", "Baron"], roles: ["Tank", "Fighter"], damageType: "AD", difficulty: "Easy", tags: ["engage", "frontline"] },
  { name: "Jax", archetype: "skirmisher", lanes: ["Baron", "Jungle"], roles: ["Fighter"], damageType: "Mixed", difficulty: "Medium", tags: ["scaling", "splitpush"] },
  { name: "Jayce", archetype: "artillery", lanes: ["Baron", "Mid"], roles: ["Fighter", "Marksman"], damageType: "AD", difficulty: "Hard", tags: ["poke", "burst"] },
  { name: "Jhin", archetype: "utilityMarksman", lanes: ["Dragon"], roles: ["Marksman"], damageType: "AD", difficulty: "Medium", tags: ["pick", "burst"] },
  { name: "Jinx", archetype: "hypercarry", lanes: ["Dragon"], roles: ["Marksman"], damageType: "AD", difficulty: "Easy", tags: ["scaling", "dps"] },
  { name: "Kai'Sa", archetype: "hypercarry", lanes: ["Dragon"], roles: ["Marksman"], damageType: "Mixed", difficulty: "Medium", tags: ["mobility", "burst"] },
  { name: "Kalista", archetype: "skirmishMarksman", lanes: ["Dragon"], roles: ["Marksman"], damageType: "AD", difficulty: "Hard", tags: ["mobility", "duelist"] },
  { name: "Karma", archetype: "enchanter", lanes: ["Support", "Mid"], roles: ["Support", "Mage"], damageType: "AP", difficulty: "Easy", tags: ["poke", "peel"] },
  { name: "Kassadin", archetype: "assassin", lanes: ["Mid"], roles: ["Assassin", "Mage"], damageType: "AP", difficulty: "Hard", tags: ["scaling", "mobility"] },
  { name: "Katarina", archetype: "assassin", lanes: ["Mid"], roles: ["Assassin"], damageType: "AP", difficulty: "Hard", tags: ["mobility", "reset"] },
  { name: "Kayle", archetype: "hypercarry", lanes: ["Baron"], roles: ["Fighter", "Marksman"], damageType: "Mixed", difficulty: "Medium", tags: ["scaling", "supportive"] },
  { name: "Kayn", archetype: "assassin", lanes: ["Jungle"], roles: ["Assassin", "Fighter"], damageType: "AD", difficulty: "Hard", tags: ["mobility", "sustain"] },
  { name: "Kennen", archetype: "burstMage", lanes: ["Baron", "Mid"], roles: ["Mage"], damageType: "AP", difficulty: "Medium", tags: ["engage", "zone"] },
  { name: "Kha'Zix", archetype: "assassin", lanes: ["Jungle"], roles: ["Assassin"], damageType: "AD", difficulty: "Medium", tags: ["pick", "burst"] },
  { name: "Kindred", archetype: "skirmishMarksman", lanes: ["Jungle"], roles: ["Marksman"], damageType: "AD", difficulty: "Hard", tags: ["mobility", "scaling"] },
  { name: "Kog'Maw", archetype: "hypercarry", lanes: ["Dragon"], roles: ["Marksman"], damageType: "Mixed", difficulty: "Medium", tags: ["dps", "antiTank"] },
  { name: "Lee Sin", archetype: "diver", lanes: ["Jungle"], roles: ["Fighter"], damageType: "AD", difficulty: "Hard", tags: ["mobility", "pick"] },
  { name: "Leona", archetype: "warden", lanes: ["Support"], roles: ["Tank", "Support"], damageType: "AP", difficulty: "Easy", tags: ["engage", "cc"] },
  { name: "Lillia", archetype: "skirmisher", lanes: ["Jungle", "Baron"], roles: ["Fighter", "Mage"], damageType: "AP", difficulty: "Medium", tags: ["mobility", "antiTank"] },
  { name: "Lissandra", archetype: "burstMage", lanes: ["Mid"], roles: ["Mage"], damageType: "AP", difficulty: "Medium", tags: ["pick", "cc"] },
  { name: "Lucian", archetype: "marksman", lanes: ["Dragon", "Mid"], roles: ["Marksman"], damageType: "AD", difficulty: "Medium", tags: ["burst", "mobility"] },
  { name: "Lulu", archetype: "enchanter", lanes: ["Support"], roles: ["Support", "Enchanter"], damageType: "AP", difficulty: "Easy", tags: ["peel", "scaling"] },
  { name: "Lux", archetype: "artillery", lanes: ["Mid", "Support"], roles: ["Mage"], damageType: "AP", difficulty: "Easy", tags: ["poke", "pick"] },
  { name: "Malphite", archetype: "warden", lanes: ["Baron", "Support"], roles: ["Tank"], damageType: "AP", difficulty: "Easy", tags: ["engage", "frontline"] },
  { name: "Maokai", archetype: "guardian", lanes: ["Baron", "Support"], roles: ["Tank"], damageType: "AP", difficulty: "Easy", tags: ["frontline", "cc", "zone"] },
  { name: "Master Yi", archetype: "skirmisher", lanes: ["Jungle"], roles: ["Fighter"], damageType: "AD", difficulty: "Easy", tags: ["dps", "reset"] },
  { name: "Mel", archetype: "burstMage", lanes: ["Mid", "Support"], roles: ["Mage"], damageType: "AP", difficulty: "Medium", tags: ["poke", "zone"] },
  { name: "Milio", archetype: "enchanter", lanes: ["Support"], roles: ["Support", "Enchanter"], damageType: "AP", difficulty: "Easy", tags: ["peel", "buff"] },
  { name: "Miss Fortune", archetype: "marksman", lanes: ["Dragon"], roles: ["Marksman"], damageType: "AD", difficulty: "Easy", tags: ["poke", "aoe"] },
  { name: "Mordekaiser", archetype: "juggernaut", lanes: ["Baron"], roles: ["Fighter"], damageType: "AP", difficulty: "Easy", tags: ["frontline", "antiTank"] },
  { name: "Morgana", archetype: "catcher", lanes: ["Mid", "Support"], roles: ["Mage", "Support"], damageType: "AP", difficulty: "Easy", tags: ["pick", "peel"] },
  { name: "Nami", archetype: "enchanter", lanes: ["Support"], roles: ["Support", "Enchanter"], damageType: "AP", difficulty: "Easy", tags: ["sustain", "engage"] },
  { name: "Nasus", archetype: "juggernaut", lanes: ["Baron"], roles: ["Fighter", "Tank"], damageType: "AD", difficulty: "Easy", tags: ["scaling", "frontline"] },
  { name: "Nautilus", archetype: "warden", lanes: ["Support", "Jungle"], roles: ["Tank", "Support"], damageType: "AP", difficulty: "Easy", tags: ["engage", "cc"] },
  { name: "Nidalee", archetype: "specialist", lanes: ["Jungle"], roles: ["Assassin", "Mage"], damageType: "Mixed", difficulty: "Hard", tags: ["poke", "mobility"] },
  { name: "Nilah", archetype: "skirmishMarksman", lanes: ["Dragon"], roles: ["Marksman", "Fighter"], damageType: "AD", difficulty: "Hard", tags: ["dps", "engage"] },
  { name: "Nocturne", archetype: "diver", lanes: ["Jungle"], roles: ["Assassin", "Fighter"], damageType: "AD", difficulty: "Medium", tags: ["pick", "engage"] },
  { name: "Norra", archetype: "enchanter", lanes: ["Support"], roles: ["Support", "Mage"], damageType: "AP", difficulty: "Medium", tags: ["poke", "zone"] },
  { name: "Nunu & Willump", archetype: "guardian", lanes: ["Jungle"], roles: ["Tank"], damageType: "AP", difficulty: "Easy", tags: ["engage", "sustain"] },
  { name: "Olaf", archetype: "juggernaut", lanes: ["Jungle", "Baron"], roles: ["Fighter"], damageType: "AD", difficulty: "Easy", tags: ["frontline", "sustain"] },
  { name: "Orianna", archetype: "burstMage", lanes: ["Mid"], roles: ["Mage"], damageType: "AP", difficulty: "Medium", tags: ["zone", "scaling"] },
  { name: "Ornn", archetype: "guardian", lanes: ["Baron"], roles: ["Tank"], damageType: "AP", difficulty: "Easy", tags: ["frontline", "engage"] },
  { name: "Pantheon", archetype: "diver", lanes: ["Jungle", "Mid", "Support"], roles: ["Fighter", "Assassin"], damageType: "AD", difficulty: "Easy", tags: ["pick", "laneBully"] },
  { name: "Poppy", archetype: "guardian", lanes: ["Baron", "Jungle", "Support"], roles: ["Tank", "Fighter"], damageType: "AD", difficulty: "Medium", tags: ["antiDash", "peel"] },
  { name: "Pyke", archetype: "catcher", lanes: ["Support"], roles: ["Support", "Assassin"], damageType: "AD", difficulty: "Hard", tags: ["pick", "mobility"] },
  { name: "Rakan", archetype: "catcher", lanes: ["Support"], roles: ["Support", "Tank"], damageType: "AP", difficulty: "Medium", tags: ["engage", "peel"] },
  { name: "Rammus", archetype: "guardian", lanes: ["Jungle"], roles: ["Tank"], damageType: "AP", difficulty: "Easy", tags: ["frontline", "antiAD"] },
  { name: "Rell", archetype: "warden", lanes: ["Support"], roles: ["Tank", "Support"], damageType: "AP", difficulty: "Medium", tags: ["engage", "frontline"] },
  { name: "Renekton", archetype: "diver", lanes: ["Baron"], roles: ["Fighter"], damageType: "AD", difficulty: "Easy", tags: ["laneBully", "burst"] },
  { name: "Rengar", archetype: "assassin", lanes: ["Jungle", "Baron"], roles: ["Assassin", "Fighter"], damageType: "AD", difficulty: "Medium", tags: ["pick", "burst"] },
  { name: "Riven", archetype: "skirmisher", lanes: ["Baron"], roles: ["Fighter"], damageType: "AD", difficulty: "Hard", tags: ["mobility", "burst"] },
  { name: "Rumble", archetype: "battlemage", lanes: ["Baron", "Mid"], roles: ["Mage", "Fighter"], damageType: "AP", difficulty: "Medium", tags: ["zone", "antiTank"] },
  { name: "Ryze", archetype: "battlemage", lanes: ["Mid", "Baron"], roles: ["Mage"], damageType: "AP", difficulty: "Medium", tags: ["scaling", "dps"] },
  { name: "Samira", archetype: "skirmishMarksman", lanes: ["Dragon"], roles: ["Marksman"], damageType: "AD", difficulty: "Hard", tags: ["engage", "burst"] },
  { name: "Senna", archetype: "utilityMarksman", lanes: ["Support", "Dragon"], roles: ["Marksman", "Support"], damageType: "AD", difficulty: "Medium", tags: ["poke", "scaling"] },
  { name: "Seraphine", archetype: "enchanter", lanes: ["Support", "Mid"], roles: ["Support", "Mage"], damageType: "AP", difficulty: "Easy", tags: ["poke", "zone"] },
  { name: "Sett", archetype: "juggernaut", lanes: ["Baron", "Support"], roles: ["Fighter", "Tank"], damageType: "AD", difficulty: "Easy", tags: ["frontline", "engage"] },
  { name: "Shen", archetype: "guardian", lanes: ["Baron"], roles: ["Tank"], damageType: "AD", difficulty: "Medium", tags: ["peel", "global"] },
  { name: "Shyvana", archetype: "juggernaut", lanes: ["Jungle", "Baron"], roles: ["Fighter"], damageType: "Mixed", difficulty: "Easy", tags: ["frontline", "scaling"] },
  { name: "Singed", archetype: "specialist", lanes: ["Baron"], roles: ["Tank", "Specialist"], damageType: "AP", difficulty: "Medium", tags: ["frontline", "zone"] },
  { name: "Sion", archetype: "guardian", lanes: ["Baron"], roles: ["Tank"], damageType: "AD", difficulty: "Easy", tags: ["frontline", "engage"] },
  { name: "Sivir", archetype: "marksman", lanes: ["Dragon"], roles: ["Marksman"], damageType: "AD", difficulty: "Easy", tags: ["waveclear", "scaling"] },
  { name: "Smolder", archetype: "hypercarry", lanes: ["Dragon"], roles: ["Marksman"], damageType: "AD", difficulty: "Easy", tags: ["scaling", "poke"] },
  { name: "Sona", archetype: "enchanter", lanes: ["Support"], roles: ["Support", "Enchanter"], damageType: "AP", difficulty: "Easy", tags: ["sustain", "scaling"] },
  { name: "Soraka", archetype: "enchanter", lanes: ["Support"], roles: ["Support", "Enchanter"], damageType: "AP", difficulty: "Easy", tags: ["sustain", "peel"] },
  { name: "Swain", archetype: "battlemage", lanes: ["Mid", "Support"], roles: ["Mage"], damageType: "AP", difficulty: "Medium", tags: ["frontline", "sustain"] },
  { name: "Syndra", archetype: "burstMage", lanes: ["Mid"], roles: ["Mage"], damageType: "AP", difficulty: "Medium", tags: ["burst", "pick"] },
  { name: "Talon", archetype: "assassin", lanes: ["Mid", "Jungle"], roles: ["Assassin"], damageType: "AD", difficulty: "Medium", tags: ["mobility", "burst"] },
  { name: "Teemo", archetype: "specialist", lanes: ["Baron", "Mid"], roles: ["Marksman", "Specialist"], damageType: "AP", difficulty: "Easy", tags: ["poke", "zone"] },
  { name: "Thresh", archetype: "catcher", lanes: ["Support"], roles: ["Support", "Tank"], damageType: "AP", difficulty: "Hard", tags: ["pick", "peel"] },
  { name: "Tristana", archetype: "hypercarry", lanes: ["Dragon", "Mid"], roles: ["Marksman"], damageType: "AD", difficulty: "Easy", tags: ["scaling", "mobility"] },
  { name: "Tryndamere", archetype: "skirmisher", lanes: ["Baron", "Jungle"], roles: ["Fighter"], damageType: "AD", difficulty: "Easy", tags: ["splitpush", "crit"] },
  { name: "Twisted Fate", archetype: "burstMage", lanes: ["Mid"], roles: ["Mage"], damageType: "AP", difficulty: "Medium", tags: ["pick", "global"] },
  { name: "Twitch", archetype: "hypercarry", lanes: ["Dragon"], roles: ["Marksman"], damageType: "AD", difficulty: "Medium", tags: ["scaling", "burst"] },
  { name: "Urgot", archetype: "juggernaut", lanes: ["Baron"], roles: ["Fighter", "Tank"], damageType: "AD", difficulty: "Medium", tags: ["antiTank", "frontline"] },
  { name: "Varus", archetype: "pokeMarksman", lanes: ["Dragon"], roles: ["Marksman"], damageType: "Mixed", difficulty: "Medium", tags: ["poke", "antiTank"] },
  { name: "Vayne", archetype: "hypercarry", lanes: ["Dragon", "Baron"], roles: ["Marksman"], damageType: "AD", difficulty: "Hard", tags: ["antiTank", "mobility"] },
  { name: "Veigar", archetype: "burstMage", lanes: ["Mid"], roles: ["Mage"], damageType: "AP", difficulty: "Easy", tags: ["scaling", "burst"] },
  { name: "Vel'Koz", archetype: "artillery", lanes: ["Mid", "Support"], roles: ["Mage"], damageType: "AP", difficulty: "Medium", tags: ["poke", "antiTank"] },
  { name: "Vex", archetype: "burstMage", lanes: ["Mid"], roles: ["Mage"], damageType: "AP", difficulty: "Easy", tags: ["pick", "antiDash"] },
  { name: "Vi", archetype: "diver", lanes: ["Jungle"], roles: ["Fighter"], damageType: "AD", difficulty: "Easy", tags: ["engage", "pick"] },
  { name: "Viego", archetype: "skirmisher", lanes: ["Jungle"], roles: ["Fighter"], damageType: "AD", difficulty: "Medium", tags: ["dps", "reset"] },
  { name: "Viktor", archetype: "battlemage", lanes: ["Mid"], roles: ["Mage"], damageType: "AP", difficulty: "Medium", tags: ["scaling", "zone"] },
  { name: "Vladimir", archetype: "battlemage", lanes: ["Mid", "Baron"], roles: ["Mage"], damageType: "AP", difficulty: "Medium", tags: ["sustain", "scaling"] },
  { name: "Volibear", archetype: "juggernaut", lanes: ["Jungle", "Baron"], roles: ["Fighter", "Tank"], damageType: "Mixed", difficulty: "Easy", tags: ["engage", "frontline"] },
  { name: "Warwick", archetype: "diver", lanes: ["Jungle"], roles: ["Fighter"], damageType: "AD", difficulty: "Easy", tags: ["sustain", "pick"] },
  { name: "Wukong", archetype: "diver", lanes: ["Jungle", "Baron"], roles: ["Fighter"], damageType: "AD", difficulty: "Easy", tags: ["engage", "frontline"] },
  { name: "Xayah", archetype: "marksman", lanes: ["Dragon"], roles: ["Marksman"], damageType: "AD", difficulty: "Medium", tags: ["peel", "scaling"] },
  { name: "Xin Zhao", archetype: "diver", lanes: ["Jungle"], roles: ["Fighter"], damageType: "AD", difficulty: "Easy", tags: ["engage", "duelist"] },
  { name: "Yasuo", archetype: "skirmisher", lanes: ["Mid", "Baron"], roles: ["Fighter", "Assassin"], damageType: "AD", difficulty: "Hard", tags: ["mobility", "crit"] },
  { name: "Yone", archetype: "skirmisher", lanes: ["Mid", "Baron"], roles: ["Fighter", "Assassin"], damageType: "Mixed", difficulty: "Hard", tags: ["engage", "burst"] },
  { name: "Yuumi", archetype: "enchanter", lanes: ["Support"], roles: ["Support", "Enchanter"], damageType: "AP", difficulty: "Easy", tags: ["peel", "sustain"] },
  { name: "Zed", archetype: "assassin", lanes: ["Mid"], roles: ["Assassin"], damageType: "AD", difficulty: "Hard", tags: ["burst", "mobility"] },
  { name: "Zeri", archetype: "hypercarry", lanes: ["Dragon"], roles: ["Marksman"], damageType: "AD", difficulty: "Hard", tags: ["mobility", "dps"] },
  { name: "Ziggs", archetype: "artillery", lanes: ["Mid", "Dragon"], roles: ["Mage"], damageType: "AP", difficulty: "Easy", tags: ["poke", "zone"] },
  { name: "Zilean", archetype: "enchanter", lanes: ["Support", "Mid"], roles: ["Support", "Mage"], damageType: "AP", difficulty: "Medium", tags: ["peel", "scaling"] },
  { name: "Zoe", archetype: "burstMage", lanes: ["Mid"], roles: ["Mage"], damageType: "AP", difficulty: "Hard", tags: ["poke", "pick"] },
  { name: "Zyra", archetype: "artillery", lanes: ["Support", "Mid"], roles: ["Mage", "Support"], damageType: "AP", difficulty: "Medium", tags: ["zone", "poke"] },
];


const laneLabels = { Baron: "바론", Jungle: "정글", Mid: "미드", Dragon: "드래곤", Support: "서포트" };
const roleLabels = { Fighter: "전사", Tank: "탱커", Mage: "메이지", Assassin: "암살자", Marksman: "원딜", Support: "서포터", Enchanter: "인챈터", Catcher: "캐처", Specialist: "스페셜리스트" };
const difficultyLabels = { Easy: "쉬움", Medium: "보통", Hard: "어려움" };
const tagLabels = {
  engage: "이니시",
  peel: "보호",
  poke: "포킹",
  burst: "폭딜",
  dps: "지속 딜",
  sustain: "유지력",
  scaling: "후반 성장",
  mobility: "기동력",
  pick: "픽 메이킹",
  frontline: "전열",
  antiTank: "탱커 대응",
  antiDash: "대시 억제",
  zone: "구역 장악",
  cc: "CC",
  laneBully: "라인 압박",
  duelist: "1대1",
  splitpush: "사이드 운영",
  reset: "리셋",
  range: "사거리",
  durable: "버티기",
};

const archetypeProfiles = {
  juggernaut: { label: "브루저 / 저거너트", summary: "긴 교전 압박형 전열", baseTags: ["frontline", "dps", "antiMelee"], coreItems: ["Black Cleaver", "Sundered Sky", "Sterak's Gage"], situationalItems: ["Death's Dance", "Maw of Malmortius", "Guardian Angel", "Amaranth's Twinguard"], boots: ["Mercury's Treads", "Plated Steelcaps", "Gluttonous Greaves"], enchants: ["Glorious", "Stasis", "Protobelt"] },
  diver: { label: "다이버", summary: "후방 압박용 진입형", baseTags: ["engage", "mobility", "burst"], coreItems: ["Trinity Force", "Sundered Sky", "Death's Dance"], situationalItems: ["Black Cleaver", "Maw of Malmortius", "Sterak's Gage", "Guardian Angel"], boots: ["Mercury's Treads", "Plated Steelcaps", "Ionian Boots of Lucidity"], enchants: ["Protobelt", "Stasis", "Glorious"] },
  warden: { label: "이니시 탱커", summary: "교전 개시 특화 탱커", baseTags: ["frontline", "engage", "cc"], coreItems: ["Sunfire Aegis", "Thornmail", "Amaranth's Twinguard"], situationalItems: ["Force of Nature", "Frozen Heart", "Randuin's Omen", "Warmog's Armor"], boots: ["Mercury's Treads", "Plated Steelcaps", "Ionian Boots of Lucidity"], enchants: ["Gargoyle", "Locket", "Glorious"] },
  guardian: { label: "보호형 탱커", summary: "받아치기와 캐리 보호", baseTags: ["frontline", "peel", "cc"], coreItems: ["Sunfire Aegis", "Force of Nature", "Amaranth's Twinguard"], situationalItems: ["Frozen Heart", "Thornmail", "Randuin's Omen", "Warmog's Armor"], boots: ["Mercury's Treads", "Plated Steelcaps", "Ionian Boots of Lucidity"], enchants: ["Locket", "Gargoyle", "Redemption"] },
  assassin: { label: "암살자", summary: "단숨에 하나를 지우는 폭딜형", baseTags: ["burst", "mobility", "pick"], coreItems: ["Youmuu's Ghostblade", "Duskblade of Draktharr", "Edge of Night"], situationalItems: ["Serpent's Fang", "Serylda's Grudge", "Guardian Angel", "Maw of Malmortius"], boots: ["Boots of Dynamism", "Ionian Boots of Lucidity", "Mercury's Treads"], enchants: ["Stasis", "Protobelt", "Quicksilver"] },
  burstMage: { label: "버스트 메이지", summary: "짧은 콤보와 픽 메이킹", baseTags: ["burst", "pick", "magic"], coreItems: ["Luden's Echo", "Infinity Orb", "Rabadon's Deathcap"], situationalItems: ["Crown of the Shattered Queen", "Horizon Focus", "Morellonomicon", "Cosmic Drive"], boots: ["Boots of Mana", "Ionian Boots of Lucidity", "Mercury's Treads"], enchants: ["Stasis", "Protobelt", "Veil"] },
  battlemage: { label: "전투형 메이지", summary: "지속 마법 피해와 구역 장악", baseTags: ["magic", "dps", "zone"], coreItems: ["Liandry's Torment", "Rylai's Crystal Scepter", "Rabadon's Deathcap"], situationalItems: ["Riftmaker", "Cosmic Drive", "Morellonomicon", "Crown of the Shattered Queen"], boots: ["Boots of Mana", "Ionian Boots of Lucidity", "Mercury's Treads"], enchants: ["Stasis", "Protobelt", "Veil"] },
  artillery: { label: "포킹 메이지", summary: "먼 거리 견제와 대치전 장악", baseTags: ["poke", "zone", "magic"], coreItems: ["Luden's Echo", "Horizon Focus", "Rabadon's Deathcap"], situationalItems: ["Liandry's Torment", "Morellonomicon", "Infinity Orb", "Crown of the Shattered Queen"], boots: ["Boots of Mana", "Ionian Boots of Lucidity", "Mercury's Treads"], enchants: ["Stasis", "Veil", "Protobelt"] },
  marksman: { label: "원딜", summary: "정면 화력의 기본 축", baseTags: ["dps", "scaling", "physical"], coreItems: ["Infinity Edge", "Magnetic Blaster", "Bloodthirster"], situationalItems: ["Mortal Reminder", "Guardian Angel", "Runaan's Hurricane", "Navori Quickblades"], boots: ["Berserker's Greaves", "Gluttonous Greaves", "Mercury's Treads"], enchants: ["Stasis", "Quicksilver", "Glorious"] },
  utilityMarksman: { label: "유틸 원딜", summary: "딜과 유틸을 겸한 원거리 캐리", baseTags: ["dps", "poke", "cc"], coreItems: ["Infinity Edge", "Runaan's Hurricane", "Mortal Reminder"], situationalItems: ["Magnetic Blaster", "Bloodthirster", "Guardian Angel", "Navori Quickblades"], boots: ["Berserker's Greaves", "Gluttonous Greaves", "Mercury's Treads"], enchants: ["Quicksilver", "Stasis", "Glorious"] },
  pokeMarksman: { label: "포킹 원딜", summary: "전투 전 체력 우위 설계", baseTags: ["poke", "dps", "physical"], coreItems: ["Manamune", "Serylda's Grudge", "Infinity Edge"], situationalItems: ["Mortal Reminder", "Runaan's Hurricane", "Guardian Angel", "Bloodthirster"], boots: ["Ionian Boots of Lucidity", "Berserker's Greaves", "Mercury's Treads"], enchants: ["Stasis", "Quicksilver", "Glorious"] },
  hypercarry: { label: "하이퍼캐리", summary: "후반 정면 딜 최상급", baseTags: ["dps", "scaling", "antiTank"], coreItems: ["Infinity Edge", "Runaan's Hurricane", "Bloodthirster"], situationalItems: ["Mortal Reminder", "Guardian Angel", "Phantom Dancer", "Terminus"], boots: ["Berserker's Greaves", "Gluttonous Greaves", "Mercury's Treads"], enchants: ["Quicksilver", "Stasis", "Glorious"] },
  skirmisher: { label: "스커미셔", summary: "소규모 교전과 측면 압박형", baseTags: ["dps", "mobility", "duelist"], coreItems: ["Blade of the Ruined King", "Trinity Force", "Death's Dance"], situationalItems: ["Wit's End", "Guardian Angel", "Sterak's Gage", "Maw of Malmortius"], boots: ["Gluttonous Greaves", "Mercury's Treads", "Plated Steelcaps"], enchants: ["Stasis", "Protobelt", "Glorious"] },
  skirmishMarksman: { label: "근접 교전형 원딜", summary: "짧은 난전 폭발력형", baseTags: ["dps", "mobility", "burst"], coreItems: ["Infinity Edge", "Bloodthirster", "Phantom Dancer"], situationalItems: ["Mortal Reminder", "Guardian Angel", "Navori Quickblades", "The Collector"], boots: ["Berserker's Greaves", "Gluttonous Greaves", "Mercury's Treads"], enchants: ["Stasis", "Quicksilver", "Protobelt"] },
  enchanter: { label: "인챈터", summary: "회복과 보호 중심 지원형", baseTags: ["peel", "sustain", "buff"], coreItems: ["Ardent Censer", "Staff of Flowing Water", "Harmonic Echo"], situationalItems: ["Imperial Mandate", "Redemption", "Dream Maker", "Protector's Vow"], boots: ["Ionian Boots of Lucidity", "Mercury's Treads", "Boots of Mana"], enchants: ["Redemption", "Locket", "Veil"] },
  catcher: { label: "캐처", summary: "한 명을 잡아 수적 우위 창출", baseTags: ["pick", "cc", "roam"], coreItems: ["Imperial Mandate", "Protector's Vow", "Zeke's Convergence"], situationalItems: ["Knight's Vow", "Dawnshroud", "Locket", "Redemption"], boots: ["Ionian Boots of Lucidity", "Mercury's Treads", "Plated Steelcaps"], enchants: ["Glorious", "Locket", "Redemption"] },
  specialist: { label: "스페셜리스트", summary: "비정형 운영과 판 흔들기", baseTags: ["poke", "zone", "scaling"], coreItems: ["Liandry's Torment", "Rylai's Crystal Scepter", "Cosmic Drive"], situationalItems: ["Morellonomicon", "Crown of the Shattered Queen", "Rabadon's Deathcap", "Horizon Focus"], boots: ["Boots of Mana", "Ionian Boots of Lucidity", "Mercury's Treads"], enchants: ["Stasis", "Glorious", "Veil"] },
  marksmanAssassin: { label: "하이브리드 원딜", summary: "사거리와 암살각을 함께 노림", baseTags: ["burst", "mobility", "physical"], coreItems: ["Youmuu's Ghostblade", "The Collector", "Infinity Edge"], situationalItems: ["Mortal Reminder", "Guardian Angel", "Magnetic Blaster", "Serpent's Fang"], boots: ["Boots of Dynamism", "Berserker's Greaves", "Mercury's Treads"], enchants: ["Stasis", "Quicksilver", "Protobelt"] },
  marksmanFighter: { label: "브루저형 원딜", summary: "근중거리에서 버티며 딜", baseTags: ["burst", "durable", "physical"], coreItems: ["Youmuu's Ghostblade", "Black Cleaver", "Bloodthirster"], situationalItems: ["Guardian Angel", "Maw of Malmortius", "Serylda's Grudge", "Death's Dance"], boots: ["Gluttonous Greaves", "Mercury's Treads", "Plated Steelcaps"], enchants: ["Stasis", "Glorious", "Protobelt"] },
};

const itemData = {
  "Infinity Edge": { category: "Marksman", summary: "치명타 기반 캐리의 대표 화력 코어", tags: ["damage"] },
  "Bloodthirster": { category: "Marksman", summary: "흡혈과 안정성을 함께 챙기는 후반 코어", tags: ["survival"] },
  "Runaan's Hurricane": { category: "Marksman", summary: "다수 대상 지속 딜과 라인 클리어 보강", tags: ["teamfight"] },
  "Trinity Force": { category: "Fighter", summary: "짧은 교환과 추격을 동시에 강화", tags: ["burst"] },
  "Rabadon's Deathcap": { category: "Mage", summary: "순수 AP 화력을 가장 크게 끌어올림", tags: ["damage"] },
  "Sunfire Aegis": { category: "Tank", summary: "탱커의 기본 전면전 가치와 라인 정리 보강", tags: ["frontline"] },
  "Ardent Censer": { category: "Support", summary: "공속 기반 캐리 보조에 최적화", tags: ["buff"] },
  "Harmonic Echo": { category: "Support", summary: "라인 유지력과 짧은 교전 회복 지원", tags: ["heal"] },
  "Imperial Mandate": { category: "Support", summary: "CC 연계 순간 아군 화력을 증폭", tags: ["pick"] },
  "Black Cleaver": { category: "Fighter", summary: "방어력 감소와 추격 보조", tags: ["antiTank"] },
  "Mortal Reminder": { category: "Marksman", summary: "치감과 관통을 동시에", tags: ["antiHeal", "antiTank"] },
  "Morellonomicon": { category: "Mage", summary: "AP 치감 대응", tags: ["antiHeal"] },
  "Liandry's Torment": { category: "Mage", summary: "탱커 상대로 긴 교전", tags: ["antiTank"] },
  "Force of Nature": { category: "Tank", summary: "강한 AP 대응용 MR", tags: ["antiMagic"] },
  "Frozen Heart": { category: "Tank", summary: "공속 기반 AD 억제", tags: ["antiAttackSpeed"] },
  "Randuin's Omen": { category: "Tank", summary: "치명타 조합 상대로 효율", tags: ["antiCrit"] },
  "Thornmail": { category: "Tank", summary: "탱커용 치감", tags: ["antiHeal"] },
  "Serpent's Fang": { category: "Assassin", summary: "실드 조합 파훼", tags: ["antiShield"] },
  "Edge of Night": { category: "Assassin", summary: "중요한 CC 한 번 방어", tags: ["spellShield"] },
  "Stasis": { category: "Enchant", summary: "암살과 다이브 차단", tags: ["survival"] },
  "Quicksilver": { category: "Enchant", summary: "하드 CC 해제", tags: ["cleanse"] },
  "Locket": { category: "Enchant", summary: "광역 보호", tags: ["shield"] },
  "Redemption": { category: "Enchant", summary: "원거리 회복 지원", tags: ["heal"] },
  "Guardian Angel": { category: "Defense", summary: "후반 안전장치", tags: ["survival"] },
  "Maw of Malmortius": { category: "Defense", summary: "AD 챔피언의 AP 대응", tags: ["antiMagic"] },
  "Mercury's Treads": { category: "Boots", summary: "CC와 AP 압박 대응", tags: ["tenacity"] },
  "Plated Steelcaps": { category: "Boots", summary: "평타 AD 대응", tags: ["armor"] },
};

const recommendationRules = [
  { candidate: "antiTank", enemy: "frontline", score: 12, text: "상대 전열 대응" },
  { candidate: "peel", enemy: "engage", score: 10, text: "상대 돌진 억제" },
  { candidate: "peel", enemy: "burst", score: 8, text: "아군 캐리 보호" },
  { candidate: "engage", enemy: "poke", score: 10, text: "포킹 조합 강제 진입" },
  { candidate: "pick", enemy: "scaling", score: 7, text: "중반 픽 메이킹" },
  { candidate: "antiDash", enemy: "mobility", score: 9, text: "기동성 높은 적 상대로 유효" },
  { candidate: "sustain", enemy: "poke", score: 6, text: "포킹 복구 가능" },
];

function normalizeDamageTag(damageType) {
  if (damageType === "AP") return "magic";
  if (damageType === "AD") return "physical";
  return "mixed";
}

function assetPath(folder, baseName, extension) {
  return `./${folder}/${encodeURIComponent(baseName)}.${extension}`;
}

function formatLaneList(lanes) {
  return lanes.map((lane) => laneLabels[lane]).join(" / ");
}

function getRunesForArchetype(archetype) {
  const map = {
    juggernaut: ["정복자", "잔혹", "최후의 일격", "불굴"],
    diver: ["정복자", "승전보", "거인 사냥꾼", "전략가"],
    warden: ["여진", "약점 노출", "충성심", "개척자"],
    guardian: ["여진", "약점 노출", "뼈 방패", "개척자"],
    assassin: ["감전", "돌발 일격", "사냥의 증표", "천상의 몸놀림"],
    burstMage: ["감전", "약점 노출", "최후의 일격", "마나순환 팔찌"],
    battlemage: ["정복자", "침착", "거인 사냥꾼", "마나순환 팔찌"],
    artillery: ["소환: 에어리", "약점 노출", "사냥의 증표", "마나순환 팔찌"],
    marksman: ["치명적 속도", "잔혹", "거인 사냥꾼", "흡혈의 맛"],
    utilityMarksman: ["치명적 속도", "약점 노출", "거인 사냥꾼", "영감"],
    pokeMarksman: ["정복자", "잔혹", "거인 사냥꾼", "영감"],
    hypercarry: ["치명적 속도", "잔혹", "거인 사냥꾼", "흡혈의 맛"],
    skirmisher: ["정복자", "승전보", "최후의 일격", "천상의 몸놀림"],
    skirmishMarksman: ["정복자", "잔혹", "거인 사냥꾼", "흡혈의 맛"],
    enchanter: ["소환: 에어리", "약점 노출", "충성심", "마나순환 팔찌"],
    catcher: ["빙결 강화", "약점 노출", "충성심", "개척자"],
    specialist: ["소환: 에어리", "약점 노출", "거인 사냥꾼", "영감"],
    marksmanAssassin: ["감전", "잔혹", "사냥의 증표", "천상의 몸놀림"],
    marksmanFighter: ["정복자", "승전보", "최후의 일격", "흡혈의 맛"],
  };
  return map[archetype] || ["정복자", "잔혹", "거인 사냥꾼", "영감"];
}

function getSpellsForChampion(seed) {
  if (seed.lanes.includes("Jungle")) return ["강타", "점멸"];
  if (seed.roles.includes("Support")) return ["점멸", "점화"];
  if (seed.tags.includes("burst") || seed.tags.includes("pick")) return ["점멸", "점화"];
  return ["점멸", "보호막"];
}

function getStrengths(tags) {
  const strengths = [];
  if (tags.includes("frontline")) strengths.push("정면 전투에서 먼저 자리를 차지하기 좋습니다.");
  if (tags.includes("engage")) strengths.push("전투 개시 타이밍을 직접 만들 수 있습니다.");
  if (tags.includes("peel")) strengths.push("우리 캐리를 지키며 전투 시간을 늘리는 데 강합니다.");
  if (tags.includes("poke")) strengths.push("오브젝트 전 체력 차이를 만드는 데 능합니다.");
  if (tags.includes("antiTank")) strengths.push("탱커와 브루저 비중이 높은 조합 상대로 가치가 올라갑니다.");
  if (tags.includes("scaling")) strengths.push("시간이 갈수록 승리 조건이 분명해집니다.");
  return strengths.slice(0, 3);
}

function getWeaknesses(tags) {
  const weaknesses = [];
  if (!tags.includes("mobility")) weaknesses.push("시야가 비는 구간에서 먼저 물리면 대응이 어렵습니다.");
  if (!tags.includes("frontline")) weaknesses.push("정면으로 받아내는 역할은 다른 아군에게 맡겨야 합니다.");
  if (tags.includes("burst")) weaknesses.push("첫 교전 스킬이 비면 전투 기대값이 크게 떨어질 수 있습니다.");
  if (tags.includes("scaling")) weaknesses.push("초중반 템포를 빼앗기면 전성기 도달이 늦어집니다.");
  if (tags.includes("poke")) weaknesses.push("강제 진입 조합 상대로 거리 관리가 필수입니다.");
  return weaknesses.slice(0, 3);
}

function getLaneTip(seed) {
  if (seed.tags.includes("laneBully")) return "초반 웨이브와 체력 교환을 먼저 잡고, 상대가 CS를 포기하게 만드는 식으로 압박하세요.";
  if (seed.tags.includes("scaling")) return "라인 이득보다 손실을 줄이는 쪽이 중요하며, 첫 코어까지 안전하게 연결해야 합니다.";
  if (seed.tags.includes("poke")) return "스킬 한 번보다 상대가 앞으로 나오기 싫은 라인 상태를 만드는 데 집중하세요.";
  if (seed.lanes.includes("Jungle")) return "갱킹 각보다 오브젝트 타이밍과 우선 라인 연결을 같이 보면서 템포를 만들어야 합니다.";
  return "짧은 교환에서 얻는 이득과 합류 타이밍을 함께 계산하는 운영이 좋습니다.";
}

function getTeamfightTip(seed) {
  if (seed.tags.includes("peel")) return "누굴 잡을지보다 우리 캐리를 누가 노리는지 먼저 보고 스킬을 남겨 두는 것이 중요합니다.";
  if (seed.tags.includes("engage")) return "상대 핵심 CC와 점멸 유무를 확인한 뒤 한 번에 교전을 여는 쪽이 좋습니다.";
  if (seed.tags.includes("poke")) return "전투가 열리기 전에 체력을 빼 두는 것이 가장 큰 역할입니다.";
  if (seed.tags.includes("burst")) return "정면 지속 딜보다 순간적으로 빈 대상을 확실히 지우는 판단이 중요합니다.";
  return "가장 가까운 안전한 대상부터 처리하면서 살아남는 시간을 길게 가져가세요.";
}

function getPowerSpike(seed) {
  if (seed.tags.includes("laneBully")) return "라인 주도권과 첫 합류 타이밍이 가장 날카로운 전성기입니다.";
  if (seed.tags.includes("scaling")) return "2코어 이후 체감이 오르고 3코어 전후가 핵심 전성기입니다.";
  if (seed.tags.includes("engage")) return "궁극기 해금 후 첫 오브젝트 교전부터 영향력이 커집니다.";
  return "첫 코어 완성 직후부터 챔피언의 본색이 드러나는 편입니다.";
}

function getWinCondition(seed) {
  if (seed.tags.includes("splitpush")) return "사이드 라인 압박으로 상대를 갈라 놓고, 빈 공간에서 이득을 굴리는 것이 핵심입니다.";
  if (seed.tags.includes("pick")) return "오브젝트 전에 한 명을 먼저 끊어 숫자 우위를 만드는 것이 가장 확실한 승리 플랜입니다.";
  if (seed.tags.includes("frontline")) return "먼저 공간을 먹고 정면 전투를 길게 끌수록 가치가 커집니다.";
  if (seed.tags.includes("poke")) return "전투 시작 전 체력 우위를 쌓아 상대가 억지로 들어오게 만들어야 합니다.";
  return "팀의 메인 딜 구간에 맞춰 자신의 강점 구간을 정확히 열어 주는 운영이 중요합니다.";
}

function getAllySynergy(seed) {
  if (seed.tags.includes("engage")) return "광역 딜 메이지, 후속 진입형 전사, 확정 CC 조합과 잘 맞습니다.";
  if (seed.tags.includes("peel")) return "하이퍼캐리 원딜이나 성장형 메이지를 보조할 때 픽 가치가 가장 높습니다.";
  if (seed.tags.includes("poke")) return "장판 스킬, 시야 장악 서포터, 추가 포킹 조합과 궁합이 좋습니다.";
  if (seed.tags.includes("splitpush")) return "4명이 시간을 벌 수 있는 웨이브 클리어 조합이 있으면 강점이 극대화됩니다.";
  return "아군 조합에서 비어 있는 역할을 메우며 안정적인 밸런스를 만드는 픽입니다.";
}

function getEnemyWarning(seed) {
  if (!seed.tags.includes("mobility")) return "긴 사거리 견제와 강제 이니시에 먼저 맞지 않도록 시야와 거리 관리가 중요합니다.";
  if (seed.tags.includes("burst")) return "스톱워치류 인챈트와 확정 CC를 가진 상대 앞에서는 첫 진입 각을 서두르면 안 됩니다.";
  if (seed.tags.includes("scaling")) return "초중반 스노우볼 조합에게 템포를 빼앗기지 않도록 라인 손실을 줄여야 합니다.";
  return "핵심 스킬 교환과 오브젝트 전 시야 차이에서 손해 보지 않는 것이 중요합니다.";
}

function getObjectivePlan(seed) {
  if (seed.tags.includes("poke") || seed.tags.includes("zone")) return "오브젝트보다 먼저 자리를 잡고 진입 경로를 좁히는 식으로 운영해야 강점이 살아납니다.";
  if (seed.tags.includes("engage")) return "시야를 먼저 확보한 뒤 상대가 좁은 길을 지날 때 한 번에 교전을 여는 것이 좋습니다.";
  if (seed.tags.includes("splitpush")) return "오브젝트 시간 전 사이드를 밀어 상대 합류 타이밍을 꼬아 두는 움직임이 중요합니다.";
  return "정면 전투를 열기 전에 먼저 라인 상태와 시야 위치를 유리하게 맞춰 두세요.";
}

function normalizeChampion(seed) {
  const profile = archetypeProfiles[seed.archetype];
  const tags = Array.from(new Set([...profile.baseTags, ...seed.tags, normalizeDamageTag(seed.damageType)]));
  return {
    ...seed,
    displayName: seed.name,
    image: assetPath("champions", seed.name, "jpg"),
    tags,
    profileLabel: profile.label,
    archetypeSummary: profile.summary,
    coreItems: [...profile.coreItems],
    situationalItems: [...profile.situationalItems],
    boots: [...profile.boots],
    enchants: [...profile.enchants],
    strengths: getStrengths(tags),
    weaknesses: getWeaknesses(tags),
    laneTip: getLaneTip(seed),
    teamfightTip: getTeamfightTip(seed),
    powerSpike: getPowerSpike(seed),
    winCondition: getWinCondition(seed),
    allySynergy: getAllySynergy(seed),
    enemyWarning: getEnemyWarning(seed),
    objectivePlan: getObjectivePlan(seed),
    buildSummary: `${profile.coreItems.slice(0, 3).join(" -> ")}를 중심으로 맞추고, 상황에 따라 ${profile.situationalItems.slice(0, 2).join(" / ")} 쪽으로 분기합니다.`,
    draftValue: `${profile.summary} 역할을 더해 주는 픽입니다.`,
    flavor: `${seed.name}는 ${formatLaneList(seed.lanes)}에서 주로 기용되는 ${profile.label} 계열 챔피언입니다.`,
    tmi: `${seed.name}의 키워드는 ${tags.filter((tag) => tagLabels[tag]).slice(0, 3).map((tag) => tagLabels[tag]).join(", ")}입니다.`,
    runes: getRunesForArchetype(seed.archetype),
    spells: getSpellsForChampion(seed),
  };
}

function normalizeItem(name) {
  return {
    name,
    displayName: name,
    image: assetPath("items", name, "png"),
    ...(itemData[name] || { category: "Etc", summary: "상황 대응용 선택지", tags: [] }),
  };
}

const allReferencedItems = new Set([
  ...Object.keys(itemData),
  ...Object.values(archetypeProfiles).flatMap((profile) => [
    ...profile.coreItems,
    ...profile.situationalItems,
    ...profile.boots,
    ...profile.enchants,
  ]),
]);

const champions = championSeedData.map(normalizeChampion).sort((a, b) => a.displayName.localeCompare(b.displayName, "en"));
const championMap = Object.fromEntries(champions.map((champion) => [champion.displayName, champion]));
const itemMap = Object.fromEntries(Array.from(allReferencedItems).map((name) => [name, normalizeItem(name)]));

window.WildriftData = {
  champions,
  championMap,
  itemMap,
  laneLabels,
  roleLabels,
  difficultyLabels,
  tagLabels,
  recommendationRules,
};
