// Shared game content for show.html (recording), notes.html (script) and play.html (viewer site).
// Every number is a reported figure, a public filing, a brand's own store, or a labelled rule of thumb.
// Sources + confidence: SCRIPT.md.

const SUBJ = {
  ZALT:     { img:"img/zalt.jpg", img2:"img/zalt_mix.jpg", type:"Electrolytes", bg:"#2f6fd6", fg:"#f4f1ea",
              inside:"Sea salt, sodium + potassium citrate, B6, B12. No caffeine, no sugar." },
  Grinds:   { img:"img/grinds.png", img2:"img/grinds_open.png", type:"Coffee", bg:"#5a3a24", fg:"#f3e6cf",
              inside:"Real coffee grounds. Caffeine from the coffee itself." },
  Neutonic: { img:"img/neutonic.png", img2:"img/neutonic_puck.png", type:"Focus", bg:"#121a2e", fg:"#7df0c8",
              inside:"Caffeine + Cognizin (citicoline) + B vitamins. One flavor: mint." },
  Nectr:    { img:"img/nectr.png", img2:"img/nectr_mint.png", type:"Energy", bg:"#ff8a1f", fg:"#1b1206",
              inside:"Caffeine, nothing else. 20 pouches a can." },
  Ultra:    { img:"img/ultra.png", img2:"img/ultra_open.png", type:"Focus", bg:"#0d0d0d", fg:"#e6ff3d",
              inside:"Paraxanthine, alpha-GPC, L-theanine. 15 pouches a can." },
  ZYN:      { mono:"ZYN", type:"Nicotine", bg:"#0b1a2b", fg:"#4fd1ff",
              inside:"Nicotine (3 or 6mg). 15 pouches a can. Philip Morris owns it." },
  USA:      { mono:"USA", name:"America", type:"The thesis", bg:"#f3efe6", fg:"#141414" },
  Coke:     { mono:"COKE", name:"Coca-Cola", type:"Public company", bg:"#e41e2b", fg:"#ffffff" },
  Monster:  { mono:"M", name:"Monster", type:"Public company", bg:"#111111", fg:"#9be22d" },
  Celsius:  { mono:"CEL", name:"Celsius", type:"Public company", bg:"#f2f2f2", fg:"#111111" },
  PMI:      { mono:"PMI", name:"Philip Morris", type:"Owns ZYN", bg:"#0b1a2b", fg:"#4fd1ff" },
  Poppi:    { mono:"POPPI", name:"Poppi", type:"Bought by Pepsi", bg:"#ffd640", fg:"#2a1020" },
  Lightning:{ mono:"\u26a1", name:"Lightning", type:"Higher or lower", bg:"#ffd23f", fg:"#111111" },
};
const POUCHES = ["ZALT","Grinds","Neutonic","Nectr","Ultra"];
const nameOf = k => SUBJ[k].name || k;

// Answer buttons for the pick-style questions. Keys: 1\u2013n (and H/L on higher-or-lower).
const OPTS = {
  brands: POUCHES.map((k,i) => ({ id:k, label:k, key:String(i+1), brand:k })),
  rf: [ { id:"REAL", label:"Real", key:"1", bg:"#2fe07a", fg:"#0b2a17" }, { id:"FAKE", label:"Fake", key:"2", bg:"#ff4a3a", fg:"#2a0b0b" } ],
  hl: [ { id:"HIGHER", label:"\u25b2 Higher", key:"1", alt:"h", bg:"#2fe07a", fg:"#0b2a17" }, { id:"LOWER", label:"\u25bc Lower", key:"2", alt:"l", bg:"#ff4a3a", fg:"#2a0b0b" } ],
};

// Question fields: s subject \u00b7 q question \u00b7 ans answer \u00b7 show display override \u00b7 pre/post units \u00b7 cents (\u00a2 price)
// tol:"pts" (percentage-point scoring) \u00b7 x multiplier \u00b7 ref (caffeine bar vs coffee) \u00b7 hide (no can image on guess)
// pick:"brands"|"rf"|"hl" for button questions (ans = option id) \u00b7 fact \u00b7 src
const LEVELS = [
  { id:"thesis", name:"The Thesis", sub:"Is everyone actually getting healthier? Prove it.", lc:"#ffb020", lc2:"#e8960a", qs:[
    { s:"USA", q:"What % of Americans say they drink alcohol?", post:"%", ans:54, tol:"pts", fact:"<b>Lowest Gallup has ever recorded</b> \u2014 since 1939. Only 50% of 18\u201334s.", src:"Gallup \u00b7 Aug 2025" },
    { s:"USA", q:"How much do Americans spend on wellness a year?", pre:"$", post:"B", ans:500, show:"$500B+", fact:"Growing <b>4\u20135% every year.</b> 84% say wellness is a top priority.", src:"McKinsey Future of Wellness \u00b7 2025" },
    { s:"USA", q:"Gen Z is 36% of US adults. What % of wellness spending is theirs?", post:"%", ans:41, tol:"pts", fact:"<b>More than their share.</b> The youngest buyers are spending the most.", src:"McKinsey Future of Wellness \u00b7 2025" },
  ]},
  { id:"rf", name:"Real or Fake", sub:"Pouch brands get weird. Real product \u2014 or did I make it up?", lc:"#ff3d7f", lc2:"#d92a66", qs:[
    { s:"Grinds", pick:"rf", q:"Grinds sells a Kentucky Bourbon flavored coffee pouch.", ans:"REAL", fact:"<b>Real.</b> It's in their 'Spirits Pack' with Whiskey Cola and Cinnamon Whiskey. Zero alcohol.", src:"getgrinds.com" },
    { s:"ZALT", pick:"rf", q:"ZALT sells a Pickle Juice flavor.", ans:"FAKE", fact:"<b>Fake.</b> Cool Mint, Watermelon, Lemon Lime, Strawberry Lemonade. No pickle\u2026 yet.", src:"tryzalt.com" },
    { s:"Ultra", pick:"rf", q:"Ultra sells a pouch that helps you fall ASLEEP.", ans:"REAL", fact:"<b>Real.</b> Sleep Pouches, Honey Lemon. Focus in the day, sleep at night \u2014 a pouch for every hour.", src:"takeultra.com" },
    { s:"Neutonic", pick:"rf", q:"Neutonic's focus pouch comes in Blue Raspberry.", ans:"FAKE", fact:"<b>Fake</b> \u2014 trap. Their <b>drink</b> comes in Blue Raspberry. The pouch is mint only.", src:"neutonic.com" },
    { s:"Neutonic", pick:"rf", q:"Neutonic sells focus TOOTHPICKS.", ans:"REAL", fact:"<b>Real.</b> 'Nootropicks.' The pouch isn't even their weirdest product.", src:"neutonic.com" },
    { s:"Nectr", pick:"rf", q:"Nectr sells a Jalape\u00f1o Lime energy pouch.", ans:"REAL", fact:"<b>Real.</b> Next to Fresh Mint and Black Cherry. Spicy energy.", src:"nectr.energy" },
    { s:"Grinds", pick:"rf", q:"Grinds sells a Pumpkin Spice Latte flavor.", ans:"FAKE", fact:"<b>Fake</b> \u2014 but Root Beer, S'mores, Pi\u00f1a Colada and Peanut Butter Cup are all real.", src:"getgrinds.com" },
  ]},
  { id:"caf", name:"Spec Sheet", sub:"Caffeine per pouch. A cup of coffee is about 95mg.", lc:"#7c5cff", lc2:"#6343e8", qs:[
    { s:"ZALT", q:"Caffeine per pouch", post:"mg", ans:0, fact:"<b>Zero.</b> It's salt and B vitamins \u2014 hydration, not energy.", ref:95, hide:true },
    { s:"Grinds", q:"Caffeine per pouch", post:"mg", ans:25, fact:"About <b>a quarter of a coffee.</b> (It's printed on the can. Free points.)", ref:95, hide:true },
    { s:"Neutonic", q:"Caffeine per pouch", post:"mg", ans:50, fact:"<b>50mg</b> + 125mg Cognizin. Max <b>four a day</b> on the label.", ref:95, hide:true },
    { s:"Nectr", q:"Caffeine per pouch", post:"mg", ans:50, fact:"<b>50mg</b> \u2014 half a coffee. That's the whole formula.", ref:95, hide:true },
    { s:"Ultra", q:"Caffeine per pouch (focus pouch)", post:"mg", ans:0, fact:"<b>Zero caffeine</b> \u2014 but <b>100mg paraxanthine</b>, what your body turns caffeine into.", ref:95, hide:true },
  ]},
  { id:"price", name:"Shelf Price", sub:"Price per pouch, in cents. Then ZYN, for comparison.", lc:"#1fbf62", lc2:"#17a554", qs:[
    { s:"ZALT", q:"Price per pouch", post:"\u00a2", ans:60, cents:true, fact:"<b>$44.95 for 5 cans</b> of 15. An LMNT packet is ~$1.50.", src:"tryzalt.com" },
    { s:"Grinds", q:"Price per pouch", post:"\u00a2", ans:33, cents:true, fact:"<b>$5.95 for 18.</b> Cheapest coffee you'll ever have.", src:"getgrinds.com" },
    { s:"Neutonic", q:"Price per pouch", post:"\u00a2", ans:27, cents:true, fact:"<b>$5.40 a puck of 20.</b> Cheapest in the video.", src:"neutonic.com" },
    { s:"Nectr", q:"Price per pouch", post:"\u00a2", ans:55, cents:true, fact:"<b>$10.99 a can of 20.</b> At Target a 4-pack is $23.99 \u2014 ~30\u00a2 each.", src:"nectr.energy \u00b7 Target" },
    { s:"Ultra", q:"Price per pouch", post:"\u00a2", ans:107, cents:true, fact:"<b>$16 for 15.</b> Over a dollar a pouch.", src:"takeultra.com" },
    { s:"ZYN", q:"Price per pouch \u2014 the nicotine one", post:"\u00a2", ans:38, cents:true, fact:"<b>~$5.64 for 15</b> (suggested price). The health ones aren't the cheap option.", src:"Suggested retail \u00b7 varies by state" },
  ]},
  { id:"habit", name:"Habit Math", sub:"A habit is a subscription nobody signed up for. What's one customer worth a year?", lc:"#00b38f", lc2:"#009a7b", qs:[
    { s:"ZYN", q:"One can of ZYN a day. What does that cost per YEAR?", pre:"$", post:"/yr", ans:2059, show:"$2,059", fact:"<b>$5.64 \u00d7 365.</b> One customer is worth two grand a year \u2014 every year.", src:"My math \u00b7 suggested retail" },
    { s:"Neutonic", q:"Max dose of Neutonic \u2014 4 pouches a day. Per year?", pre:"$", post:"/yr", ans:394, show:"$394", fact:"<b>4 \u00d7 27\u00a2 \u00d7 365.</b> A fifth of a ZYN customer.", src:"My math \u00b7 neutonic.com" },
    { s:"Ultra", q:"Two Ultra pouches a day. Per year?", pre:"$", post:"/yr", ans:781, show:"$781", fact:"<b>2 \u00d7 $1.07 \u00d7 365.</b> Premium price, still way under ZYN.", src:"My math \u00b7 takeultra.com" },
  ]},
  { id:"money", name:"Where Your $6 Goes", sub:"CPG 101. A $5.95 can at a gas station. Who gets what?", lc:"#00a8e0", lc2:"#008fc0", qs:[
    { s:"Grinds", q:"How much of the $5.95 does the STORE keep?", pre:"$", ans:2.08, show:"~$2.08", fact:"Stores keep about <b>30\u201340%</b> of the shelf price. I used 35%.", src:"Industry rule of thumb \u2014 not Grinds' actual books" },
    { s:"Grinds", q:"Then the DISTRIBUTOR who trucks it there takes a cut. How much?", pre:"$", ans:0.97, show:"~$0.97", fact:"Distributors take roughly <b>15\u201330%</b> of what's left. I used 25%.", src:"Industry rule of thumb" },
    { s:"Grinds", q:"So how much of the $5.95 actually reaches the brand?", pre:"$", ans:2.90, show:"~$2.90", fact:"<b>Less than half.</b> And they still pay to make it, ship it, and run promos out of that.", src:"Industry rule of thumb" },
  ]},
  { id:"margin", name:"Margin Wars", sub:"Gross margin: out of every $1 of sales, how much is left after making the product?", lc:"#e41e2b", lc2:"#c0151f", qs:[
    { s:"Coke", q:"Coca-Cola's gross margin", post:"%", ans:61.6, tol:"pts", fact:"<b>61.6%.</b> Sugar water, the most famous brand on earth.", src:"FY2025 filings" },
    { s:"Monster", q:"Monster's gross margin", post:"%", ans:55.8, tol:"pts", fact:"<b>55.8%.</b> Every energy drink wants to be Monster.", src:"FY2025 filings" },
    { s:"Celsius", q:"Celsius's gross margin", post:"%", ans:50.4, tol:"pts", fact:"<b>50.4%</b> on $2.5B in sales. The 'healthy' energy drink.", src:"Celsius FY2025 results" },
    { s:"PMI", q:"Philip Morris's smoke-free gross margin (ZYN + IQOS)", post:"%", ans:70, tol:"pts", show:"70%+", fact:"<b>Over 70%</b> \u2014 higher than their cigarettes. ZYN is their most profitable US product.", src:"PMI Q1 2025 results coverage" },
  ]},
  { id:"mult", name:"The Multiple", sub:"Venture 101: when someone buys a company, how many years of sales do they pay?", lc:"#5b7cff", lc2:"#4462e6", qs:[
    { s:"Poppi", q:"Pepsi paid $1.95B for Poppi. Poppi sold ~$500M a year. How many times sales?", post:"x", ans:3.9, show:"3.9x", fact:"<b>~4x sales</b> for the soda swap. That's a great outcome in drinks.", src:"Pepsi deal 2025 \u00b7 Poppi 2024 sales" },
    { s:"Neutonic", q:"Neutonic: valued at $60M, expecting ~$25M in sales. Multiple?", post:"x", ans:2.4, show:"2.4x", fact:"<b>~2.4x.</b> Investors are paying for growth that hasn't happened yet.", src:"FoodNavigator \u00b7 Apr 2026" },
    { s:"PMI", q:"Philip Morris paid ~$16B for Swedish Match (ZYN's maker). Its sales were ~$2B. Multiple?", post:"x", ans:8.7, show:"8.7x", fact:"<b>~8.7x sales</b> \u2014 more than double Poppi. <b>Habits get the premium.</b>", src:"SEK 161.2B offer \u00f7 SEK 18.5B 2021 sales" },
  ]},
  { id:"who", name:"Who's Behind It", sub:"Five questions. Five pouches. Lock in a pick.", lc:"#a224e0", lc2:"#8a14c4", qs:[
    { pick:"brands", q:"Which one has Joe Burrow and Dak Prescott as investors?", ans:"Ultra", fact:"<b>Ultra</b> \u2014 $11M Series A, January 2026. Lindsey Vonn's in too." },
    { pick:"brands", q:"Which one was started by a podcaster?", ans:"Neutonic", fact:"<b>Neutonic</b> \u2014 Chris Williamson (Modern Wisdom) + James Smith, 2023." },
    { pick:"brands", q:"Which one got a Shark Tank deal \u2014 that fell apart?", ans:"Grinds", fact:"<b>Grinds</b> \u2014 Daymond + Robert agreed to $75K on air. It died after. Raised ~$80K, ever." },
    { pick:"brands", q:"Which one was founded in Stockholm?", ans:"Nectr", fact:"<b>Nectr</b> \u2014 two brothers from San Diego + a Swede. Sweden is where pouches come from." },
    { pick:"brands", q:"Which one was on Shark Tank this season?", ans:"ZALT", fact:"<b>ZALT</b> \u2014 season 18. Two guys from Florida, still raising their first round." },
  ]},
  { id:"light", name:"Lightning Round", sub:"Higher or lower. Six in a row. Go fast.", lc:"#ffd23f", lc2:"#f0bf10", qs:[
    { s:"Lightning", pick:"hl", q:"Caffeine in Ultra's ENERGY pouch vs. a can of Red Bull (80mg)", ans:"HIGHER", fact:"<b>180mg.</b> More than two Red Bulls in one pouch.", src:"Ultra energy label (as reported)" },
    { s:"Lightning", pick:"hl", q:"ZYN cans sold in ONE DAY vs. every Grinds can ever sold (10M+)", ans:"LOWER", fact:"<b>~2.2M a day.</b> ZYN passes Grinds' all-time total in about 5 days.", src:"794M \u00f7 365" },
    { s:"Lightning", pick:"hl", q:"Neutonic DRINK cans ever sold vs. 3 days of ZYN (~6.5M)", ans:"HIGHER", fact:"<b>7.5M cans.</b> Just barely.", src:"Neutonic, 2026" },
    { s:"Lightning", pick:"hl", q:"Pouches in a ZYN can vs. a Neutonic puck (20)", ans:"LOWER", fact:"<b>15.</b> ZYN gives you less and charges more.", src:"Packaging" },
    { s:"Lightning", pick:"hl", q:"Ultra cans sold in its first 6 months vs. 500,000", ans:"HIGHER", fact:"<b>1 million.</b> Launched May 2025.", src:"Ultra press release" },
    { s:"Lightning", pick:"hl", q:"Neutonic's expected 2026 sales vs. $10M", ans:"HIGHER", fact:"<b>$25M+</b> \u2014 doubled from 2024 to 2025. Valued at $60M.", src:"FoodNavigator \u00b7 Apr 2026" },
  ]},
  { id:"boss", name:"Boss: ZYN", boss:true, sub:"The nicotine pouch they're all chasing. Double points.", lc:"#0b1a2b", lc2:"#12304d", qs:[
    { s:"ZYN", q:"ZYN cans sold in the US in 2025", post:"M cans", ans:794, show:"794M", x:2, fact:"<b>794 million cans.</b> One year. One country.", src:"PMI FY2025 results" },
    { s:"ZYN", q:"What Philip Morris paid for the company that makes ZYN", pre:"$", post:"B", ans:16, show:"$16B", x:2, fact:"About <b>$16 billion</b> for Swedish Match, 2022.", src:"Widely reported" },
    { s:"ZYN", q:"ZYN's share of US pouch sales (by $)", post:"%", ans:66, tol:"pts", show:"~2/3", x:2, fact:"<b>About two-thirds</b> of the category \u2014 at a premium price.", src:"PMI FY2025 results" },
  ]},
];
LEVELS.forEach(L => (L.qs||[]).forEach((q,i) => q.id = `${L.id}${i}`));
const ALLQ = LEVELS.flatMap(L => L.qs||[]);
const MAXPTS = ALLQ.reduce((t,q)=>t+3*(q.x||1),0);
const RANKS = [["Intern",0],["Analyst",.3],["Associate",.5],["VP",.65],["Partner",.8]];

// Reid's guesses from the recorded take \u2014 filled in after recording (q.id -> value), shown to viewers on play.html.
// Reid's recorded answers (takes/final_take.jsonl, 2026-10-29) - 62/153 on camera
const REID = {"thesis0": 50, "thesis1": 7, "thesis2": 20, "rf0": "REAL", "rf1": "FAKE", "rf2": "REAL", "rf3": "REAL", "rf4": "FAKE", "rf5": "REAL", "rf6": "REAL", "caf0": 50, "caf1": 50, "caf2": 50, "caf3": 0, "caf4": 50, "price0": 12, "price1": 75, "price2": 75, "price3": 25, "price4": 30, "price5": 4, "habit0": 20, "habit1": 2000, "habit2": 1500, "money0": 47, "money1": 1.25, "money2": 1.73, "margin0": 70, "margin1": 50, "margin2": 35, "margin3": 45, "mult0": 4, "mult1": 2, "mult2": 8, "who0": "Nectr", "who1": "Neutonic", "who2": "ZALT", "who3": "ZALT", "who4": "Grinds", "light0": "LOWER", "light1": "HIGHER", "light2": "HIGHER", "light3": "HIGHER", "light4": "LOWER", "light5": "HIGHER", "boss0": 700, "boss1": 3.5, "boss2": 40};

// ---- scoring: 3 nailed (within 20% / 5 pts), 2 close (50% / 10 pts), 1 meh (2x / 20 pts), 0 way off.
// pick questions are 3 or 0. boss doubles.
function score(q, g) {
  if (g == null || g === "") return null;
  let p;
  if (q.pick) p = g === q.ans ? 3 : 0;
  else if (q.tol === "pts") { const d = Math.abs(g - q.ans); p = d <= 5 ? 3 : d <= 10 ? 2 : d <= 20 ? 1 : 0; }
  else if (q.ans === 0) p = g <= 5 ? 3 : g <= 20 ? 1 : 0;
  else { const r = Math.abs(g - q.ans) / q.ans; p = r <= .2 ? 3 : r <= .5 ? 2 : r <= 1 ? 1 : 0; }
  return p * (q.x || 1);
}
const VERDICT = ["Way off","Meh","Close","Nailed it"], VCOL = ["#ff4a3a","#ffb020","#9be86b","#2fe07a"];
function fmtVal(q, v) {
  if (q.pick) { const o = OPTS[q.pick].find(o=>o.id===v); return o ? o.label.replace(/^[\u25b2\u25bc] /,"") : v; }
  if (q.cents) return v >= 100 ? `$${(v/100).toFixed(2)}` : `${Math.round(v)}\u00a2`;
  if (q.pre === "$" && !q.post) return `$${(+v).toFixed(2)}`;
  const d = Number.isInteger(q.ans) ? (v < 10 && v % 1 ? 1 : 0) : 1;
  return `${q.pre||""}${(+v).toLocaleString("en-US",{maximumFractionDigits:d})}${q.post||""}`;
}
const rankOf = pts => RANKS.filter(([,t]) => pts/MAXPTS >= t).pop()[0];
const levelMax = L => (L.qs||[]).reduce((t,q)=>t+3*(q.x||1),0);
