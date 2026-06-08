/* ====================================================================== */
/*  DATA — structural / layout                                             */
/*                                                                         */
/*  This file owns the SHAPE of the map: which metabolites exist, where    */
/*  they sit, which reactions connect them, what watermarks and info       */
/*  panels appear, and the pathway color/name registry.                    */
/*                                                                         */
/*  Edit this file to:                                                     */
/*    • move a node (change x/y, or cx/cy/hexR for shape:'hexagon')        */
/*    • add a new metabolite or reaction                                   */
/*    • mark a reaction as low-yield (hides label in Essential mode)       */
/*    • mark a reaction as rate-limiting (rl:true — gold glow)             */
/*    • tag a reaction with its vitamin cofactors (vits:['B1', ...])       */
/* ====================================================================== */

const PATHWAYS = {
  glyco:'#60a5fa', gng:'#c084fc', tca:'#fb923c', etc:'#ef4444',
  ppp:'#34d399', glyg:'#2dd4bf', fas:'#fbbf24', box:'#e89730',
  keto:'#b8a4f5', chol:'#f48bc1', urea:'#f87171', aa:'#b8c5d8', heme:'#fb7185'
};

const PATHWAY_NAMES = {
  glyco:'Glycolysis', gng:'Gluconeogenesis', tca:'TCA Cycle', etc:'ETC / Ox-Phos',
  ppp:'PPP (HMP shunt)', glyg:'Glycogen', fas:'Fatty Acid Synthesis', box:'β-oxidation',
  keto:'Ketogenesis', chol:'Cholesterol', urea:'Urea Cycle', aa:'AA link', heme:'Heme'
};

const NODES = [
  // GLUCOSE — start, big hexagon
  { id:'glucose', label:'GLUCOSE', sub:'C₆H₁₂O₆', shape:'hexagon', cx:2000, cy:215, hexR:75, p:'glyco', start:true,
    x:1925, y:140, w:150, h:150 },

  // GLYCOLYSIS
  { id:'g6p', label:'G6P', sub:'Glucose-6-P  •  HUB', x:1920, y:355, w:160, h:46, p:'glyco', hub:true },
  { id:'f6p', label:'F6P', sub:'Fructose-6-P', x:1935, y:500, w:130, h:46, p:'glyco' },
  { id:'f16bp', label:'F-1,6-BP', sub:'Fructose-1,6-bisP', x:1910, y:650, w:180, h:46, p:'glyco' },
  { id:'f26bp', label:'F-2,6-BP', sub:'glycolysis ⇄ gluconeogenesis switch', x:1540, y:500, w:230, h:46, p:'glyco' },
  { id:'dhap', label:'DHAP', sub:'↔ glycerol-3-P', x:1790, y:795, w:120, h:46, p:'glyco' },
  { id:'glycerol', label:'Glycerol', sub:'triglyceride backbone', x:1480, y:795, w:180, h:46, p:'gng' },
  { id:'g3p', label:'G3P', sub:'Glyceraldehyde-3-P', x:2090, y:795, w:120, h:46, p:'glyco' },
  { id:'13bpg', label:'1,3-BPG', sub:'→ 2,3-BPG (RBC)', x:2060, y:945, w:180, h:46, p:'glyco' },
  { id:'3pg', label:'3-PG', sub:'3-Phosphoglycerate', x:2090, y:1095, w:120, h:46, p:'glyco' },
  { id:'2pg', label:'2-PG', sub:'2-Phosphoglycerate', x:2090, y:1245, w:120, h:46, p:'glyco' },
  { id:'pep', label:'PEP', sub:'Phosphoenolpyruvate', x:2090, y:1395, w:120, h:46, p:'glyco' },
  { id:'pyruvate', label:'Pyruvate', sub:'3C  •  HUB', x:1920, y:1547, w:160, h:46, p:'glyco', hub:true },
  { id:'lactate', label:'Lactate', sub:'→ liver (Cori)', x:1500, y:1547, w:160, h:46, p:'aa' },
  { id:'alanine', label:'Alanine', sub:'Cahill cycle', x:1180, y:1697, w:160, h:46, p:'aa' },
  { id:'acetylcoa', label:'Acetyl-CoA', sub:'2C  •  central HUB (mitochondrial)', x:1900, y:1745, w:200, h:50, p:'glyco', hub:true, same:'acetylcoa' },

  // TCA
  { id:'citrate', label:'Citrate', sub:'6C', x:2000, y:2025, w:160, h:46, p:'tca' },
  { id:'isocitrate', label:'Isocitrate', sub:'6C', x:1800, y:2215, w:160, h:46, p:'tca' },
  { id:'akg', label:'α-KG', sub:'5C  •  HUB', x:1980, y:2415, w:160, h:46, p:'tca', hub:true },
  { id:'glutamate', label:'Glutamate', sub:'↔ Gln / NH₃', x:1580, y:2477, w:170, h:46, p:'aa' },
  { id:'succoa', label:'Succinyl-CoA', sub:'→ heme synth', x:2280, y:2555, w:180, h:46, p:'tca', same:'succoa' },
  { id:'succinate', label:'Succinate', sub:'4C', x:2620, y:2439, w:150, h:46, p:'tca' },
  { id:'fumarate', label:'Fumarate', sub:'← urea cycle', x:2730, y:2249, w:160, h:46, p:'tca' },
  { id:'malate', label:'Malate', sub:'malate shuttle', x:2620, y:2069, w:150, h:46, p:'tca' },
  { id:'oaa', label:'OAA', sub:'Oxaloacetate  •  HUB', x:2270, y:1915, w:170, h:50, p:'tca', hub:true },
  { id:'aspartate', label:'Aspartate', sub:'→ urea / pyrimidines', x:2660, y:1857, w:170, h:46, p:'aa' },

  // PPP — vertical chain far right of glycolysis
  { id:'6pg', label:'6-PG', sub:'6-Phosphogluconate', x:2720, y:485, w:180, h:46, p:'ppp' },
  { id:'rib5p', label:'Ribulose-5-P', sub:'→ Ribose-5-P', x:2720, y:605, w:180, h:46, p:'ppp' },
  { id:'r5p', label:'Ribose-5-P', sub:'nucleotide synth', x:2720, y:725, w:180, h:46, p:'ppp' },

  // Glycogen — above PPP, well to the right of glucose hexagon
  { id:'glycogen', label:'Glycogen', sub:'(α-1,4 + α-1,6)', x:2700, y:190, w:220, h:50, p:'glyg' },
  { id:'g1p', label:'G1P', sub:'Glucose-1-P', x:2735, y:340, w:150, h:46, p:'glyg' },

  // FA synth
  { id:'acetylcoa_c', label:'Acetyl-CoA', sub:'(cytosol) → FA / chol', x:2700, y:1748, w:200, h:46, p:'fas', same:'acetylcoa' },
  { id:'maloncoa', label:'Malonyl-CoA', sub:'blocks CPT-1', x:3060, y:1748, w:180, h:46, p:'fas' },
  { id:'palmitate', label:'Palmitate', sub:'C16 saturated FA', x:3380, y:1748, w:180, h:46, p:'fas' },

  // β-ox  (positioned so CPT-1 crosses the mito membrane at y≈1860:
  //        fatty acid + cytosolic acyl-CoA ABOVE it, matrix acyl-CoA BELOW)
  { id:'fa', label:'Fatty acid', sub:'(cytosol)', x:3640, y:1654, w:160, h:46, p:'box' },
  { id:'acylcoa_c', label:'Acyl-CoA', sub:'(cytosol)', x:3640, y:1774, w:160, h:46, p:'box', same:'acylcoa' },
  { id:'acylcoa_m', label:'Acyl-CoA', sub:'(mitochondrial matrix)', x:3640, y:1900, w:160, h:46, p:'box', same:'acylcoa' },
  { id:'boxloop', label:'β-ox spiral', sub:'−2C per round', x:3640, y:2030, w:160, h:46, p:'box' },

  // Ketogenesis
  { id:'hmgcoa_m', label:'HMG-CoA', sub:'(mitochondrial) → ketones', x:2900, y:2415, w:200, h:46, p:'keto', same:'hmgcoa' },
  { id:'aca', label:'Acetoacetate', sub:'ketone body', x:2900, y:2535, w:200, h:46, p:'keto' },
  { id:'bhb', label:'β-Hydroxybutyrate', sub:'major DKA ketone', x:2880, y:2655, w:240, h:46, p:'keto' },

  // Cholesterol
  { id:'hmgcoa_c', label:'HMG-CoA', sub:'(cytosol) → cholesterol', x:3350, y:2415, w:200, h:46, p:'chol', same:'hmgcoa' },
  { id:'mevalonate', label:'Mevalonate', sub:'→ isoprenoids', x:3350, y:2535, w:200, h:46, p:'chol' },
  { id:'cholesterol', label:'Cholesterol', sub:'→ steroids / bile / vit D', x:3350, y:2655, w:200, h:46, p:'chol' },

  // Urea  (moved down + left, into the void above FA synthesis, closer to
  //        its aspartate / fumarate cross-links)
  { id:'nh3', label:'NH₃ + CO₂ + 2 ATP', sub:'mitochondrial input', x:3200, y:915, w:240, h:46, p:'urea' },
  { id:'carbamoylp', label:'Carbamoyl-P', sub:'+ ornithine', x:3220, y:1055, w:200, h:46, p:'urea' },
  { id:'citrulline', label:'Citrulline', sub:'⮕ doorway: exits mito', x:3220, y:1180, w:200, h:46, p:'urea' },
  { id:'argsucc', label:'Argininosuccinate', sub:'cytosolic', x:3190, y:1300, w:260, h:46, p:'urea' },
  { id:'arginine', label:'Arginine', sub:'', x:3230, y:1420, w:180, h:46, p:'urea' },
  { id:'urea_out', label:'Urea + Ornithine', sub:'urea → kidney', x:3230, y:1535, w:180, h:46, p:'urea' },

  // Heme branch
  { id:'heme', label:'δ-ALA → Heme', sub:'glycine + succinyl-CoA + B6', x:1900, y:2635, w:220, h:46, p:'heme' },

  // ONE-CARBON, arm 1 — PROPIONATE (odd-chain FA + V/I/M/T → succinyl-CoA).
  // Placed directly UNDER β-oxidation (its source) so the flow is local.
  { id:'propionylcoa', label:'Propionyl-CoA', sub:'3C · odd-chain FA + V/I/M/T', x:3600, y:2160, w:200, h:46, p:'aa' },
  { id:'mmcoa', label:'Methylmalonyl-CoA', sub:'', x:3590, y:2290, w:220, h:46, p:'aa' },
  { id:'succ_b12', label:'Succinyl-CoA', sub:'re-enters TCA → glucose', x:3600, y:2410, w:200, h:46, p:'aa', same:'succoa' },

  // ONE-CARBON, arm 2 — METHYLATION (homocysteine / methionine / folate).
  // Amino-acid / methylation / anemia content → left side.
  { id:'homocysteine', label:'Homocysteine', sub:'↑ = clot / MI risk', x:340, y:1200, w:190, h:46, p:'aa' },
  { id:'methionine', label:'Methionine', sub:'→ SAM (methyl donor)', x:720, y:1200, w:180, h:46, p:'aa' },
  { id:'cystathionine', label:'Cystathionine → Cys', sub:'', x:340, y:1345, w:240, h:46, p:'aa' },

  // ETC
  { id:'c1', label:'Complex I', sub:'NADH → Q', x:1300, y:2800, w:200, h:60, p:'etc' },
  { id:'c2', label:'Complex II  ★', sub:'FADH₂ → Q  (= SDH)', x:1900, y:2800, w:220, h:60, p:'etc' },
  { id:'c3', label:'Complex III', sub:'Q → Cyt c', x:2540, y:2800, w:200, h:60, p:'etc' },
  { id:'c4', label:'Complex IV  ★', sub:'Cyt c → O₂', x:2820, y:2800, w:220, h:60, p:'etc' },
  { id:'c5', label:'Complex V (ATP synth)  ★', sub:'H⁺ → ATP', x:3160, y:2800, w:280, h:60, p:'etc' },
];

const NODE_INDEX = Object.fromEntries(NODES.map(n => [n.id, n]));

// HY policy:
//   - lowYield: true  → enzyme info hidden in Essential mode
//   - rl: true        → always shown, gold + glow
//   - default         → shown in both modes (HY enzymes the user should know)
const EDGES = [
  // GLYCOLYSIS
  { from:'glucose', to:'g6p', p:'glyco',
    path:'M 2000 290 L 2000 355',
    enzyme:'Hexokinase / Glucokinase', cof:'ATP → ADP', enzClass:'kin',
    notes:[{c:'reg',t:'Hexokinase: ALL tissues · low Km · inhibited by G6P'},
           {c:'reg',t:'Glucokinase: LIVER + β-cells · high Km · insulin-induced'}],
    labelX:2010, labelY:300, anchor:'start' },
  { from:'g6p', to:'f6p', p:'glyco', lowYield:true,
    enzyme:'Phosphoglucose isomerase',
    labelX:2010, labelY:440, anchor:'start' },
  { from:'f6p', to:'f16bp', p:'glyco', thick:true, rl:true,
    enzyme:'★ PFK-1   (rate-limiting)', cof:'ATP → ADP', enzClass:'kin',
    notes:[{c:'reg',t:'+ AMP, @x:f26bp[F-2,6-BP] (insulin); − ATP, citrate'}],
    labelX:2010, labelY:583, anchor:'start' },
  // F-2,6-BP regulatory branch off F6P (PFK-2 makes it, FBPase-2 removes it)
  { from:'f6p', to:'f26bp', p:'glyco', dashed:true, reversible:true,
    path:'M 1935 523 L 1770 523',
    enzyme:'PFK-2 ⇄ FBPase-2', cof:'insulin ↑ / glucagon ↓',
    labelX:1852, labelY:498, anchor:'middle' },
  { from:'f16bp', to:'dhap', p:'glyco', lowYield:true,
    path:'M 1980 696 L 1880 795',
    enzyme:'Aldolase A',
    labelX:1860, labelY:725, anchor:'end' },
  { from:'f16bp', to:'g3p', p:'glyco', lowYield:true,
    path:'M 2020 696 L 2120 795' },
  { from:'dhap', to:'g3p', p:'glyco', lowYield:true, dashed:true, reversible:true,
    path:'M 1910 818 L 2090 818',
    enzyme:'Triose-P isomerase',
    labelX:2000, labelY:812, anchor:'middle' },
  // Glycerol — the ONLY part of fat that can make glucose. From the
  // triglyceride backbone → glycerol-3-P → DHAP → gluconeogenesis.
  { from:'glycerol', to:'dhap', p:'gng', dashed:true,
    path:'M 1660 818 L 1790 818',
    enzyme:'Glycerol kinase (liver)', cof:'→ glycerol-3-P → DHAP',
    notes:[{c:'note',t:'fat\'s only route to glucose'}],
    labelX:1655, labelY:858, anchor:'end' },
  { from:'g3p', to:'13bpg', p:'glyco',
    path:'M 2150 841 L 2150 945',
    enzyme:'G3P dehydrogenase', cof:'NAD⁺ + Pi → NADH', vits:['B3'], enzClass:'dh',
    notes:[{c:'note',t:'⚠ arsenic blocks this step'}],
    labelX:2160, labelY:873, anchor:'start' },
  { from:'13bpg', to:'3pg', p:'glyco', lowYield:true,
    path:'M 2150 991 L 2150 1095',
    enzyme:'Phosphoglycerate kinase', cof:'ADP → ATP (substrate-level)',
    labelX:2160, labelY:1023, anchor:'start' },
  { from:'3pg', to:'2pg', p:'glyco', lowYield:true,
    path:'M 2150 1141 L 2150 1245',
    enzyme:'Phosphoglycerate mutase',
    labelX:2160, labelY:1188, anchor:'start' },
  { from:'2pg', to:'pep', p:'glyco', lowYield:true,
    path:'M 2150 1291 L 2150 1395',
    enzyme:'Enolase', cof:'– H₂O  (fluoride blocks)',
    labelX:2160, labelY:1333, anchor:'start' },
  { from:'pep', to:'pyruvate', p:'glyco', thick:true, rl:true, id:'e_pk',
    path:'M 2120 1441 L 2020 1547',
    enzyme:'Pyruvate kinase ★', cof:'ADP → ATP', enzClass:'kin',
    notes:[{c:'note',t:'@pkdef[PK deficiency] → hemolytic anemia'}],
    labelX:1970, labelY:1478, anchor:'end' },

  // GLUCONEOGENESIS BYPASS — all HY
  { from:'pyruvate', to:'oaa', p:'gng', thick:true, rl:true,
    path:'M 2070 1569 Q 2250 1715 2350 1915',
    enzyme:'Pyruvate carboxylase ★', cof:'ATP + CO₂; biotin (B7)',
    vits:['B7'], enzClass:'carb',
    notes:[{c:'reg',t:'+ Acetyl-CoA (mitochondrial)'}],
    labelX:2280, labelY:1700, anchor:'start' },
  { from:'oaa', to:'pep', p:'gng', thick:true,
    path:'M 2300 1915 Q 2150 1635 2150 1441',
    enzyme:'PEPCK', cof:'GTP → GDP + CO₂',
    labelX:2230, labelY:1480, anchor:'start' },
  { from:'f16bp', to:'f6p', p:'gng', thick:true, rl:true,
    path:'M 1910 673 Q 1780 608 1910 546',
    enzyme:'F-1,6-BPase ★', enzClass:'phos',
    notes:[{c:'reg',t:'− @x:f26bp[F-2,6-BP], AMP'}],
    labelX:1740, labelY:613, anchor:'end' },
  { from:'g6p', to:'glucose', p:'gng', thick:true, id:'e_g6pase',
    path:'M 1920 378 Q 1780 320 1942 240',
    enzyme:'G6Pase', enzClass:'phos', cof:'Liver + kidney only',
    notes:[{c:'note',t:'Deficiency → @vongierke[Von Gierke (GSD I)]'}],
    labelX:1850, labelY:294, anchor:'end' },

  // PYRUVATE BRANCHES
  { from:'pyruvate', to:'lactate', p:'aa', dashed:true, reversible:true,
    path:'M 1920 1570 L 1660 1570',
    enzyme:'LDH', cof:'NADH → NAD⁺', vits:['B3'], enzClass:'dh',
    labelX:1790, labelY:1559, anchor:'middle' },
  { from:'pyruvate', to:'alanine', p:'aa', dashed:true, reversible:true,
    path:'M 1920 1578 L 1340 1713',
    enzyme:'ALT (B6/PLP)', cof:'α-KG ↔ Glutamate', vits:['B6'], enzClass:'tram',
    notes:[{c:'note',t:'Cahill cycle'}],
    labelX:1620, labelY:1655, anchor:'middle' },
  { from:'pyruvate', to:'acetylcoa', p:'glyco', thick:true, rl:true, id:'e_pdh',
    path:'M 2000 1593 L 2000 1745',
    enzyme:'PDH (irreversible)', cof:'NAD⁺ → NADH + CO₂',
    vits:['B1','B2','B3','B5','lipoic'], enzClass:'dh',
    notes:[
      {c:'cof',t:'B1, B2, B3, B5, lipoic acid'},
      {c:'note',t:'@pdhdef[PDH deficiency] → lactic acidosis'}
    ],
    labelX:2010, labelY:1626, anchor:'start' },

  // ACETYL-CoA / TCA ENTRY
  { from:'acetylcoa', to:'citrate', p:'tca', thick:true, rl:true,
    path:'M 2050 1795 Q 2120 1913 2080 2025',
    enzyme:'Citrate synthase ★', cof:'+ OAA → Citrate',
    labelX:2150, labelY:1893, anchor:'start' },
  { from:'oaa', to:'citrate', p:'tca', lowYield:true,
    path:'M 2280 1960 Q 2200 1995 2155 2025',
    enzyme:'(+ Acetyl-CoA)',
    labelX:2180, labelY:1985, anchor:'start' },

  // TCA
  { from:'citrate', to:'isocitrate', p:'tca', lowYield:true,
    path:'M 2030 2071 L 1960 2215',
    enzyme:'Aconitase',
    labelX:1900, labelY:2123, anchor:'end' },
  { from:'isocitrate', to:'akg', p:'tca', thick:true, rl:true,
    path:'M 1900 2261 L 2030 2415',
    enzyme:'Isocitrate DH ★', cof:'NAD⁺ → NADH + CO₂', vits:['B3'], enzClass:'dh',
    labelX:1830, labelY:2345, anchor:'end' },
  { from:'akg', to:'glutamate', p:'aa', dashed:true, reversible:true,
    path:'M 1980 2438 L 1750 2495',
    enzyme:'transamination (B6)', cof:'all NH₂ groups funnel here', vits:['B6'], enzClass:'tram',
    labelX:1850, labelY:2453, anchor:'middle' },
  { from:'akg', to:'succoa', p:'tca', thick:true,
    path:'M 2080 2461 L 2280 2555',
    enzyme:'α-KG dehydrogenase', cof:'NAD⁺ → NADH + CO₂',
    vits:['B1','B2','B3','B5','lipoic'], enzClass:'dh',
    notes:[{c:'cof',t:'same 5 cofactors as PDH'}],
    labelX:2110, labelY:2525, anchor:'start' },
  { from:'succoa', to:'heme', p:'heme', dashed:true,
    path:'M 2280 2578 L 2080 2635',
    enzyme:'ALA synthase (B6)', vits:['B6'],
    notes:[{c:'note',t:'@aip[AIP] / @pct[PCT] / @leadpoisoning[lead]'}],
    labelX:2160, labelY:2615, anchor:'middle' },

  // ---- ONE-CARBON, arm 1 — PROPIONATE (directly under β-oxidation) ----
  // β-ox spiral hands its odd-chain 3C product straight to propionyl-CoA.
  { from:'boxloop', to:'propionylcoa', p:'box', dashed:true,
    path:'M 3720 2076 L 3700 2160',
    enzyme:'odd-chain FA + V/I/M/T',
    labelX:3815, labelY:2120, anchor:'start' },
  { from:'propionylcoa', to:'mmcoa', p:'box', id:'e_pcc',
    path:'M 3700 2206 L 3700 2290',
    enzyme:'Propionyl-CoA carboxylase', cof:'biotin (B7) + CO₂', vits:['B7'], enzClass:'carb',
    notes:[{c:'note',t:'block → @propionicacidemia[propionic acidemia]'}],
    labelX:3820, labelY:2238, anchor:'start' },
  { from:'mmcoa', to:'succ_b12', p:'tca', id:'e_mut',
    path:'M 3700 2336 L 3700 2410',
    enzyme:'Methylmalonyl-CoA mutase ★', cof:'needs B12', vits:['B12'],
    notes:[{c:'note',t:'B12↓ → ↑@mma[MMA] · → @x:succoa[TCA]'}],
    labelX:3820, labelY:2360, anchor:'start' },

  // ---- ONE-CARBON, arm 2 — METHYLATION (left amino-acid cluster) ----
  { from:'homocysteine', to:'methionine', p:'aa',
    path:'M 530 1223 L 720 1223',
    enzyme:'Methionine synthase', cof:'B12 + N⁵-methyl-THF (folate)', vits:['B12','B9'],
    notes:[{c:'note',t:'B12 ↓ traps folate ("folate trap")'}],
    labelX:625, labelY:1196, anchor:'middle' },
  { from:'homocysteine', to:'cystathionine', p:'aa', id:'e_cbs',
    path:'M 435 1246 L 435 1345',
    enzyme:'Cystathionine synthase', cof:'B6 (PLP)', vits:['B6'],
    notes:[{c:'note',t:'deficiency → @homocystinuria[homocystinuria]'}],
    labelX:455, labelY:1300, anchor:'start' },
  { from:'succoa', to:'succinate', p:'tca', lowYield:true,
    path:'M 2460 2560 L 2620 2485',
    enzyme:'Succinyl-CoA synthetase', cof:'GDP → GTP',
    labelX:2540, labelY:2547, anchor:'middle' },
  { from:'succinate', to:'fumarate', p:'tca',
    path:'M 2720 2439 L 2810 2295',
    enzyme:'Succinate DH (= Complex II)', cof:'FAD → FADH₂', vits:['B2'], enzClass:'dh',
    labelX:2810, labelY:2310, anchor:'start' },
  { from:'fumarate', to:'malate', p:'tca', lowYield:true,
    path:'M 2810 2249 L 2730 2115',
    enzyme:'Fumarase', cof:'+ H₂O',
    labelX:2810, labelY:2185, anchor:'start' },
  { from:'malate', to:'oaa', p:'tca', lowYield:true,
    path:'M 2620 2069 L 2460 1965',
    enzyme:'Malate DH', cof:'NAD⁺ → NADH', vits:['B3'], enzClass:'dh',
    labelX:2580, labelY:2005, anchor:'middle' },
  { from:'oaa', to:'aspartate', p:'aa', dashed:true, reversible:true,
    path:'M 2440 1930 L 2660 1875',
    enzyme:'AST (B6/PLP)', vits:['B6'], enzClass:'tram',
    labelX:2545, labelY:1877, anchor:'middle' },

  // PPP — vertical column far right of glycolysis
  { from:'g6p', to:'6pg', p:'ppp', thick:true, rl:true, id:'e_g6pdh',
    path:'M 2080 401 Q 2400 401 2720 485',
    enzyme:'G6PDH ★ (rate-limiting)', cof:'2 NADP⁺ → 2 NADPH + CO₂', vits:['B3'], enzClass:'dh',
    notes:[{c:'note',t:'@g6pdh[G6PDH deficiency] → hemolytic anemia'}],
    labelX:2400, labelY:430, anchor:'middle' },
  { from:'6pg', to:'rib5p', p:'ppp', lowYield:true,
    path:'M 2810 531 L 2810 605',
    cof:'→ Ribulose-5-P',
    labelX:2820, labelY:560, anchor:'start' },
  { from:'rib5p', to:'r5p', p:'ppp',
    path:'M 2810 651 L 2810 725',
    enzyme:'Transketolase (B1)', vits:['B1'],
    labelX:2820, labelY:680, anchor:'start' },
  { from:'r5p', to:'f6p', p:'ppp', dashed:true,
    path:'M 2720 748 Q 2400 900 2065 540',
    enzyme:'(non-ox phase → F6P, G3P)',
    labelX:2400, labelY:910, anchor:'middle' },

  // Glycogen — vertical pair, above PPP column
  // LEFT arrow pointing DOWN = breakdown (glycogen → G1P)
  { from:'glycogen', to:'g1p', p:'glyg', thick:true, rl:true, id:'e_glyphos',
    path:'M 2775 240 L 2775 340',
    enzyme:'Glycogen phosphorylase ★', cof:'+ Pi → G1P; B6', vits:['B6'],
    notes:[{c:'note',t:'breakdown ↓ (glucagon / epi)'}],
    labelX:2688, labelY:280, anchor:'end' },
  // RIGHT arrow pointing UP = synthesis (G1P → glycogen)
  { from:'g1p', to:'glycogen', p:'glyg', rl:true,
    path:'M 2845 340 L 2845 240',
    enzyme:'Glycogen synthase ★', cof:'UDP-glucose',
    notes:[{c:'note',t:'synthesis ↑ (insulin)'}],
    labelX:2932, labelY:280, anchor:'start' },
  { from:'g1p', to:'g6p', p:'glyg', lowYield:true, dashed:true, reversible:true,
    path:'M 2735 363 L 2080 378',
    enzyme:'Phosphoglucomutase',
    labelX:2407, labelY:355, anchor:'middle' },

  // FA synth
  { from:'citrate', to:'acetylcoa_c', p:'fas', dashed:true,
    path:'M 2160 2025 Q 2500 1865 2700 1768',
    enzyme:'Citrate shuttle', cof:'mitochondria → cytosol',
    labelX:2540, labelY:1921, anchor:'middle' },
  { from:'acetylcoa_c', to:'maloncoa', p:'fas', thick:true, rl:true,
    path:'M 2900 1771 L 3060 1771',
    enzyme:'ACC ★', cof:'ATP + CO₂; biotin', vits:['B7'], enzClass:'carb',
    labelX:2980, labelY:1743, anchor:'middle' },
  { from:'maloncoa', to:'palmitate', p:'fas', thick:true,
    path:'M 3240 1771 L 3380 1771',
    enzyme:'Fatty Acid Synthase', cof:'NADPH × 14', vits:['B3','B5'],
    labelX:3310, labelY:1743, anchor:'middle' },

  // β-ox
  { from:'fa', to:'acylcoa_c', p:'box', lowYield:true,
    path:'M 3720 1700 L 3720 1774',
    enzyme:'Acyl-CoA synthetase', cof:'ATP → AMP + PPi',
    labelX:3730, labelY:1730, anchor:'start' },
  // CPT-1 — straddles the mito membrane (y≈1860): the carnitine shuttle IN
  { from:'acylcoa_c', to:'acylcoa_m', p:'box', thick:true, rl:true, id:'cpt1',
    path:'M 3720 1820 L 3720 1900',
    enzyme:'CPT-1 ★ (carnitine shuttle)', cof:'blocked by @x:maloncoa[malonyl-CoA]',
    notes:[{c:'note',t:'gate for FAs to cross membrane → β-ox'},
           {c:'note',t:'@carnitinedef[Carnitine deficiency] → hypoketotic hypoglyc'}],
    labelX:3815, labelY:1812, anchor:'start' },
  { from:'acylcoa_m', to:'boxloop', p:'box', id:'e_box',
    path:'M 3720 1946 L 3720 2030',
    enzyme:'β-oxidation spiral', cof:'→ Acetyl-CoA + NADH + FADH₂', vits:['B2','B3','B5'],
    notes:[{c:'note',t:'@mcad[MCAD deficiency] → SIDS risk'},
           {c:'note',t:'odd-chain → propionyl-CoA ↓ (see below)'}],
    labelX:3730, labelY:1962, anchor:'start' },
  { from:'boxloop', to:'acetylcoa', p:'box', dashed:true,
    path:'M 3640 2053 Q 2850 1980 2100 1782',
    enzyme:'→ Acetyl-CoA (feeds TCA)',
    labelX:3000, labelY:1990, anchor:'middle' },

  // Ketogenesis
  { from:'acetylcoa', to:'hmgcoa_m', p:'keto', thick:true, rl:true,
    path:'M 2100 1770 Q 2700 2065 3000 2415',
    enzyme:'HMG-CoA synthase ★ (mitochondrial)', cof:'2 Acetyl-CoA',
    notes:[{c:'note',t:'Floods in @dka[DKA]'}],
    labelX:2700, labelY:2023, anchor:'middle' },
  // Identity link (NOT a reaction): mito HMG-CoA and cytosolic HMG-CoA are the
  // SAME molecule — the compartment is what decides ketones vs cholesterol.
  { from:'hmgcoa_m', to:'hmgcoa_c', p:'keto', dashed:true, noArrow:true,
    path:'M 3100 2450 L 3350 2450',
    enzyme:'≡ same molecule',
    notes:[{c:'cof',t:'compartment decides fate'}],
    labelX:3225, labelY:2438, anchor:'middle' },
  { from:'hmgcoa_m', to:'aca', p:'keto',
    path:'M 3000 2461 L 3000 2535',
    enzyme:'HMG-CoA lyase', cof:'→ Acetoacetate',
    labelX:3010, labelY:2491, anchor:'start' },
  { from:'aca', to:'bhb', p:'keto', lowYield:true,
    path:'M 3000 2581 L 3000 2655',
    enzyme:'β-OH-butyrate DH', cof:'NADH → NAD⁺', vits:['B3'],
    labelX:3010, labelY:2611, anchor:'start' },

  // Cholesterol
  { from:'acetylcoa_c', to:'hmgcoa_c', p:'chol', thick:true,
    path:'M 2900 1771 Q 3300 2065 3450 2415',
    enzyme:'HMG-CoA synthase (cytosolic)', cof:'2 Acetyl-CoA',
    labelX:3300, labelY:1985, anchor:'middle' },
  { from:'hmgcoa_c', to:'mevalonate', p:'chol', thick:true, rl:true,
    path:'M 3450 2461 L 3450 2535',
    enzyme:'HMG-CoA reductase ★', cof:'2 NADPH', vits:['B3'], enzClass:'red',
    notes:[
      {c:'note',t:'⚠ STATINS inhibit'},
      {c:'note',t:'LDLR defect → @fh[Familial hypercholesterolemia]'}
    ],
    labelX:3460, labelY:2491, anchor:'start' },
  { from:'mevalonate', to:'cholesterol', p:'chol', lowYield:true,
    path:'M 3450 2581 L 3450 2655',
    cof:'many steps',
    labelX:3460, labelY:2618, anchor:'start' },

  // Urea
  { from:'nh3', to:'carbamoylp', p:'urea', thick:true, rl:true, id:'e_cps1',
    path:'M 3320 961 L 3320 1055',
    enzyme:'CPS-I ★', cof:'requires N-acetylglutamate (NAG)',
    notes:[{c:'note',t:'Defect → @cpsi[CPS-I deficiency] (no orotic acid)'},
           {c:'note',t:'2° stall: @propionicacidemia[propionic acidemia]/@mma[MMA] ↓ NAG'}],
    labelX:3460, labelY:990, anchor:'start' },
  { from:'carbamoylp', to:'citrulline', p:'urea', id:'e_otc',
    path:'M 3320 1101 L 3320 1180',
    enzyme:'OTC', cof:'+ Ornithine',
    notes:[{c:'note',t:'Defect → @otc[OTC deficiency] (↑ orotic acid)'}],
    labelX:3460, labelY:1130, anchor:'start' },
  { from:'citrulline', to:'argsucc', p:'urea',
    path:'M 3320 1226 L 3320 1300',
    enzyme:'Argininosucc. synthetase', cof:'+ Aspartate, ATP',
    labelX:3460, labelY:1255, anchor:'start' },
  { from:'argsucc', to:'arginine', p:'urea',
    path:'M 3320 1346 L 3320 1420',
    enzyme:'Argininosucc. lyase', cof:'→ Arginine + Fumarate',
    labelX:3460, labelY:1375, anchor:'start' },
  { from:'arginine', to:'urea_out', p:'urea',
    path:'M 3320 1466 L 3320 1535',
    enzyme:'Arginase', cof:'→ Urea + Ornithine',
    labelX:3460, labelY:1495, anchor:'start' },
  // Aspartate donates the 2nd N (argininosuccinate synthetase step) —
  // arrow lands on the LEFT edge of argininosuccinate, label beside it.
  { from:'aspartate', to:'argsucc', p:'aa', dashed:true,
    path:'M 2855 1857 Q 3120 1540 3190 1318',
    enzyme:'Aspartate → 2nd N of urea',
    labelX:3175, labelY:1314, anchor:'end' },
  // Fumarate is the byproduct (argininosuccinate lyase step) that re-enters
  // the TCA cycle — arrow leaves argininosuccinate bottom, lands on fumarate.
  { from:'argsucc', to:'fumarate', p:'tca', dashed:true,
    path:'M 3200 1346 Q 2980 1860 2880 2249',
    enzyme:'Fumarate → re-enters TCA',
    labelX:3175, labelY:1360, anchor:'end' },

  // ETC
  { from:'c1', to:'c3', p:'etc', path:'M 1500 2830 L 2540 2830' },
  { from:'c2', to:'c3', p:'etc', path:'M 2120 2830 L 2540 2830' },
  { from:'c3', to:'c4', p:'etc', path:'M 2740 2830 L 2820 2830' },
  { from:'c4', to:'c5', p:'etc', path:'M 3040 2830 L 3160 2830' },
  { from:'akg', to:'c1', p:'etc', dashed:true,
    path:'M 2060 2485 Q 1700 2695 1400 2800',
    cof:'NADH → 2.5 ATP',
    labelX:1700, labelY:2715, anchor:'middle' },
  { from:'fumarate', to:'c2', p:'etc', dashed:true,
    path:'M 2720 2485 Q 2200 2695 2010 2800',
    cof:'FADH₂ → 1.5 ATP',
    labelX:2300, labelY:2695, anchor:'middle' },
];

// Pathway watermarks now replaced by translucent pathway BOXES (rendered in app.js).
// Only the TITLE watermark is rendered separately.
const WATERMARKS = [];

// Pathways that get a translucent grouping box around their nodes.
// Each entry: pathway key → label shown in the box top-left corner.
// Skipped: 'gng' (overlaps glyco), 'aa' (connective), 'heme' (single branch node).
const PATHWAY_BOXES = {
  glyco: 'GLYCOLYSIS  ↓  GLUCONEOGENESIS  ↑',
  tca:   'TCA CYCLE',
  etc:   'ELECTRON TRANSPORT CHAIN',
  ppp:   'PPP  (HMP shunt)',
  glyg:  'GLYCOGEN',
  fas:   'FATTY ACID SYNTHESIS',
  box:   'β-OXIDATION',
  keto:  'KETOGENESIS',
  chol:  'CHOLESTEROL SYNTHESIS',
  urea:  'UREA CYCLE',
};

const PANELS = [
  { x:200, y:2050, w:700, h:170, stroke:'#b8c5d8',
    title:'AA → TCA entry points (HY mnemonics)', titleCls:'c-aa',
    lines:[
      {t:'<tspan fill="#fbbf24">Glucogenic only</tspan>: most AAs (→ pyruvate, OAA, α-KG, succinyl-CoA)'},
      {t:'<tspan fill="#b8a4f5">Purely ketogenic</tspan>:  <tspan fill="#ffe7a3" font-weight="700">L</tspan>eucine,  <tspan fill="#ffe7a3" font-weight="700">L</tspan>ysine    ("the L\'s")'},
      {t:'<tspan fill="#f48bc1">Both</tspan>:  <tspan font-weight="700">I</tspan>le,  <tspan font-weight="700">P</tspan>he,  <tspan font-weight="700">T</tspan>hr,  <tspan font-weight="700">T</tspan>rp,  <tspan font-weight="700">T</tspan>yr   ("PITTT")'},
      {t:'Val/Met/Ile/Thr → propionyl-CoA → succinyl-CoA (needs B12)'},
      {t:'Phe/Tyr → fumarate + acetoacetate   (@pku[PKU]: phe hydroxylase / BH4 deficiency)'},
    ]},
  { x:200, y:2240, w:700, h:120, stroke:'#e89730',
    title:'Ethanol → why it crashes gluconeogenesis', titleCls:'c-box',
    lines:[
      {t:'Ethanol —(ADH, NAD⁺→NADH)→ Acetaldehyde —(ALDH)→ Acetate'},
      {t:'↑↑ NADH/NAD⁺ ratio pushes:'},
      {t:'Pyruvate → Lactate    AND    OAA → Malate'},
      {t:'⇒ no OAA or pyruvate → fasting hypoglycemia + fatty liver', cls:'note'},
    ]},
  // F-2,6-BP master switch — sits just under the F-2,6-BP node, left of glycolysis
  { x:1175, y:600, w:600, h:182, stroke:'#60a5fa', fill:'#0d1626',
    title:'F-2,6-BP — THE glycolysis ⇄ gluconeogenesis switch', titleCls:'c-glyco',
    lines:[
      {t:'<tspan fill="#7dd984">⊕ PFK-2</tspan> makes it  ·  <tspan fill="#ff9ea2">⊖ FBPase-2</tspan> removes it  (ONE bifunctional enzyme)'},
      {t:'<tspan fill="#7dd984">⊕</tspan> ACTIVATES PFK-1 → glycolysis ON  (most potent activator)'},
      {t:'<tspan fill="#ff9ea2">⊖</tspan> INHIBITS F-1,6-BPase → gluconeogenesis OFF'},
      {t:'<tspan fill="#60a5fa">Fed / insulin</tspan>: enzyme DEphosphorylated → ↑ F-2,6-BP → burn glucose'},
      {t:'<tspan fill="#c084fc">Fasting / glucagon</tspan> (cAMP→PKA): phosphorylated → ↓ F-2,6-BP → make glucose'},
    ]},
  { x:200, y:2380, w:700, h:160, stroke:'#60a5fa',
    title:'Insulin (fed) vs Glucagon (fasting)', titleCls:'c-glyco',
    lines:[
      {t:'<tspan fill="#60a5fa">Insulin</tspan>: ↑ glycolysis, glycogen synth, FA synth, protein synth'},
      {t:'  → activates PFK-2 (↑F-2,6-BP), glycogen synthase, ACC, HMG-CoA reductase'},
      {t:'<tspan fill="#c084fc">Glucagon</tspan>: ↑ gluconeogenesis, glycogenolysis, ketogenesis, β-ox'},
      {t:'  → cAMP/PKA: phosphorylates phosphorylase, FBPase-2 (↓F-2,6-BP)'},
      {t:'Trick: phosphorylation ACTIVATES catabolism, INHIBITS anabolism', cls:'note'},
    ]},
  { x:2200, y:190, w:380, h:124, stroke:'#2dd4bf',
    title:'Glycogen storage diseases', titleCls:'c-glyg',
    lines:[
      {t:'I  @vongierke[Von Gierke]  — G6Pase  (severe hypoglyc, hepatomegaly)'},
      {t:'II @pompe[Pompe]        — α-glucosidase  (cardiomegaly)'},
      {t:'III @cori[Cori]         — debranching enzyme'},
      {t:'IV @andersen[Andersen]   — branching enzyme'},
      {t:'V @mcardle[McArdle]      — muscle phosphorylase  ("second wind")'},
      {t:'VI @hers[Hers]          — liver phosphorylase'},
    ]},
  { x:2200, y:610, w:380, h:100, stroke:'#34d399',
    title:'NADPH is used for…', titleCls:'c-ppp',
    lines:[
      {t:'• FA + cholesterol synthesis'},
      {t:'• Glutathione regen (RBC oxidative defense)'},
      {t:'• CYP450 (drugs, steroids)'},
      {t:'• NADPH oxidase respiratory burst (neutrophils → @cgd[CGD])'},
    ]},
  { x:2230, y:2215, w:220, h:58, stroke:'#fb923c', dashed:true, fill:'#1a1d12',
    title:'TCA per Acetyl-CoA:', titleCls:'c-tca',
    lines:[
      {t:'3 NADH  •  1 FADH₂  •  1 GTP', cls:'cof'},
      {t:'2 CO₂ released', cls:'cof'},
    ]},
  { x:3070, y:1843, w:500, h:50, stroke:'#fbbf24', dashed:true, fill:'#1d1d0e',
    title:'Reciprocal regulation', titleCls:'c-fas',
    lines:[
      {t:'Malonyl-CoA inhibits @x:cpt1[CPT-1] → β-ox OFF when FA synth ON', cls:'cof'},
    ]},
  // Container for the METHYLATION arm (left)
  { x:300, y:1120, w:640, h:360, stroke:'#b8c5d8', fill:'#0e1622',
    title:'FOLATE / B12 — METHYLATION & ANEMIA', titleCls:'c-aa',
    lines:[] },
  // B12 vs folate lab-distinction callout (below the methylation cluster)
  { x:300, y:1500, w:640, h:210, stroke:'#ff5e72', fill:'#1a1014',
    title:'B12 vs Folate deficiency', titleCls:'c-urea',
    lines:[
      {t:'BOTH → macrocytic megaloblastic anemia + ↑ homocysteine', cls:'cof'},
      {t:'<tspan fill="#ff9ea2" font-weight="700">B12 ONLY → ↑ MMA + NEURO</tspan> (subacute combined degen.)', cls:'note'},
      {t:'Folate → NO neuro, normal MMA', cls:'cof'},
      {t:'↑ MMA is the differentiator', cls:'note'},
      {t:'Always give B12 BEFORE folate', cls:'note'},
    ]},
  // Container for the PROPIONATE arm (right, under β-oxidation)
  { x:3555, y:2120, w:315, h:355, stroke:'#e89730', fill:'#140f08',
    title:'PROPIONATE → TCA (B12)', titleCls:'c-box',
    lines:[] },
  { x:200, y:2790, w:900, h:80, stroke:'#ef4444', dashed:true, fill:'#1f1414',
    title:'ETC poisons / uncouplers (HY)', titleCls:'c-etc',
    lines:[
      {t:'Complex I: rotenone, MPP⁺   •   Complex IV: <tspan fill="#f5bcbc">CN⁻, CO, H₂S</tspan>'},
      {t:'ATP synthase: oligomycin'},
      {t:'Uncouplers (↑heat, no ATP): 2,4-DNP, aspirin OD, thermogenin (brown fat)'},
    ]},
];

const TITLE = { x: 2100, y: 65, text: 'Integrated Metabolic Map · Step 1 Biochem' };

// Stylized organelle containers drawn behind everything.
// Each entry: rounded outer shape (cell/organelle membrane) + dashed inner
// shape (inner membrane / cristae hint) + label.
const ORGANELLES = [
  {
    id: 'mito',
    label: 'MITOCHONDRION  ·  MATRIX',
    sub:   '(TCA · β-oxidation · ETC · ketogenesis)',
    x: 1180, y: 1860, w: 2740, h: 1080,
    rx: 90,
    color: '#e89730',
  },
];

// Urea-cycle compartment split — the high-yield "Citrulline doorway" concept.
// First 2 enzymes (CPS-I, OTC) are MITOCHONDRIAL; the last 3 are CYTOSOLIC.
// Citrulline is made in the matrix, then crosses the membrane to the cytosol.
const UREA_SPLIT = {
  x: 3030, w: 600,
  top: 885,          // top of mitochondrial zone
  membraneY: 1263,   // inner-membrane doorway (just below citrulline)
  bottom: 1600,      // bottom of cytosolic zone
};

// Disease → blocked edge id. Clicking the disease draws a red ✗ on that
// reaction (the enzyme that's deficient). Only Step-1-mappable enzymes.
const DISEASE_BLOCK = {
  vongierke:    'e_g6pase',
  otc:          'e_otc',
  cpsi:         'e_cps1',
  g6pdh:        'e_g6pdh',
  pkdef:        'e_pk',
  pdhdef:       'e_pdh',
  mcad:         'e_box',
  carnitinedef: 'cpt1',
  mcardle:      'e_glyphos',
  hers:         'e_glyphos',
  mma:          'e_mut',
  homocystinuria:'e_cbs',
  propionicacidemia:'e_pcc',
};

// Shunt pathways — when a block backs a metabolite up, it spills into a
// HIGH-YIELD alternate product. Faint by default; opaque + glowing when
// the matching disease is clicked. (Only include shunts that are HY.)
const SHUNTS = [
  {
    disease: 'otc',
    from: 'carbamoylp',
    node: { id:'sh_orotic', label:'Orotic acid', sub:'spills to pyrimidines → ↑ urine',
            x:2780, y:1055, w:230, h:46 },
    arrow: 'M 3220 1078 L 3010 1078',
    label: { t:'carbamoyl-P backs up → pyrimidine path', x:3115, y:1042, anchor:'middle' },
  },
  {
    disease: 'vongierke',
    from: 'g6p',
    node: { id:'sh_vg', label:'↑ Lactate  ·  ↑ Uric acid', sub:'lactic acidosis + gout',
            x:1470, y:470, w:290, h:46 },
    arrow: 'M 1920 388 Q 1830 430 1760 480',
    label: { t:'G6P backs up → glycolysis + PPP', x:1615, y:455, anchor:'middle' },
  },
  {
    disease: 'mcad',
    from: 'boxloop',
    node: { id:'sh_mcad', label:'Dicarboxylic aciduria', sub:'C6–C10 spill → urine (SIDS risk)',
            x:3920, y:2008, w:250, h:46 },
    arrow: 'M 3800 2053 L 3920 2038',
    label: { t:'medium-chain FAs spill', x:3925, y:2080, anchor:'start' },
  },
];
