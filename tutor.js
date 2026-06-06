/* ====================================================================== */
/*  TUTOR — guided walkthrough lessons                                     */
/*                                                                         */
/*  Each lesson has:                                                       */
/*    title     — short headline shown in the tutor card                   */
/*    focus     — { type: 'node'|'pathway'|'vitamin'|'overview',           */
/*                  id?: string, zoom?: number }                           */
/*    content   — HTML body (use <p>, <ul>, <b>, <i>, special divs below)  */
/*                                                                         */
/*  Special content blocks (styled in style.css):                          */
/*    <div class="lc-clinical">…</div>   red — disease / clinical          */
/*    <div class="lc-drug">…</div>       blue — drug / treatment           */
/*    <div class="lc-mnemonic">…</div>   purple — memory hook              */
/*    <div class="lc-warn">…</div>       red — warning, point of no return */
/*    <div class="lc-pearl">…</div>      gold — high-yield fact            */
/* ====================================================================== */

const TUTOR = [
  // ----------------------------------------------------------------------
  // LESSON 1 — Welcome
  // ----------------------------------------------------------------------
  {
    title: 'Welcome — the metabolic map',
    focus: { type: 'overview' },
    content: `
      <p>This is the complete Step 1 metabolic map. We'll walk through it in 27 lessons starting at glucose and ending with the urea cycle.</p>
      <p>By the end you'll see how every pathway connects and which clinical syndromes each one generates.</p>
      <div class="lc-pearl"><b>5 hubs</b> to memorize — every pathway radiates from one:
        <br>• <b>G6P</b> (glycolysis / PPP / glycogen)
        <br>• <b>Pyruvate</b> (4-way junction)
        <br>• <b>Acetyl-CoA</b> (TCA / FA / ketones / cholesterol)
        <br>• <b>OAA</b> (TCA / aspartate / gluconeogenesis)
        <br>• <b>α-KG</b> (transamination hub)
      </div>
      <p style="font-size:11.5px;color:#9caec7">Tip: hit <b>Exit</b> anytime to explore freely. Vitamin chips and pathway labels still work even outside the tutor.</p>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 2 — Glucose enters the cell
  // ----------------------------------------------------------------------
  {
    title: 'Glucose enters the cell',
    focus: { type: 'node', id: 'glucose', zoom: 0.9 },
    content: `
      <p>Glucose can't pass freely through membranes — it needs a transporter.</p>
      <ul>
        <li><b>GLUT1</b> — RBCs, brain, placenta (always on, low Km)</li>
        <li><b>GLUT2</b> — liver, β-cell, kidney, gut (HIGH Km → "sensor")</li>
        <li><b>GLUT3</b> — neurons</li>
        <li><b>GLUT4</b> — muscle + adipose (<i>insulin-dependent</i>)</li>
        <li><b>GLUT5</b> — fructose (intestine, sperm)</li>
      </ul>
      <div class="lc-clinical"><b>Diabetes dx</b>: fasting ≥126, random ≥200 + Sx, HbA1c ≥6.5%, OGTT 2-hr ≥200.</div>
      <div class="lc-pearl">Once inside, glucose is rapidly phosphorylated → trapped (next lesson).</div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 3 — Hexokinase vs Glucokinase
  // ----------------------------------------------------------------------
  {
    title: 'HK vs GK — the first enzyme decision',
    focus: { type: 'node', id: 'g6p', zoom: 1.0 },
    content: `
      <p>Glucose + ATP → <b>G6P</b> + ADP. The phosphate's negative charge locks glucose inside the cell.</p>
      <p>Two enzymes do this. The difference is HIGH YIELD:</p>
      <ul>
        <li><b>Hexokinase</b> — everywhere, LOW Km (works at low glucose), <i>inhibited by G6P</i> (product feedback)</li>
        <li><b>Glucokinase</b> — liver + β-cells, HIGH Km (only at high glucose), <i>induced by insulin</i>, NOT inhibited by G6P</li>
      </ul>
      <div class="lc-mnemonic">Glucokinase is the β-cell's "glucose sensor" — high blood sugar activates it → ATP rises → insulin release.</div>
      <div class="lc-clinical"><b>MODY 2</b>: heterozygous GK mutation → mild persistent hyperglycemia from birth.</div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 4 — G6P branch point
  // ----------------------------------------------------------------------
  {
    title: 'G6P has 4 fates',
    focus: { type: 'node', id: 'g6p', zoom: 0.7 },
    content: `
      <p>G6P is the most important branch point in carb metabolism. Click G6P after the tutor to see all its arrows.</p>
      <ul>
        <li><b>↓ Glycolysis</b> → energy + pyruvate</li>
        <li><b>← Glycogen synthesis</b> via G1P → storage</li>
        <li><b>← PPP</b> → NADPH + ribose</li>
        <li><b>↑ G6Pase</b> → free glucose into bloodstream  (<i>liver / kidney / gut only</i>)</li>
      </ul>
      <div class="lc-warn"><b>Muscle has NO G6Pase</b> → muscle glycogen is selfish. Can't export glucose during fasting.</div>
      <div class="lc-clinical"><b>Von Gierke (GSD I)</b>: G6Pase deficiency → severe fasting hypoglycemia, hepatomegaly, lactic acidosis, hyperuricemia, hyperlipidemia.</div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 5 — Glycolysis intro
  // ----------------------------------------------------------------------
  {
    title: 'Glycolysis — universal energy pathway',
    focus: { type: 'pathway', id: 'glyco' },
    content: `
      <p>Every cell does glycolysis. Cytosolic. No O₂ needed.</p>
      <div class="lc-pearl"><b>Net per glucose</b>: 2 ATP + 2 NADH + 2 pyruvate</div>
      <p>Key locations:</p>
      <ul>
        <li><b>RBCs</b> — ONLY glycolysis (no mitochondria)</li>
        <li><b>Renal medulla</b> — relies on glycolysis (poorly oxygenated)</li>
      </ul>
      <p>Two substrate-level phosphorylation steps make ATP:</p>
      <ul>
        <li>PGK (1,3-BPG → 3-PG)</li>
        <li>PK (PEP → pyruvate)</li>
      </ul>
      <div class="lc-mnemonic">Inhibitors: <i>arsenic</i> (G3P-DH, via lipoic acid), <i>fluoride</i> (enolase).</div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 6 — PFK-1
  // ----------------------------------------------------------------------
  {
    title: 'PFK-1 — THE rate-limiting step',
    focus: { type: 'node', id: 'f16bp', zoom: 1.1 },
    content: `
      <p>F6P → F-1,6-BP is the <b>committed step</b> of glycolysis. Cells regulate this enzyme to control whether glucose burns or not.</p>
      <p><b>Activators</b>: AMP, F-2,6-BP</p>
      <p><b>Inhibitors</b>: ATP, citrate</p>
      <div class="lc-pearl"><b>F-2,6-BP</b> is made by <b>PFK-2</b>, which is regulated by insulin/glucagon — this is how the fed/fasted switch flips glycolysis on or off.</div>
      <ul>
        <li><b>Fed (insulin)</b>: PFK-2 active → ↑ F-2,6-BP → PFK-1 ON → glycolysis</li>
        <li><b>Fasted (glucagon)</b>: PFK-2 phosphorylated → becomes FBPase-2 → ↓ F-2,6-BP → PFK-1 OFF → gluconeogenesis</li>
      </ul>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 7 — Pyruvate kinase
  // ----------------------------------------------------------------------
  {
    title: 'Pyruvate kinase — the final commitment',
    focus: { type: 'node', id: 'pep', zoom: 1.1 },
    content: `
      <p>PEP → Pyruvate. Substrate-level phosphorylation makes ATP.</p>
      <p><b>Activated by F-1,6-BP</b> (feed-forward!) + insulin. <b>Inhibited by</b> ATP, alanine, glucagon.</p>
      <div class="lc-clinical"><b>Pyruvate Kinase deficiency</b>: chronic hemolytic anemia. 2nd most common after G6PDH deficiency.
        <br>Why RBCs hemolyze: they need glycolysis to make ATP for Na/K-ATPase. No ATP → membrane fails → hemolysis.
      </div>
      <div class="lc-mnemonic">PK def → ↑↑ 2,3-BPG (since 1,3-BPG can't proceed) → R-shifted O₂ curve.</div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 8 — Pyruvate junction
  // ----------------------------------------------------------------------
  {
    title: 'Pyruvate — the 4-way junction',
    focus: { type: 'node', id: 'pyruvate', zoom: 0.75 },
    content: `
      <p>Pyruvate is the single biggest fork in carb metabolism. The fate it picks decides whether the cell stores energy, makes glucose, or burns it.</p>
      <ul>
        <li><b>→ Lactate</b> (LDH, anaerobic) — regenerates NAD⁺ so glycolysis can keep running. <i>RBCs and exercising muscle.</i></li>
        <li><b>→ Alanine</b> (ALT, B6) — carries NH₂ to liver. Liver ALT regenerates pyruvate for gluconeogenesis. <i>Cahill cycle.</i></li>
        <li><b>→ OAA</b> (pyruvate carboxylase, biotin, ATP) — gluconeogenesis. <i>Activated by acetyl-CoA.</i></li>
        <li><b>→ Acetyl-CoA</b> (PDH, IRREVERSIBLE) — TCA fuel.</li>
      </ul>
      <div class="lc-pearl"><b>Cori cycle</b>: muscle lactate → liver → glucose (costs liver 4 ATP per glucose).
        <br><b>Cahill cycle</b>: muscle alanine → liver → pyruvate → glucose (also delivers NH₂ for urea).
      </div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 9 — PDH irreversible
  // ----------------------------------------------------------------------
  {
    title: 'PDH — the point of no return',
    focus: { type: 'node', id: 'acetylcoa', zoom: 1.0 },
    content: `
      <p>Pyruvate + CoA + NAD⁺ → Acetyl-CoA + CO₂ + NADH.</p>
      <div class="lc-warn"><b>IRREVERSIBLE</b>. Once carbs become acetyl-CoA, they CANNOT return to glucose in humans. This is why fats can't become glucose — they enter as acetyl-CoA.</div>
      <p>PDH uses 5 cofactors — the same as α-KG-DH (next pathway over):</p>
      <div class="lc-mnemonic"><b>"Tender Loving Care For Nancy"</b>:
        <br><b>T</b>PP (B1) • <b>L</b>ipoic acid • <b>C</b>oA (B5) • <b>F</b>AD (B2) • <b>N</b>AD (B3)
      </div>
      <div class="lc-clinical"><b>PDH deficiency</b> → lactic acidosis + neurological symptoms. Treat with a <i>ketogenic diet</i> (lysine + leucine are the only purely ketogenic AAs).</div>
      <div class="lc-clinical"><b>Arsenic poisoning</b> binds lipoic acid → blocks PDH + α-KG-DH simultaneously. Garlic breath, rice-water stools, Mees lines.</div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 10 — Acetyl-CoA hub
  // ----------------------------------------------------------------------
  {
    title: 'Acetyl-CoA — central hub',
    focus: { type: 'node', id: 'acetylcoa', zoom: 0.7 },
    content: `
      <p>Acetyl-CoA is the universal 2-carbon unit. Look at its arrows — 4 fates:</p>
      <ul>
        <li><b>+ OAA → Citrate → TCA</b> (default, when energy is needed)</li>
        <li><b>→ Ketogenesis</b> (fasting / DKA)</li>
        <li><b>→ Cholesterol synthesis</b> (via cytosolic HMG-CoA)</li>
        <li><b>→ FA synthesis</b> (after citrate shuttle exports it to cytosol)</li>
      </ul>
      <div class="lc-pearl">Acetyl-CoA activates <b>pyruvate carboxylase</b>. Logic: "TCA is full → make OAA so we can export carbons or make glucose."</div>
      <div class="lc-mnemonic">Odd-chain FAs are the exception that prove the rule — they enter as <i>propionyl-CoA → succinyl-CoA</i> (B12 step) and CAN feed gluconeogenesis.</div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 11 — TCA cycle
  // ----------------------------------------------------------------------
  {
    title: 'TCA cycle — where energy is harvested',
    focus: { type: 'pathway', id: 'tca' },
    content: `
      <p>8 steps that fully oxidize acetyl-CoA → 2 CO₂. Located in the mitochondrial matrix.</p>
      <div class="lc-pearl"><b>Per acetyl-CoA</b>: 3 NADH + 1 FADH₂ + 1 GTP + 2 CO₂.</div>
      <p>Two major regulated steps:</p>
      <ul>
        <li><b>Citrate synthase ★</b> — entry. Inhibited by ATP, NADH, citrate.</li>
        <li><b>Isocitrate DH ★</b> — rate-limiting. Activated by ADP + Ca²⁺. Inhibited by ATP, NADH.</li>
      </ul>
      <p>α-KG-DH uses the SAME 5 cofactors as PDH (B1, B2, B3, B5, lipoic).</p>
      <div class="lc-drug"><b>Fluoroacetate</b> (rat poison) → fluorocitrate blocks aconitase.</div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 12 — SDH = Complex II
  // ----------------------------------------------------------------------
  {
    title: 'SDH = Complex II (the TCA / ETC bridge)',
    focus: { type: 'node', id: 'succinate', zoom: 1.0 },
    content: `
      <p>Succinate → Fumarate is catalyzed by <b>Succinate Dehydrogenase</b>.</p>
      <div class="lc-pearl"><b>SDH = Complex II</b>. It's the ONLY TCA enzyme embedded in the inner mitochondrial membrane. This is how the cycle physically connects to the ETC.</div>
      <ul>
        <li>Uses <b>FAD → FADH₂</b> (not NAD)</li>
        <li>Does NOT pump H⁺ across the membrane</li>
      </ul>
      <div class="lc-mnemonic">No proton pumping → <b>FADH₂ ≈ 1.5 ATP</b> vs NADH ≈ 2.5 ATP. This is the whole reason for the yield difference.</div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 13 — ETC + Complex IV inhibitors
  // ----------------------------------------------------------------------
  {
    title: 'ETC — making ATP from gradients',
    focus: { type: 'pathway', id: 'etc' },
    content: `
      <p>NADH and FADH₂ deliver electrons to the ETC. Complexes I / III / IV pump protons into the intermembrane space → gradient. Complex V uses the gradient to make ATP.</p>
      <p><b>Yields</b>: NADH ≈ 2.5 ATP, FADH₂ ≈ 1.5 ATP.</p>
      <div class="lc-clinical"><b>Complex IV inhibitors — HIGH YIELD</b>:
        <br>• <b>Cyanide</b> (smoke inhalation, sodium nitroprusside drip)
        <br>• <b>CO</b> (carbon monoxide)
        <br>• <b>H₂S</b>, azide
      </div>
      <div class="lc-clinical"><b>CN poisoning</b> = "histotoxic hypoxia": O₂ is there but cells can't use it. <i>Bright red venous blood.</i></div>
      <div class="lc-drug"><b>CN tx</b>: hydroxocobalamin (binds CN), nitrites (induce metHb → grabs CN), thiosulfate (converts to thiocyanate).</div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 14 — ATP synthase + uncouplers
  // ----------------------------------------------------------------------
  {
    title: 'ATP synthase + uncouplers',
    focus: { type: 'node', id: 'c5', zoom: 1.1 },
    content: `
      <p>Complex V is the molecular turbine. Protons flow back through it → spins → makes ATP.</p>
      <div class="lc-drug"><b>Oligomycin</b> blocks the H⁺ channel → no ATP, gradient backs up → ETC stops.</div>
      <div class="lc-pearl"><b>Uncouplers</b> collapse the gradient → energy released as HEAT, no ATP:</div>
      <ul>
        <li><b>2,4-DNP</b> — historical weight-loss drug; lethal hyperthermia</li>
        <li><b>Aspirin overdose</b> — respiratory alkalosis early → anion-gap metabolic acidosis (mixed)</li>
        <li><b>Thermogenin (UCP-1)</b> — physiological! In brown fat. Generates heat in neonates.</li>
      </ul>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 15 — Gluconeogenesis intro
  // ----------------------------------------------------------------------
  {
    title: 'Gluconeogenesis — making glucose in fasting',
    focus: { type: 'pathway', id: 'gng' },
    content: `
      <p>Liver (and kidney) reverse glycolysis during fasting to maintain blood glucose. Brain depends on it.</p>
      <p><b>Substrates</b>: lactate (Cori), alanine (Cahill), glycerol, glucogenic AAs.</p>
      <div class="lc-warn"><b>Acetyl-CoA CANNOT</b> feed gluconeogenesis. This is why fats don't become glucose (except via the glycerol head of triglycerides).</div>
      <p>Glycerol gets in via the dihydroxyacetone-P (DHAP) entry point. Odd-chain FAs sneak in via propionyl-CoA → succinyl-CoA (B12).</p>
      <p>Driven by: ↑ glucagon → cAMP/PKA cascade. ↑ cortisol (Cushing → hyperglycemia).</p>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 16 — 4 bypass enzymes
  // ----------------------------------------------------------------------
  {
    title: 'The 4 gluconeogenesis bypass enzymes',
    focus: { type: 'pathway', id: 'gng' },
    content: `
      <p>3 glycolysis steps are irreversible. To make glucose, gluconeogenesis uses 4 different enzymes:</p>
      <ol>
        <li><b>Pyruvate carboxylase</b> ★ — pyruvate → OAA  <i>(mitochondrial; biotin + ATP)</i></li>
        <li><b>PEPCK</b> — OAA → PEP  <i>(cytosolic; uses GTP)</i></li>
        <li><b>F-1,6-BPase</b> ★ — rate-limiting</li>
        <li><b>G6Pase</b> — G6P → glucose  <i>(ER lumen; liver/kidney only)</i></li>
      </ol>
      <div class="lc-mnemonic">Pyruvate carboxylase needs <b>biotin (B7)</b> — same as ACC, propionyl-CoA carb., methylcrotonyl-CoA carb. = "the 4 carboxylases."</div>
      <div class="lc-clinical"><b>Von Gierke (GSD I)</b>: G6Pase deficiency → severe fasting hypoglycemia. Treat with frequent feeds + cornstarch.</div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 17 — Ethanol crashes glucose
  // ----------------------------------------------------------------------
  {
    title: 'Why ethanol crashes blood sugar',
    focus: { type: 'node', id: 'oaa', zoom: 0.9 },
    content: `
      <p>Ethanol metabolism (HIGH yield mechanism):</p>
      <p style="font-family:monospace;color:#8ae8cd">Ethanol —(ADH, NAD⁺→NADH)→ Acetaldehyde —(ALDH)→ Acetate</p>
      <p>BOTH steps use NAD⁺ → NADH. Result: massively ↑ NADH/NAD⁺ ratio.</p>
      <p>This shoves equilibria toward the reduced form:</p>
      <ul>
        <li><b>Pyruvate → Lactate</b> (LDH) — no pyruvate for GNG</li>
        <li><b>OAA → Malate</b> (MDH) — no OAA for GNG</li>
      </ul>
      <div class="lc-warn"><b>Result</b>: fasting hypoglycemia + fatty liver (excess NADH also drives FA synthesis).</div>
      <div class="lc-drug"><b>Disulfiram</b> blocks ALDH → acetaldehyde buildup → vomiting / flushing. Used for alcohol use disorder.</div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 18 — PPP + G6PDH deficiency
  // ----------------------------------------------------------------------
  {
    title: 'PPP — NADPH + ribose',
    focus: { type: 'pathway', id: 'ppp' },
    content: `
      <p>Branches off G6P. No ATP made or used. Produces 2 NADPH per G6P.</p>
      <p><b>G6PDH ★</b> rate-limiting. Oxidative phase is irreversible.</p>
      <div class="lc-pearl"><b>NADPH uses</b> (very HY):
        <br>• FA + cholesterol synthesis
        <br>• Glutathione regeneration (RBC oxidative defense)
        <br>• CYP450 drug metabolism
        <br>• NADPH oxidase respiratory burst in neutrophils
      </div>
      <div class="lc-clinical"><b>G6PDH deficiency</b>: X-linked, MOST COMMON enzyme defect worldwide. RBCs can't regenerate glutathione → oxidative damage → hemolysis.</div>
      <div class="lc-drug"><b>Triggers</b>: fava beans, primaquine, sulfa drugs, dapsone, infection.</div>
      <div class="lc-mnemonic">Smear: <b>Heinz bodies</b> + <b>bite cells</b>. Heterozygotes have malaria resistance.</div>
      <div class="lc-clinical"><b>CGD</b> (chronic granulomatous disease): NADPH oxidase defect → recurrent <i>catalase⁺</i> infections (Staph, Aspergillus). Negative NBT test.</div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 19 — Glycogen
  // ----------------------------------------------------------------------
  {
    title: 'Glycogen — short-term glucose storage',
    focus: { type: 'pathway', id: 'glyg' },
    content: `
      <p>Glucose polymer with α-1,4 chains and α-1,6 branches (more branches = more termini for fast mobilization).</p>
      <ul>
        <li><b>Liver glycogen</b> (~100g) — exports glucose via G6Pase to feed blood</li>
        <li><b>Muscle glycogen</b> (~400g) — used in situ; NO G6Pase</li>
      </ul>
      <p>Two ★ rate-limiting enzymes:</p>
      <ul>
        <li><b>Glycogen synthase</b> ★ — activated by INSULIN (dephosphorylated form active)</li>
        <li><b>Glycogen phosphorylase</b> ★ — activated by GLUCAGON (liver) or epi + AMP (muscle); needs B6</li>
      </ul>
      <div class="lc-mnemonic"><b>Trick</b>: phosphorylation activates phosphorylase (catabolic) but inactivates synthase (anabolic) — the same pattern repeats across all of metabolism.</div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 20 — Glycogen storage diseases
  // ----------------------------------------------------------------------
  {
    title: 'Glycogen storage diseases (GSDs)',
    focus: { type: 'pathway', id: 'glyg' },
    content: `
      <p>HY: know these 4 well.</p>
      <div class="lc-clinical"><b>GSD I — Von Gierke</b> (<i>G6Pase</i>): severe fasting hypoglycemia + hepatomegaly + lactic acidosis + hyperuricemia + hyperlipidemia.</div>
      <div class="lc-clinical"><b>GSD II — Pompe</b> (<i>lysosomal α-1,4-glucosidase</i>): cardiomegaly + hypotonia, infant death.
        <div class="lc-mnemonic" style="margin-top:6px">"Pompe Pumps your heart"</div>
      </div>
      <div class="lc-clinical"><b>GSD III — Cori</b> (<i>debranching enzyme</i>): milder hypoglycemia, NORMAL lactate (gluconeogenesis works).</div>
      <div class="lc-clinical"><b>GSD V — McArdle</b> (<i>muscle phosphorylase</i>): exercise intolerance + muscle cramps + NO lactate rise. "Second wind" phenomenon (switches to fat).</div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 21 — FA synthesis
  // ----------------------------------------------------------------------
  {
    title: 'FA synthesis — building storage fat',
    focus: { type: 'pathway', id: 'fas' },
    content: `
      <p>Happens in cytosol. Acetyl-CoA must get out of mitochondria first — via the <b>citrate shuttle</b> (ATP-citrate lyase regenerates cytosolic acetyl-CoA from citrate).</p>
      <p><b>ACC ★</b> rate-limiting — uses biotin to add CO₂ → malonyl-CoA. Activated by citrate / insulin; inhibited by palmitoyl-CoA / glucagon / AMPK.</p>
      <p><b>FA synthase</b> builds palmitate (C16) using 14 NADPH (the PPP connection!).</p>
      <div class="lc-pearl"><b>Reciprocal regulation — KEY concept</b>:
        <br>Malonyl-CoA INHIBITS CPT-1 → β-oxidation OFF when FA synthesis is ON. The cell never makes and burns fat at the same time.
      </div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 22 — β-oxidation + MCAD
  // ----------------------------------------------------------------------
  {
    title: 'β-oxidation — burning fat',
    focus: { type: 'pathway', id: 'box' },
    content: `
      <p>Mitochondrial. Long-chain FAs need <b>CPT-1 ★</b> (carnitine shuttle) to enter — and CPT-1 is INHIBITED by malonyl-CoA.</p>
      <p>Each spiral cycle: chops 2 carbons + makes <b>1 NADH + 1 FADH₂ + 1 acetyl-CoA</b>. Huge yield (palmitate ≈ 106 ATP).</p>
      <div class="lc-clinical"><b>MCAD deficiency</b> — most common FA oxidation disorder. Presents in infants with:
        <br>• Vomiting + <b>hypoketotic hypoglycemia</b> after fasting
        <br>• Risk of SIDS
        <br>• <b>Dicarboxylic aciduria</b> (medium-chain FAs spill into urine)
        <br>Treatment: avoid fasting, frequent feeds.
      </div>
      <div class="lc-clinical"><b>Primary carnitine deficiency</b>: muscle weakness + cardiomyopathy + hypoketotic hypoglycemia.</div>
      <p>Odd-chain FAs → propionyl-CoA → methylmalonyl-CoA → succinyl-CoA. The propionyl → MMA step needs B12!</p>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 23 — Ketogenesis + DKA
  // ----------------------------------------------------------------------
  {
    title: 'Ketogenesis — fasting and DKA',
    focus: { type: 'pathway', id: 'keto' },
    content: `
      <p>In liver mitochondria when acetyl-CoA piles up (fasting, DKA, alcohol).</p>
      <p><b>HMG-CoA synthase ★</b> (mitochondrial) is rate-limiting.</p>
      <p>3 ketones: <b>acetoacetate</b>, <b>β-hydroxybutyrate</b> (major), <b>acetone</b> (volatile → fruity breath).</p>
      <div class="lc-pearl"><b>Liver makes ketones but CANNOT use them</b> — no thiophorase (SCOT). Brain and heart can after adaptation.</div>
      <div class="lc-clinical"><b>DKA</b> (T1DM): ↑ glucose + ↑↑ ketones + anion-gap acidosis + Kussmaul breathing + fruity breath.</div>
      <div class="lc-warn"><b>Urine dipstick MISSES β-OHB</b> — it only detects acetoacetate. As DKA improves and β-OHB → AcAc, dipstick can paradoxically read STRONGER.</div>
      <div class="lc-clinical"><b>Alcoholic ketoacidosis</b>: low/normal glucose + ↑↑ β-OHB. ↑NADH suppresses gluconeogenesis AND favors β-OHB over AcAc.</div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 24 — Cholesterol + statins
  // ----------------------------------------------------------------------
  {
    title: 'Cholesterol — and the statin drugs',
    focus: { type: 'pathway', id: 'chol' },
    content: `
      <p>Cytosolic HMG-CoA → mevalonate → → cholesterol. Same intermediate as ketones but different compartment.</p>
      <p><b>HMG-CoA reductase ★</b> rate-limiting; uses 2 NADPH.</p>
      <div class="lc-drug"><b>STATINS</b> inhibit HMG-CoA reductase → ↓ LDL + ↑ LDL receptor expression.</div>
      <div class="lc-clinical"><b>Statin side effects</b>: myopathy + rhabdomyolysis (worse with fibrates, niacin, grapefruit/CYP3A4 inhibitors), ↑ LFTs.</div>
      <div class="lc-drug"><b>Other lipid drugs</b>:
        <br>• <i>PCSK9 inhibitors</i> — ↑ LDLR
        <br>• <i>Ezetimibe</i> — ↓ gut absorption
        <br>• <i>Fibrates</i> (PPARα agonists) — ↓ TG
        <br>• <i>Niacin</i> — ↓ LDL, ↑ HDL, side effect: flushing
      </div>
      <div class="lc-clinical"><b>Familial hypercholesterolemia</b>: LDLR defect → severe ↑ LDL + xanthomas + MI in 30s.</div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 25 — Urea cycle
  // ----------------------------------------------------------------------
  {
    title: 'Urea cycle — disposing ammonia',
    focus: { type: 'pathway', id: 'urea' },
    content: `
      <p>Ammonia (NH₃) is neurotoxic. The urea cycle (LIVER ONLY) converts it to a safe excretable form.</p>
      <p><b>CPS-I ★</b> rate-limiting; needs <i>N-acetylglutamate</i> as activator.</p>
      <p><b>2 nitrogens</b> enter the urea molecule:</p>
      <ul>
        <li>1 from <b>NH₃</b> (via CPS-I)</li>
        <li>1 from <b>aspartate</b> (via argininosuccinate synthetase)</li>
      </ul>
      <div class="lc-pearl"><b>Fumarate output</b> — major cross-pathway link! Argininosuccinate lyase makes fumarate, which re-enters the TCA cycle.</div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON — The Citrulline checkpoint (mito vs cytosol)
  // ----------------------------------------------------------------------
  {
    title: 'The Citrulline checkpoint (2 compartments)',
    focus: { type: 'node', id: 'citrulline', zoom: 1.0 },
    content: `
      <p>The urea cycle is physically split between <b>two rooms</b> in the cell — the mitochondrion and the cytosol. <b>Citrulline is the doorway</b> between them (see the gold membrane line on the map).</p>
      <div class="lc-pearl"><b>Inside the mitochondrion (the setup)</b>: the first two enzymes — <b>CPS-I</b> and <b>OTC</b> — take raw ammonia and build it into <b>citrulline</b>.</div>
      <div class="lc-pearl"><b>Out in the cytosol (the finish)</b>: citrulline exits the mito, and the last three enzymes — <b>argininosuccinate synthetase → lyase → arginase</b> — finish converting it into <b>urea</b>.</div>
      <div class="lc-mnemonic"><b>Ornithine recycles</b>: regenerated in the cytosol → shuttled back into the mitochondrion to restart the cycle.</div>
      <div class="lc-clinical"><b>Why this matters</b>: <b>OTC</b> is the mitochondrial enzyme just before citrulline. If it fails, mitochondrial carbamoyl-P backs up and spills into the cytosolic <i>pyrimidine</i> pathway → ↑ orotic acid. That compartment overflow is the whole basis of the OTC-vs-CPS-I distinction (next lesson).</div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 26 — OTC deficiency
  // ----------------------------------------------------------------------
  {
    title: 'OTC deficiency — most common UCD',
    focus: { type: 'node', id: 'carbamoylp', zoom: 1.0 },
    content: `
      <p>Ornithine transcarbamoylase (OTC) connects carbamoyl-P to ornithine.</p>
      <div class="lc-clinical"><b>X-linked OTC deficiency</b> — most common urea cycle disorder.
        <br>Carbamoyl-P piles up → can't make citrulline → spills into the pyrimidine pathway.
        <br>• ↑↑ NH₃ (hyperammonemia)
        <br>• ↑↑ <b>orotic acid</b> in urine
        <br>• NORMAL BUN (can't make urea)
      </div>
      <div class="lc-mnemonic"><b>OTC vs CPS-I</b> differential = orotic acid.
        <br>OTC: ↑ NH₃ + ↑ orotic
        <br>CPS-I: ↑ NH₃ only
      </div>
      <div class="lc-drug"><b>Hyperammonemia tx</b>: low protein diet + lactulose (acidifies gut, traps NH₄⁺) + rifaximin (kills urea-producing flora) + benzoate / phenylacetate (sequester N).</div>
      <div class="lc-clinical"><b>Reye syndrome</b>: aspirin in a child with viral illness → mitochondrial damage → hyperammonemia + ↑ LFTs + encephalopathy.</div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON — B12 vs Folate (one-carbon metabolism)
  // ----------------------------------------------------------------------
  {
    title: 'B12 vs Folate — homocysteine & MMA',
    focus: { type: 'node', id: 'homocysteine', zoom: 0.85 },
    content: `
      <p>This single cluster is one of the most heavily tested topics. <b>B12</b> runs <b>TWO</b> reactions; <b>folate</b> shares only one of them. That asymmetry is the whole game.</p>
      <div class="lc-pearl"><b>Reaction 1 — Methionine synthase</b>: homocysteine → methionine. Needs <b>B12 + N⁵-methyl-THF (folate)</b>. <i>Both vitamins.</i></div>
      <div class="lc-pearl"><b>Reaction 2 — Methylmalonyl-CoA mutase</b>: methylmalonyl-CoA → succinyl-CoA. Needs <b>B12 only</b>. (This is also how odd-chain fats reach the TCA → glucose.)</div>
      <div class="lc-mnemonic"><b>The labs follow directly</b>:
        <br>• <b>Both</b> deficiencies → ↑ homocysteine + macrocytic anemia (reaction 1 fails).
        <br>• <b>B12 only</b> → also ↑ <b>methylmalonic acid (MMA)</b> (reaction 2 fails) <b>+ neuro deficits</b>.
        <br>• <b>↑ MMA is the single test that separates B12 from folate.</b></div>
      <div class="lc-clinical"><b>Folate trap</b>: in B12 deficiency, folate gets stuck as N⁵-methyl-THF → functional folate deficiency. Giving folate alone "fixes" the anemia but lets <b>neuro damage progress</b> — so always check/replace B12 first.</div>
      <div class="lc-warn"><b>B6</b> handles the third exit (homocysteine → cysteine). Lose it → <b>homocystinuria</b> (Marfan-like + downward lens dislocation + clots).</div>
    `
  },

  // ----------------------------------------------------------------------
  // LESSON 27 — Final summary
  // ----------------------------------------------------------------------
  {
    title: 'Putting it all together',
    focus: { type: 'overview' },
    content: `
      <p>You've now seen every major pathway. The big-picture rules:</p>
      <div class="lc-pearl"><b>5 hubs</b> — G6P, pyruvate, acetyl-CoA, OAA, α-KG. Every pathway radiates from one.</div>
      <div class="lc-pearl"><b>Insulin (fed)</b> drives anabolism: glycolysis, glycogen synth, FA synth, protein synth. <i>Dephosphorylates targets.</i></div>
      <div class="lc-pearl"><b>Glucagon (fasting)</b> drives catabolism: gluconeogenesis, glycogenolysis, ketogenesis, β-ox. <i>Phosphorylates targets via cAMP/PKA.</i></div>
      <div class="lc-mnemonic"><b>Universal rule</b>: phosphorylation usually ACTIVATES catabolic enzymes and INHIBITS anabolic ones.</div>
      <div class="lc-mnemonic"><b>9 vitamin cofactors</b> — click any chip in the sidebar to review which reactions need each one. B1, B2, B3, B5, B6, B7, B9, B12, lipoic.</div>
      <p>Now you can freely explore the map. Click any metabolite for clinical pearls, any pathway color in the legend, or any vitamin chip. Good luck with Step 1.</p>
    `
  },
];


/* ====================================================================== */
/*  SCENARIO TRACKS — "what happens to my metabolism when…"               */
/*  Each walks the pathways that turn ON in a given physiological state.   */
/* ====================================================================== */

const TRACK_FED = [
  {
    title: 'Fed state — insulin takes over',
    focus: { type: 'overview' },
    content: `
      <p>You just ate a carb-rich meal. Blood glucose ↑ → pancreas releases <b>insulin</b>. The whole body flips to <b>"store it" (anabolism)</b>.</p>
      <div class="lc-pearl">Insulin's motto: <b>build glycogen, build fat, build protein.</b> It <i>dephosphorylates</i> its targets (via PP1).</div>
      <p>We'll follow glucose through its 3 fed-state fates: <b>burn → store as glycogen → store as fat.</b></p>
    `
  },
  {
    title: 'Glucose floods into cells',
    focus: { type: 'node', id: 'glucose', zoom: 0.95 },
    content: `
      <p>Insulin recruits <b>GLUT4</b> transporters to the membrane of <b>muscle + adipose</b> → glucose pours in.</p>
      <div class="lc-pearl"><b>Liver</b> uses insulin-induced <b>glucokinase</b> (high Km) to trap glucose as G6P only when sugar is plentiful — the "glucose sensor."</div>
      <div class="lc-clinical">GLUT4 is the <b>insulin-dependent</b> transporter. In type 2 diabetes, insulin resistance → GLUT4 stays internalized → hyperglycemia.</div>
    `
  },
  {
    title: 'Step 1: burn some for energy',
    focus: { type: 'pathway', id: 'glyco' },
    content: `
      <p>Glycolysis runs hard. Insulin activates <b>PFK-2 → ↑ F-2,6-BP → PFK-1 ON</b> (the rate-limiting committed step).</p>
      <div class="lc-pearl">Pyruvate → acetyl-CoA via <b>PDH</b> (insulin activates it) → feeds the TCA cycle for ATP.</div>
    `
  },
  {
    title: 'Step 2: store as glycogen',
    focus: { type: 'pathway', id: 'glyg' },
    content: `
      <p>Once the cell has enough ATP, glucose is packed away. Insulin activates <b>glycogen synthase</b> (by dephosphorylation).</p>
      <div class="lc-pearl">Liver + muscle fill their glycogen stores first — the fast-access fuel reserve (good for ~12–24 h of fasting later).</div>
      <div class="lc-mnemonic">Same insulin signal that turns synthase ON turns <b>phosphorylase OFF</b> — you never store and break down glycogen at once.</div>
    `
  },
  {
    title: 'Step 3: overflow → make fat',
    focus: { type: 'pathway', id: 'fas' },
    content: `
      <p>Glycogen stores are finite. Extra glucose → acetyl-CoA → exported by the <b>citrate shuttle</b> → fatty acid synthesis.</p>
      <div class="lc-pearl"><b>ACC ★</b> (the rate-limiting carboxylase) is activated by citrate + insulin → makes malonyl-CoA → FA synthase builds palmitate.</div>
      <div class="lc-mnemonic">Malonyl-CoA also <b>blocks CPT-1</b> → β-oxidation is OFF. Reciprocal regulation: you can't build and burn fat simultaneously.</div>
      <div class="lc-clinical">Net fed-state message: <b>insulin stores everything</b> — glycogen, then fat.</div>
    `
  },
];

const TRACK_FASTING = [
  {
    title: 'Fasting — glucagon takes over',
    focus: { type: 'overview' },
    content: `
      <p>A few hours after eating, blood glucose drifts down → pancreas releases <b>glucagon</b>. The body flips to <b>"make glucose" (catabolism)</b>.</p>
      <div class="lc-pearl">The brain + RBCs MUST have glucose. The liver's whole job now is to keep blood sugar up.</div>
      <div class="lc-mnemonic">Glucagon works via <b>cAMP → PKA → phosphorylates</b> targets (opposite of insulin).</div>
    `
  },
  {
    title: 'First fuel: break down glycogen',
    focus: { type: 'pathway', id: 'glyg' },
    content: `
      <p>The fastest source. Glucagon activates <b>glycogen phosphorylase</b> (by phosphorylation) → releases G1P → G6P.</p>
      <div class="lc-pearl">Only the <b>liver</b> can release free glucose to the blood — it has <b>G6Pase</b>. Muscle keeps its glucose for itself.</div>
      <div class="lc-clinical">Liver glycogen lasts only <b>~12–24 hours</b>. After that, gluconeogenesis must take over.</div>
    `
  },
  {
    title: 'Second fuel: make new glucose',
    focus: { type: 'pathway', id: 'gng' },
    content: `
      <p>Gluconeogenesis builds glucose from scratch using the <b>4 bypass enzymes</b>: pyruvate carboxylase → PEPCK → F-1,6-BPase ★ → G6Pase.</p>
      <div class="lc-pearl"><b>Substrates</b>: lactate (Cori cycle), alanine (Cahill cycle), glycerol (from fat), glucogenic amino acids.</div>
      <div class="lc-warn"><b>Fat (acetyl-CoA) cannot become glucose</b> — PDH is irreversible, so the 2-carbon acetyl units can't cross back to pyruvate.</div>
      <div class="lc-mnemonic"><b>The 2 exceptions from fat</b> (the only ways fat helps make glucose):
        <br>• <b>Glycerol</b> — the triglyceride backbone → glycerol-3-P → <b>DHAP</b> → straight into gluconeogenesis (see the Glycerol node feeding DHAP on the map).
        <br>• <b>Odd-chain FAs</b> — their final 3-carbon <b>propionyl-CoA</b> → methylmalonyl-CoA → (<b>B12</b>) → <b>succinyl-CoA</b> → enters the TCA cycle → malate → OAA → glucose.</div>
      <div class="lc-clinical">Even-chain FAs yield ONLY acetyl-CoA (2C) → no net glucose. Odd-chain leave one propionyl-CoA (3C) → that's the part that counts.</div>
    `
  },
  {
    title: 'Spare glucose: everyone else burns fat',
    focus: { type: 'pathway', id: 'box' },
    content: `
      <p>To save glucose for the brain, muscle + most tissues switch to <b>β-oxidation</b> of fatty acids (released from adipose by hormone-sensitive lipase).</p>
      <div class="lc-pearl">Glucagon ↓ malonyl-CoA → <b>CPT-1 opens</b> → FAs enter mitochondria and burn. The reciprocal switch flips the other way vs the fed state.</div>
      <div class="lc-clinical">Net fasting message: <b>glycogen first (hours), then gluconeogenesis + fat-burning</b> to protect blood glucose.</div>
    `
  },
];

const TRACK_STARVATION = [
  {
    title: '"No glucose left" — switch to fat & ketones',
    focus: { type: 'overview' },
    content: `
      <p>Prolonged fasting (days) or uncontrolled diabetes: glycogen is gone and gluconeogenesis can't keep up. The body goes all-in on <b>fat</b>.</p>
      <div class="lc-pearl">Massive lipolysis → the liver is flooded with acetyl-CoA → it converts the excess into <b>ketone bodies</b> as an alternate fuel.</div>
    `
  },
  {
    title: 'Lipolysis floods β-oxidation',
    focus: { type: 'pathway', id: 'box' },
    content: `
      <p>Adipose triglycerides → free fatty acids → liver mitochondria via <b>CPT-1</b> → β-oxidation runs full tilt → tons of acetyl-CoA.</p>
      <div class="lc-pearl">Glycerol from the triglyceride backbone is the one piece that can still feed gluconeogenesis.</div>
    `
  },
  {
    title: 'Acetyl-CoA piles up → ketogenesis',
    focus: { type: 'pathway', id: 'keto' },
    content: `
      <p>So much acetyl-CoA that the TCA cycle is saturated (and OAA is being pulled into gluconeogenesis). The liver routes the overflow to ketones.</p>
      <div class="lc-pearl"><b>HMG-CoA synthase ★</b> (mitochondrial) is the rate-limiting step → acetoacetate + β-hydroxybutyrate.</div>
      <div class="lc-mnemonic"><b>The liver makes ketones but CAN'T use them</b> — it lacks thiophorase (SCOT). It's making fuel for everyone else.</div>
    `
  },
  {
    title: 'The brain switches to ketones',
    focus: { type: 'node', id: 'bhb', zoom: 1.0 },
    content: `
      <p>After <b>~3 days</b> of starvation, the brain adapts to use ketones for most of its energy.</p>
      <div class="lc-pearl">This is the key survival trick: it <b>spares muscle protein</b> (otherwise gluconeogenesis would cannibalize muscle for the brain's glucose).</div>
      <div class="lc-mnemonic">Only <b>RBCs</b> still need glucose (no mitochondria) — so a little gluconeogenesis always continues.</div>
    `
  },
  {
    title: 'The pathologic version: DKA',
    focus: { type: 'node', id: 'bhb', zoom: 1.0 },
    content: `
      <p>In type 1 diabetes there's <b>no insulin to put the brakes on</b> — ketogenesis runs unchecked even though glucose is HIGH.</p>
      <div class="lc-clinical"><b>DKA</b>: ↑↑ glucose + ↑↑ ketones + anion-gap metabolic acidosis + Kussmaul breathing + fruity breath.</div>
      <div class="lc-warn">β-hydroxybutyrate dominates → the <b>urine ketone dipstick under-reads</b> (it only detects acetoacetate).</div>
      <div class="lc-clinical">Contrast: <b>starvation/alcoholic ketoacidosis</b> have low/normal glucose. DKA is the high-glucose one.</div>
    `
  },
];

const TRACK_ALCOHOL = [
  {
    title: 'Alcohol — the NADH flood',
    focus: { type: 'node', id: 'oaa', zoom: 0.9 },
    content: `
      <p>Ethanol is metabolized in two steps that BOTH generate NADH:</p>
      <p style="font-family:monospace;color:#8ae8cd">Ethanol —(ADH)→ Acetaldehyde —(ALDH)→ Acetate</p>
      <div class="lc-pearl">Result: a massively <b>↑ NADH / NAD⁺ ratio</b> in the liver. This single change explains all the downstream pathology.</div>
    `
  },
  {
    title: 'Gluconeogenesis stalls → hypoglycemia',
    focus: { type: 'node', id: 'oaa', zoom: 0.9 },
    content: `
      <p>High NADH pushes key reactions backward:</p>
      <div class="lc-pearl"><b>Pyruvate → Lactate</b> (LDH) — pyruvate is consumed, and lactic acidosis develops.</div>
      <div class="lc-pearl"><b>OAA → Malate</b> (MDH) — OAA is depleted.</div>
      <div class="lc-warn">No pyruvate + no OAA = <b>gluconeogenesis can't run</b> → fasting hypoglycemia (classic in a malnourished drinker).</div>
    `
  },
  {
    title: 'Fat builds up → fatty liver',
    focus: { type: 'pathway', id: 'fas' },
    content: `
      <p>The excess NADH also signals "energy is plentiful" → the liver shifts toward <b>fat synthesis</b> and away from β-oxidation.</p>
      <div class="lc-clinical">Triglycerides accumulate → <b>hepatic steatosis (fatty liver)</b> — the earliest, reversible stage of alcoholic liver disease.</div>
      <div class="lc-clinical">Net alcohol triad: <b>fasting hypoglycemia + lactic acidosis + fatty liver</b>. (Also ↑ AST:ALT > 2 — "a S T = Scotch.")</div>
    `
  },
];

const TOURS = [
  { id:'full',       title:'Complete pathway tour',          sub:'every step · glucose → urea',        lessons: TUTOR },
  { id:'fed',        title:'Fed state — "I just ate"',        sub:'insulin · store everything',         lessons: TRACK_FED },
  { id:'fasting',    title:'Fasting — "between meals"',       sub:'glucagon · make glucose',            lessons: TRACK_FASTING },
  { id:'starvation', title:'Starvation / ketosis — "no glucose"', sub:'switch to fat → ketones',       lessons: TRACK_STARVATION },
  { id:'alcohol',    title:'Alcohol — "why sugar crashes"',   sub:'the NADH flood',                     lessons: TRACK_ALCOHOL },
];
