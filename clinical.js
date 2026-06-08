/* ====================================================================== */
/*  CLINICAL — teaching content for the right-side popup                   */
/*                                                                         */
/*  This file owns the WORDS — clinical pearls, mnemonics, drug notes      */
/*  that appear in the right panel when something is selected.             */
/*                                                                         */
/*  Three lookups:                                                         */
/*    • CLIN[nodeId]           → opens when a metabolite is clicked        */
/*    • CLIN_PATHWAY[pathway]  → opens when a legend row is clicked        */
/*    • CLIN_VITAMIN[vit]      → opens when a vitamin chip is clicked      */
/*                                                                         */
/*  Pearl line shape:                                                      */
/*    { t: 'HTML text', cls: 'warn' | 'drug' | 'mnemonic' | '' }           */
/*                                                                         */
/*  Pearl classes (visual style applied in style.css):                     */
/*    warn      → red card  (⚠ icon) — disease, deficiency                 */
/*    drug      → blue card (℞ icon) — medication, treatment               */
/*    mnemonic  → purple card (◆ icon) — memory hook                       */
/*    (none)    → gold card (★ icon) — standard high-yield fact            */
/* ====================================================================== */

const CLIN = {
  glucose: {
    why: 'The body\'s primary fuel and the START of carb metabolism. Brain and RBCs depend on it.',
    pearls: [
      { t: '<b>Diabetes dx</b>: fasting ≥126, random ≥200 + Sx, HbA1c ≥6.5%, OGTT 2-hr ≥200.' },
      { t: '<b>Whipple\'s triad</b> for hypoglycemia: symptoms + low glucose + relief with sugar.' },
      { t: '<i>Sympathetic Sx first</i> (tremor, sweating, palpitations) → then neuroglycopenic (confusion, seizure, coma).' },
      { t: 'Counter-regulatory: glucagon, epi, cortisol, GH.' },
    ]
  },
  g6p: {
    why: 'The trapped, charged form of glucose. Branch point that decides 4 different fates.',
    pearls: [
      { t: '<b>4 fates</b>: glycolysis ↓, glycogen synth (G1P), PPP (NADPH/ribose), or G6Pase → free glucose.' },
      { t: '<b>Made by Hexokinase</b> (ALL tissues · low Km · inhibited by G6P) <b>or Glucokinase</b> (LIVER + β-cells only · high Km · insulin-induced).', cls:'mnemonic' },
      { t: '<b>Glucokinase = β-cell "glucose sensor"</b> — high Km means it only runs when glucose is HIGH (after a meal). MODY 2 = GK mutation.' },
      { t: 'G6P inhibits hexokinase (feedback) but <i>not glucokinase</i> — that\'s why GK keeps working in liver after a meal.' },
      { t: 'G6Pase is only in <b>liver / kidney / intestinal epithelium</b>. Muscle has none → muscle glycogen is selfish.', cls:'drug' },
      { t: '<b>Von Gierke (GSD I)</b>: G6Pase deficiency → severe fasting hypoglycemia + hepatomegaly + lactic acidosis + hyperuricemia + hyperlipidemia.', cls:'warn' },
    ]
  },
  f26bp: {
    why: 'The single most important regulator of glycolysis vs gluconeogenesis. F-2,6-BP is how the liver decides which direction to run — burn glucose or make it.',
    pearls: [
      { t: 'Made by <b>PFK-2</b> (from F6P), removed by <b>FBPase-2</b> — these are <b>ONE bifunctional enzyme</b> (PFK-2/FBPase-2) toggled by phosphorylation.', cls:'mnemonic' },
      { t: '<b>⊕ Most potent activator of PFK-1</b> → pushes glycolysis forward.' },
      { t: '<b>⊖ Inhibits fructose-1,6-bisphosphatase</b> → shuts gluconeogenesis off. One molecule works both levers, so the cell never runs both pathways at once.' },
      { t: '<b>Fed / insulin</b>: the bifunctional enzyme is DEphosphorylated → PFK-2 active → ↑ F-2,6-BP → glycolysis ON.' },
      { t: '<b>Fasting / glucagon</b> (cAMP → PKA phosphorylates it): FBPase-2 active → ↓ F-2,6-BP → gluconeogenesis ON.', cls:'mnemonic' },
      { t: 'Fits the universal rule: <b>phosphorylation (glucagon/fasting) turns OFF glycolysis</b> and favors making glucose.', cls:'mnemonic' },
    ]
  },
  pyruvate: {
    why: 'The biggest decision point in carbon metabolism. Four exits, four very different fates.',
    pearls: [
      { t: '<b>4 fates</b>: → lactate (LDH), → alanine (ALT), → OAA (pyruvate carboxylase), → acetyl-CoA (PDH, irreversible).' },
      { t: '<b>PDH deficiency</b> → lactic acidosis + neuro deficits. Treat with <i>ketogenic diet</i> (lysine + leucine, the only purely ketogenic AAs).', cls:'warn' },
      { t: 'PDH and α-KG-DH share the <i>same 5 cofactors</i> (B1, B2, B3, B5, lipoic acid). Arsenic blocks lipoic → both fail.', cls:'mnemonic' },
      { t: '<b>Pyruvate kinase deficiency</b>: chronic hemolytic anemia, 2nd most common after G6PDH deficiency. RBCs can\'t make ATP.', cls:'warn' },
      { t: '<b>Cori cycle</b>: muscle lactate → liver glucose (costs liver 4 ATP / glucose). Fuels exercising muscle.' },
    ]
  },
  alanine: {
    why: 'Alanine is the muscle\'s nitrogen export courier. In liver, ALT regenerates pyruvate — so "alanine = pyruvate" in the gluconeogenic sense.',
    pearls: [
      { t: '<b>Cahill (glucose-alanine) cycle</b>: muscle protein → pyruvate + NH₂ → alanine → liver → pyruvate → glucose.' },
      { t: 'In liver, ALT strips the NH₂ to α-KG (making glutamate, which fuels urea cycle).' },
      { t: '<b>Serum ALT</b> is the liver-specific transaminase (rises in hepatocyte injury).' },
      { t: '<i>AST > ALT (ratio >2)</i> → <b>alcoholic</b> hepatitis. <i>ALT > AST</i> → <b>viral</b> hepatitis.', cls:'mnemonic' },
    ]
  },
  lactate: {
    why: 'End-product of anaerobic glycolysis; regenerates NAD⁺ so glycolysis can keep running without O₂.',
    pearls: [
      { t: 'Made/cleared via <b>Cori cycle</b> (muscle ↔ liver).' },
      { t: 'Lactic acidosis: shock, sepsis, <b>metformin</b> (especially in renal failure), CN/CO poisoning.', cls:'drug' },
      { t: 'Also elevated in: <i>PDH deficiency</i>, <i>Von Gierke (GSD I)</i>, <i>thiamine deficiency</i>.' },
      { t: 'RBCs make lactate constantly (no mitochondria).' },
    ]
  },
  acetylcoa: {
    why: 'Universal 2-carbon unit. Once carbs become acetyl-CoA the carbons cannot return to glucose in humans.',
    pearls: [
      { t: '<b>Cannot make glucose</b>: PDH is irreversible. Fats (which become acetyl-CoA) can\'t feed gluconeogenesis — only the glycerol head and odd-chain FAs can.', cls:'warn' },
      { t: 'Activates <i>pyruvate carboxylase</i> (signal: TCA full → make OAA for gluconeogenesis).' },
      { t: 'Inhibits PDH (feedback).' },
      { t: 'In starvation / DKA / alcohol: liver shunts acetyl-CoA → <b>ketogenesis</b>.' },
    ]
  },
  oaa: {
    why: 'Without OAA, the TCA cycle stalls. Also the launch pad for gluconeogenesis.',
    pearls: [
      { t: '<b>Anaplerosis</b>: pyruvate carboxylase (biotin, ATP) refills OAA. Acetyl-CoA activates it.' },
      { t: '<b>↔ Aspartate via AST</b> (B6). Feeds urea cycle (2nd N) and pyrimidine synthesis.' },
      { t: '<i>Alcohol depletes OAA</i>: ↑NADH → OAA → malate. Result: fasting hypoglycemia + fatty liver.', cls:'warn' },
      { t: 'Fumarate from urea cycle re-enters TCA here (via malate).' },
    ]
  },
  akg: {
    why: 'Every amino group in metabolism eventually funnels here. The transamination hub.',
    pearls: [
      { t: 'Transamination (all use <b>B6/PLP</b>): α-KG + AA ↔ Glutamate + α-keto-acid.' },
      { t: '<b>GDH</b> (glutamate dehydrogenase): glutamate → α-KG + free NH₃. Feeds urea cycle.' },
      { t: 'Brain ammonia toxicity: NH₃ traps onto α-KG → glutamate → glutamine. Depletes α-KG → TCA stalls.', cls:'warn' },
    ]
  },
  succoa: {
    why: 'Where the TCA cycle pays off (GTP), and the entry point for B12-dependent metabolism.',
    pearls: [
      { t: '<b>ALA synthase</b> (mitochondrial, B6): succinyl-CoA + glycine → δ-ALA. Rate-limiting step of <b>heme synthesis</b>.' },
      { t: 'Odd-chain FAs + Val/Met/Ile/Thr → propionyl-CoA → methylmalonyl-CoA → succinyl-CoA (<b>B12</b> step).' },
      { t: '<b>B12 deficiency</b>: ↑MMA + ↑homocysteine + macrocytic anemia + <i>neuro (subacute combined degeneration)</i>.', cls:'warn' },
      { t: '<b>Folate deficiency</b>: ↑homocysteine only, macrocytic anemia, <i>no</i> neuro.', cls:'mnemonic' },
    ]
  },
  fumarate: {
    why: 'TCA intermediate AND the cross-link from urea cycle back to TCA.',
    pearls: [
      { t: 'Output of <i>argininosuccinate lyase</i> (cytosolic, urea cycle).' },
      { t: 'Phe and Tyr break down to fumarate + acetoacetate (both glucogenic <i>and</i> ketogenic).' },
      { t: '<b>PKU</b>: phenylalanine hydroxylase or BH4 deficiency → ↑phe, musty body odor, intellectual disability, light skin/eczema.', cls:'warn' },
    ]
  },
  aspartate: {
    why: 'The 2nd nitrogen of urea. Also the AST substrate.',
    pearls: [
      { t: '<b>AST</b> (B6): aspartate ↔ OAA.' },
      { t: 'AST is in heart and muscle too — less liver-specific than ALT.' },
      { t: '<i>AST > ALT</i> → alcoholic hepatitis. (Mnemonic: a<b>S</b>T = <b>S</b>cotch.)', cls:'mnemonic' },
      { t: 'Building block for <b>pyrimidines</b> (asp + carbamoyl-P → orotate → UMP).' },
    ]
  },
  glutamate: {
    why: 'Central nitrogen carrier — the "in" door (transamination) and "out" door (GDH releases NH₃).',
    pearls: [
      { t: '<b>GDH</b>: glutamate ↔ α-KG + free NH₃ (the ammonia that feeds urea).' },
      { t: '<b>Glutamine synthetase</b> (muscle, brain): NH₃ + glutamate → glutamine. Safer N transport form.' },
      { t: 'Hepatic encephalopathy tx: <b>lactulose</b> (traps NH₃ in gut) + <b>rifaximin</b> (kills urea-producing flora).', cls:'drug' },
    ]
  },
  '13bpg': {
    why: 'In RBCs, 1,3-BPG is shunted to 2,3-BPG — the right-shift modulator of hemoglobin.',
    pearls: [
      { t: '<b>2,3-BPG</b> binds deoxy-Hb → ↓O₂ affinity → R-shifts curve → unloads O₂ to tissues.' },
      { t: 'Elevated in chronic hypoxia: altitude, anemia, smokers, COPD.' },
      { t: 'Fetal Hb (HbF) binds 2,3-BPG poorly → L-shifted curve → steals O₂ from maternal blood.' },
    ]
  },
  c2: {
    why: 'Complex II = Succinate Dehydrogenase. The only TCA enzyme on the inner mitochondrial membrane. Doesn\'t pump protons → that\'s why FADH₂ yields less ATP.',
    pearls: [
      { t: '<b>SDH = Complex II</b> — the connection point between TCA and ETC.' },
      { t: 'Does NOT pump H⁺ → <b>FADH₂ ≈ 1.5 ATP</b> vs NADH ≈ 2.5 ATP.' },
      { t: 'No major Step 1 inhibitor (unlike Complex IV).' },
    ]
  },
  c4: {
    why: 'The cyanide / CO target. Highest-yield ETC complex for Step 1.',
    pearls: [
      { t: '<b>Cytochrome c oxidase</b> — final electron acceptor → O₂ → H₂O.' },
      { t: '<b>Inhibitors</b>: <i>cyanide</i> (smoke inhalation, sodium nitroprusside drip), <i>CO</i>, <i>H₂S</i>, azide.', cls:'warn' },
      { t: '<b>CN poisoning</b>: "histotoxic hypoxia" — O₂ is there but unusable. Bright red venous blood, mixed acidosis.', cls:'warn' },
      { t: 'Tx: <b>hydroxocobalamin</b> (binds CN), <b>nitrites</b> (induce metHb to grab CN), <b>thiosulfate</b> (converts to thiocyanate).', cls:'drug' },
    ]
  },
  c5: {
    why: 'ATP synthase — the molecular turbine where the proton gradient becomes ATP.',
    pearls: [
      { t: '<b>Oligomycin</b> blocks the H⁺ channel → no ATP, gradient backs up → ETC stops too.' },
      { t: '<b>Uncouplers</b> (collapse gradient → heat, no ATP):' },
      { t: '— <i>2,4-DNP</i> (historical weight-loss drug; lethal hyperthermia).', cls:'drug' },
      { t: '— <i>Aspirin overdose</i> (uncouples + stimulates respiratory center): respiratory alkalosis early → anion-gap metabolic acidosis.', cls:'warn' },
      { t: '— <i>Thermogenin (UCP-1)</i>: physiological uncoupler in brown fat — neonatal thermogenesis.' },
    ]
  },
  glycogen: {
    why: 'Polymer for short-term glucose storage. Liver glycogen feeds the bloodstream; muscle glycogen is selfish.',
    pearls: [
      { t: 'Liver ≈100g (exports glucose via G6Pase). Muscle ≈400g (uses in situ — no G6Pase).' },
      { t: 'Branching (α-1,6) gives more termini for fast mobilization.' },
      { t: '<b>GSD I (Von Gierke)</b>: G6Pase → severe hypoglyc + hepatomegaly + lactic acidosis + ↑uric acid.', cls:'warn' },
      { t: '<b>GSD II (Pompe)</b>: lysosomal α-glucosidase → <i>cardiomegaly</i>, death by 2 yrs. ("Pompe Pumps your heart.")', cls:'mnemonic' },
      { t: '<b>GSD III (Cori)</b>: debranching enzyme. Milder. Normal lactate.' },
      { t: '<b>GSD V (McArdle)</b>: <i>muscle</i> phosphorylase → exercise intolerance, no lactate rise, "second wind."' },
    ]
  },
  '6pg': {
    why: 'PPP produces 2 NADPH from G6P — critical for biosynthesis AND oxidative defense.',
    pearls: [
      { t: '<b>G6PDH ★</b> rate-limiting. Oxidative phase is irreversible.' },
      { t: '<b>G6PDH deficiency</b>: X-linked, most common enzyme defect worldwide.', cls:'warn' },
      { t: 'Hemolysis triggered by: <i>fava beans, primaquine, sulfa drugs, dapsone, infection</i>.', cls:'drug' },
      { t: 'Smear: <b>Heinz bodies</b> + <b>bite cells</b>.', cls:'mnemonic' },
      { t: 'Protects against <i>P. falciparum</i> malaria (heterozygote advantage).' },
    ]
  },
  r5p: {
    why: 'Substrate for PRPP → purine/pyrimidine synthesis. The "ribose" branch of PPP.',
    pearls: [
      { t: 'PRPP synthetase: ribose-5-P + ATP → PRPP.' },
      { t: '<b>Lesch-Nyhan</b>: HGPRT deficiency → no purine salvage → ↑PRPP shunted to <i>de novo</i> → ↑uric acid + self-mutilation + hyperreflexia.', cls:'warn' },
      { t: 'Mycophenolate, 6-MP, allopurinol all act on purine pathway.', cls:'drug' },
    ]
  },
  fa: {
    why: 'Stored as triglycerides; mobilized in fasting via hormone-sensitive lipase.',
    pearls: [
      { t: '<b>HSL</b> activated by glucagon/epi (cAMP→PKA). Inhibited by insulin.' },
      { t: 'Glycerol from TGs → liver → gluconeogenesis (the <i>only</i> way fats indirectly become glucose).' },
      { t: 'Long-chain FAs need <b>CPT-1</b> (carnitine shuttle) to enter mitochondria.' },
      { t: '<b>Primary carnitine deficiency</b>: muscle weakness, hypoketotic hypoglycemia, cardiomyopathy.', cls:'warn' },
    ]
  },
  boxloop: {
    why: 'Each spiral chops 2 carbons and makes 1 NADH + 1 FADH₂ + 1 acetyl-CoA. Huge ATP yield per FA.',
    pearls: [
      { t: '<b>MCAD deficiency</b>: most common FA oxidation disorder.', cls:'warn' },
      { t: 'Presents: vomiting + <b>hypoketotic hypoglycemia</b> in infancy after fasting. Risk of <i>SIDS</i>.', cls:'warn' },
      { t: 'Labs: <b>dicarboxylic aciduria</b> (medium-chain FAs spill into urine).', cls:'mnemonic' },
      { t: 'Odd-chain FAs → propionyl-CoA → succinyl-CoA (B12 step).' },
    ]
  },
  palmitate: {
    why: 'Default product of FA synthase (C16 saturated). Longer/unsaturated FAs come from elongation/desaturation.',
    pearls: [
      { t: 'FA synthase uses ~14 NADPH — a major NADPH consumer alongside cholesterol.' },
      { t: 'Insulin/citrate ↑ ACC; glucagon/AMPK ↓ ACC by phosphorylation.' },
    ]
  },
  hmgcoa_m: {
    why: 'Mitochondrial HMG-CoA → ketones. Cytosolic HMG-CoA → cholesterol. <i>Same molecule, different compartment, totally different fate.</i>',
    pearls: [
      { t: '<b>HMG-CoA synthase (mitochondrial)</b> is the rate-limiting step of ketogenesis.' },
      { t: '<i>Liver makes ketones but cannot use them</i> — no thiophorase (SCOT).', cls:'mnemonic' },
      { t: 'Brain switches to ketones after ~3 days of starvation (preserves muscle).' },
    ]
  },
  bhb: {
    why: 'Dominant ketone in DKA. The urine dipstick MISSES it (only detects acetoacetate).',
    pearls: [
      { t: '<b>β-OHB is the major ketone</b> in DKA but is NOT detected on urine ketones dipstick.', cls:'warn' },
      { t: '<b>DKA</b> (T1DM): ↑glucose + ↑↑ketones + anion-gap acidosis + Kussmaul breathing + <i>fruity breath</i> (acetone).', cls:'warn' },
      { t: '<b>Alcoholic ketoacidosis</b>: normal/low glucose + ↑↑β-OHB. ↑NADH suppresses gluconeogenesis.' },
      { t: '<b>Starvation ketosis</b>: mild, normal glucose, slow onset.' },
    ]
  },
  hmgcoa_c: {
    why: 'The statin target. Rate-limiting step of cholesterol synthesis.',
    pearls: [
      { t: '<b>HMG-CoA reductase ★</b> — uses 2 NADPH.' },
      { t: '<b>Statins</b> (atorva-, rosuva-, etc.) inhibit → ↓LDL + ↑LDLR upregulation.', cls:'drug' },
      { t: 'Statin side effects: <i>myopathy/rhabdomyolysis</i> (worse with fibrates, niacin, grapefruit/CYP3A4 inhibitors), ↑LFTs.', cls:'warn' },
      { t: 'Other lipid drugs: <b>PCSK9 inhibitors</b> (↑LDLR), <b>ezetimibe</b> (↓gut absorption), <b>fibrates</b> (PPARα → ↓TG).', cls:'drug' },
    ]
  },
  cholesterol: {
    why: 'Membranes, steroids, bile acids, vitamin D — all from this one molecule.',
    pearls: [
      { t: '<b>Familial hypercholesterolemia</b>: LDLR defect → severe ↑LDL, xanthomas, MI in 30s.', cls:'warn' },
      { t: 'Bile acids: cholesterol → <i>7α-hydroxylase</i> (rate-limiting) → conjugated with glycine/taurine.' },
      { t: 'Steroidogenesis: cholesterol → pregnenolone via <i>desmolase</i> (ACTH-driven, rate-limiting).' },
    ]
  },
  nh3: {
    why: 'Ammonia is neurotoxic. The urea cycle converts it to a safe excretable form.',
    pearls: [
      { t: 'Sources: AA catabolism (GDH), gut bacterial urease, kidney glutaminase.' },
      { t: '<b>Hyperammonemia</b> → cerebral edema, <i>asterixis</i>, encephalopathy.', cls:'warn' },
      { t: 'Treatment: low-protein diet, <b>lactulose</b> (acidifies gut, traps NH₄⁺), <b>rifaximin</b> (kills urea-producing flora), benzoate/phenylacetate (sequester N).', cls:'drug' },
    ]
  },
  citrulline: {
    why: 'Citrulline is the <b>doorway of the urea cycle</b>. The first two enzymes (CPS-I, OTC) build it inside the <b>mitochondrion</b>; citrulline then crosses the inner membrane into the <b>cytosol</b>, where the last three enzymes finish making urea.',
    pearls: [
      { t: '<b>The cycle is split across two compartments</b> — mitochondrion (setup) → cytosol (finish). Citrulline is the molecule that crosses between them.', cls:'mnemonic' },
      { t: '<b>Mitochondrial half</b>: CPS-I (NH₃ + CO₂ → carbamoyl-P) then OTC (+ ornithine → citrulline).' },
      { t: '<b>Cytosolic half</b>: argininosuccinate synthetase → lyase → arginase → urea.' },
      { t: 'Ornithine is regenerated in the cytosol and shuttled <i>back into</i> the mitochondrion to restart the cycle.' },
      { t: 'Mnemonic: <b>"Ordinarily, Careless Crappers Are Also Frivolous About Urination"</b> — Ornithine, Carbamoyl-P, Citrulline, Aspartate, Argininosuccinate, Fumarate, Arginine, Urea (cycle order).', cls:'mnemonic' },
    ]
  },
  homocysteine: {
    why: 'Homocysteine sits at the crossroads of B12, folate, and B6. Where it goes — and where it backs up — is classic Step 1.',
    pearls: [
      { t: '<b>3 fates</b>: → methionine (methionine synthase, needs <b>B12 + folate</b>), → cysteine (cystathionine synthase, needs <b>B6</b>), or it accumulates in blood.' },
      { t: '<b>↑ Homocysteine</b> is an independent risk factor for <b>atherosclerosis, MI, and thrombosis</b>.', cls:'warn' },
      { t: '<b>B12 OR folate deficiency</b> → can\'t remethylate Hcy → methionine → <b>↑ homocysteine in BOTH</b>.', cls:'mnemonic' },
      { t: '<b>Folate trap</b>: in B12 deficiency, folate gets stuck as N⁵-methyl-THF (can\'t be used) → functional folate deficiency too.', cls:'mnemonic' },
      { t: '<b>Homocystinuria</b> (cystathionine synthase def): very high Hcy → Marfan-like body + lens dislocation (DOWN), thrombosis, intellectual disability.', cls:'warn' },
    ]
  },
  methionine: {
    why: 'Essential amino acid; activated to SAM, the universal methyl donor. Links the folate/B12 cycle to all of cellular methylation.',
    pearls: [
      { t: '<b>Methionine → SAM</b> (S-adenosylmethionine) → donates methyl groups (DNA, neurotransmitters, etc.) → becomes homocysteine.' },
      { t: 'Regenerated from homocysteine by <b>methionine synthase</b> (needs <b>B12 + N⁵-methyl-THF</b>).' },
      { t: 'SAM synthesis mnemonic: <i>"SAM the methyl donor."</i>', cls:'mnemonic' },
    ]
  },
  propionylcoa: {
    why: 'A <b>3-carbon acyl-CoA</b> — a convergence product of catabolism. It\'s the gateway that lets odd-chain fats and certain amino acids enter the TCA cycle (and therefore make glucose).',
    pearls: [
      { t: '<b>Where it comes from</b> — two sources merge here:' },
      { t: '① <b>Odd-chain fatty acid β-oxidation</b>: even-chain FAs end in 2C acetyl-CoA, but the last round of an ODD-chain FA leaves a 3C <b>propionyl-CoA</b>.', cls:'mnemonic' },
      { t: '② <b>Amino acids Val, Ile, Met, Thr</b> catabolize through propionyl-CoA.', cls:'mnemonic' },
      { t: '<b>Fate</b>: propionyl-CoA →(propionyl-CoA carboxylase, <b>B7</b>)→ methylmalonyl-CoA →(mutase, <b>B12</b>)→ <b>succinyl-CoA</b> → TCA.' },
      { t: 'This 3C entry into the TCA is exactly <b>why odd-chain fats can make glucose</b> (succinyl-CoA → malate → OAA), while even-chain (acetyl-CoA) cannot.', cls:'mnemonic' },
      { t: 'Block here → @propionicacidemia[propionic acidemia]; block one step later → @mma[methylmalonic acidemia]. Both → 2° hyperammonemia.', cls:'warn' },
    ]
  },
  mmcoa: {
    why: 'Methylmalonyl-CoA → Succinyl-CoA is the B12-dependent step that lets odd-chain fats + branched amino acids enter the TCA cycle (and make glucose).',
    pearls: [
      { t: '<b>Methylmalonyl-CoA mutase</b> needs <b>B12</b> (adenosylcobalamin).' },
      { t: 'Blocked (B12 def or mutase def) → <b>↑ methylmalonic acid (MMA)</b>.', cls:'warn' },
      { t: 'This is why <b>↑ MMA marks B12 deficiency</b> but NOT folate deficiency.', cls:'mnemonic' },
    ]
  },
  carbamoylp: {
    why: 'Two carbamoyl-P pools: mitochondrial (CPS-I → urea) and cytosolic (CPS-II → pyrimidines). Same molecule, two cycles.',
    pearls: [
      { t: '<b>CPS-I</b> (mitochondrial): rate-limiting of urea cycle; needs <i>N-acetylglutamate</i> as activator.' },
      { t: '<b>CPS-II</b> (cytosolic): rate-limiting of pyrimidine synthesis.' },
      { t: '<b>OTC deficiency</b> (X-linked, most common UCD): ↑NH₃ + ↑<i>orotic acid</i> (spills into pyrimidine path).', cls:'warn' },
      { t: '<b>CPS-I deficiency</b>: ↑NH₃, no orotic acid.', cls:'mnemonic' },
    ]
  },
  urea_out: {
    why: 'Final excretable form of nitrogen. BUN reflects urea cycle output.',
    pearls: [
      { t: '<b>BUN/Cr ratio</b>: >20 prerenal (dehydration), <10 intrinsic renal.' },
      { t: 'Urea cycle is liver-only → hepatic failure causes hyperammonemia.' },
      { t: '<b>Reye syndrome</b>: aspirin in a child with viral illness → mitochondrial damage → ↑NH₃ + ↑LFTs + encephalopathy.', cls:'warn' },
    ]
  },
  heme: {
    why: 'Hemoglobin, cytochromes, catalase, peroxidase. Defects = porphyrias.',
    pearls: [
      { t: '<b>Lead poisoning</b> inhibits ALA dehydratase + ferrochelatase → microcytic anemia with <i>basophilic stippling</i>, abdominal pain, neuro.', cls:'warn' },
      { t: '<b>Acute intermittent porphyria</b> (PBG deaminase deficiency): episodic abdominal pain + neuro/psych, ↑ALA + ↑PBG in urine, <i>no skin findings</i>. Tx: hemin + glucose.', cls:'warn' },
      { t: '<b>Porphyria cutanea tarda</b> (UROD deficiency): most common porphyria — blistering skin photosensitivity.', cls:'warn' },
      { t: '<b>Sideroblastic anemia</b>: ringed sideroblasts. Causes: B6 deficiency, lead, alcohol, INH.', cls:'mnemonic' },
    ]
  },
};

/* ====================================================================== */
/*  DISEASES — clickable disease pearls                                    */
/*                                                                         */
/*  Disease names rendered with the @key[display] marker become clickable  */
/*  red underlined links. Clicking opens this card in the right panel.    */
/*  Use this for: deficiencies, syndromes, named diseases.                 */
/* ====================================================================== */

/* Ordered, grouped index of DISEASES for the sidebar browser. Every key must
   exist in DISEASES below. Groups are NBME-style buckets. */
const DISEASE_GROUPS = [
  { label:'Glycogen storage',              keys:['vongierke','pompe','cori','andersen','mcardle','hers'] },
  { label:'RBC enzyme (hemolysis)',        keys:['g6pdh','pkdef'] },
  { label:'Pyruvate / fuel',               keys:['pdhdef'] },
  { label:'Fatty-acid oxidation',          keys:['mcad','carnitinedef'] },
  { label:'Organic acidemia / B12–folate', keys:['propionicacidemia','mma','homocystinuria','pernicious'] },
  { label:'Urea cycle / hyperammonemia',   keys:['otc','cpsi','reye'] },
  { label:'Amino acid',                    keys:['pku','hartnup','carcinoid'] },
  { label:'B-vitamin deficiency',          keys:['wernicke','pellagra'] },
  { label:'Lipid',                         keys:['fh'] },
  { label:'Heme / porphyria',              keys:['aip','pct','leadpoisoning'] },
  { label:'Purine / immune / endocrine',   keys:['leschnyhan','cgd','dka'] },
];

const DISEASES = {
  // ---- Glycogen storage diseases ----
  vongierke: {
    name: 'Von Gierke (GSD I)',
    enzyme: 'G6Pase deficiency',
    why: 'Without G6Pase, the liver can\'t release glucose into the blood. G6P piles up inside hepatocytes and shunts into <b>glycolysis (→ lactate)</b> and <b>PPP (→ uric acid)</b> instead.',
    pearls: [
      { t: '<b>Severe fasting hypoglycemia</b> — glucose can\'t leave the liver, so blood sugar crashes between meals.', cls:'warn' },
      { t: '<b>Hepatomegaly</b> + classic "doll-face" appearance (glycogen + fat accumulation in liver).', cls:'warn' },
      { t: '<b>Lactic acidosis</b> — G6P → glycolysis → ↑ pyruvate → ↑ lactate spills into blood.', cls:'warn' },
      { t: '<b>Hyperuricemia + gout</b> — G6P shunts into PPP → ↑ purine turnover. ATP depletion also impairs renal urate excretion.', cls:'warn' },
      { t: '<b>Hyperlipidemia</b> — excess acetyl-CoA → fatty acid synthesis → ↑ triglycerides.', cls:'warn' },
      { t: '<b>Autosomal recessive</b>. Type Ia = G6Pase enzyme; Type Ib = G6P transporter into the ER.', cls:'mnemonic' },
      { t: 'Treatment: <b>frequent feeds</b> + <b>cornstarch at bedtime</b> (slow-release glucose).', cls:'drug' }
    ]
  },
  pompe: {
    name: 'Pompe disease (GSD II)',
    enzyme: 'Lysosomal α-1,4-glucosidase (acid maltase) deficiency',
    why: 'Glycogen accumulates inside <b>lysosomes</b> (not cytoplasm). Heart muscle especially vulnerable.',
    pearls: [
      { t: '<b>Severe cardiomegaly + cardiomyopathy</b> → death in infancy if untreated.', cls:'warn' },
      { t: 'Also: hypotonia ("floppy baby"), hepatomegaly, macroglossia.', cls:'warn' },
      { t: 'Mnemonic: <b>"Pompe Pumps your heart"</b> — heart-dominant phenotype.', cls:'mnemonic' },
      { t: 'Autosomal recessive. Late-onset adult form also exists (milder, mostly skeletal muscle).' },
      { t: 'Treatment: <b>enzyme replacement therapy</b> (alglucosidase alfa) — the only GSD with effective ERT.', cls:'drug' }
    ]
  },
  cori: {
    name: 'Cori disease (GSD III)',
    enzyme: 'Debranching enzyme (α-1,6-glucosidase) deficiency',
    why: 'Glycogen branches can\'t be removed → "limit dextrin" accumulates. <b>Gluconeogenesis still works</b> → milder than Von Gierke.',
    pearls: [
      { t: '<b>Mild fasting hypoglycemia</b> + hepatomegaly. Milder than Von Gierke.', cls:'warn' },
      { t: '<b>Normal blood lactate</b> — distinguishes from Von Gierke (where lactate is sky-high).', cls:'mnemonic' },
      { t: 'Mnemonic: "Cori = limit dextrin" — the abnormal glycogen structure left behind.', cls:'mnemonic' }
    ]
  },
  andersen: {
    name: 'Andersen disease (GSD IV)',
    enzyme: 'Branching enzyme deficiency',
    why: 'Glycogen made without branches → long unbranched chains can\'t mobilize quickly + the abnormal structure damages hepatocytes.',
    pearls: [
      { t: '<b>Progressive cirrhosis</b> → liver failure in infancy.', cls:'warn' },
      { t: 'Hepatosplenomegaly + hypotonia. Generally fatal in early childhood.', cls:'warn' }
    ]
  },
  mcardle: {
    name: 'McArdle disease (GSD V)',
    enzyme: 'Muscle glycogen phosphorylase (myophosphorylase) deficiency',
    why: 'Muscle can\'t break down its own glycogen → no glycolytic fuel during exercise → cramps + rhabdomyolysis.',
    pearls: [
      { t: '<b>Exercise intolerance</b> — muscle cramps + weakness with exertion. Resolves with rest.', cls:'warn' },
      { t: '<b>"Second wind" phenomenon</b> — symptoms improve after rest as muscle switches to fatty-acid oxidation.', cls:'mnemonic' },
      { t: '<b>No rise in blood lactate</b> after forearm exercise test (vs normal). Myoglobinuria (rhabdo) common.', cls:'warn' },
      { t: 'Mnemonic: "McArdle = Muscle" — liver phosphorylase still works, so <b>no hypoglycemia</b>.', cls:'mnemonic' }
    ]
  },
  hers: {
    name: 'Hers disease (GSD VI)',
    enzyme: 'Liver glycogen phosphorylase deficiency',
    why: 'Liver can\'t break down glycogen for export → mild fasting hypoglycemia. Muscle phosphorylase still works (so no exercise intolerance).',
    pearls: [
      { t: 'Mild fasting hypoglycemia + hepatomegaly.' },
      { t: 'Generally benign course; often improves with age.' }
    ]
  },

  // ---- Enzyme deficiencies ----
  g6pdh: {
    name: 'G6PDH deficiency',
    enzyme: 'Glucose-6-Phosphate Dehydrogenase (PPP)',
    why: 'PPP can\'t make NADPH → RBC glutathione can\'t be regenerated → oxidative damage builds up → hemoglobin precipitates → hemolysis.',
    pearls: [
      { t: '<b>X-linked recessive</b>. Most common human enzyme defect worldwide. Common in African, Mediterranean, and Asian populations.', cls:'mnemonic' },
      { t: '<b>Episodic hemolytic anemia</b> triggered by oxidative stress.', cls:'warn' },
      { t: '<b>Triggers</b>: fava beans, primaquine, sulfa drugs, dapsone, nitrofurantoin, infection.', cls:'drug' },
      { t: 'Smear: <b>Heinz bodies</b> (denatured Hb) + <b>bite cells</b> (after splenic pitting).', cls:'warn' },
      { t: 'Heterozygotes protected against <i>P. falciparum</i> malaria (heterozygote advantage).' }
    ]
  },
  pkdef: {
    name: 'Pyruvate Kinase deficiency',
    enzyme: 'Pyruvate Kinase (red cell isoform)',
    why: 'RBCs can\'t make ATP via glycolysis → membrane Na/K pumps fail → chronic hemolysis. ↑↑ 2,3-BPG builds up upstream → right-shifted O₂ curve.',
    pearls: [
      { t: '<b>Chronic hemolytic anemia</b> — 2nd most common enzymatic cause after G6PDH deficiency.', cls:'warn' },
      { t: '<b>Autosomal recessive</b>.', cls:'mnemonic' },
      { t: '<b>↑↑ 2,3-BPG</b> compensates somewhat by improving O₂ unloading (right-shifted curve).', cls:'mnemonic' },
      { t: 'No Heinz bodies (not oxidative). Splenomegaly common.' }
    ]
  },
  pdhdef: {
    name: 'PDH deficiency',
    enzyme: 'Pyruvate Dehydrogenase complex',
    why: 'Pyruvate can\'t enter the TCA cycle → all pyruvate shunts to <b>lactate</b> (LDH) and <b>alanine</b> (ALT). Lactic acidosis dominates.',
    pearls: [
      { t: '<b>Lactic acidosis</b> from infancy + <b>neurological deficits</b>.', cls:'warn' },
      { t: '<b>Treatment</b>: <i>ketogenic diet</i> — provides fat → ketones to bypass PDH. Increase intake of <b>lysine + leucine</b> (the only purely ketogenic AAs).', cls:'drug' },
      { t: '<b>Same 5 cofactors</b> as α-KG-DH: B1, B2, B3, B5, lipoic acid. <i>Arsenic</i> poisoning blocks lipoic acid → mimics PDH deficiency.', cls:'mnemonic' }
    ]
  },
  mcad: {
    name: 'MCAD deficiency',
    enzyme: 'Medium-Chain Acyl-CoA Dehydrogenase (β-oxidation)',
    why: 'Medium-chain FAs can\'t be β-oxidized → no acetyl-CoA → no ketones → fasting hypoglycemia. C8-C10 FAs spill into urine as dicarboxylic acids.',
    pearls: [
      { t: 'Most common fatty acid oxidation disorder.' },
      { t: 'Presents in <b>infancy after fasting</b>: vomiting + <b>hypoketotic hypoglycemia</b> + lethargy.', cls:'warn' },
      { t: '<b>Risk of SIDS</b> if fasting goes too long.', cls:'warn' },
      { t: 'Labs: <b>dicarboxylic aciduria</b> (C6-C10 FAs spill into urine).', cls:'mnemonic' },
      { t: 'Treatment: <b>avoid fasting</b> + frequent feeds.', cls:'drug' }
    ]
  },
  carnitinedef: {
    name: 'Primary carnitine deficiency',
    enzyme: 'OCTN2 carnitine transporter (or CPT-1/CPT-2)',
    why: 'Long-chain FAs can\'t enter mitochondria → no β-oxidation → no acetyl-CoA → no ketones → muscle has no fuel during fasting.',
    pearls: [
      { t: '<b>Muscle weakness</b> + <b>hypertrophic cardiomyopathy</b>.', cls:'warn' },
      { t: '<b>Hypoketotic hypoglycemia</b> during fasting/exercise.', cls:'warn' },
      { t: 'Treatment: <b>L-carnitine supplementation</b>.', cls:'drug' }
    ]
  },
  otc: {
    name: 'OTC deficiency',
    enzyme: 'Ornithine Transcarbamoylase (urea cycle)',
    why: 'Carbamoyl phosphate can\'t enter the urea cycle → spills into the <b>pyrimidine pathway</b> → ↑ orotic acid in urine. NH₃ accumulates → neurotoxicity.',
    pearls: [
      { t: '<b>X-linked recessive</b>. Most common urea cycle disorder.', cls:'mnemonic' },
      { t: '<b>Hyperammonemia</b> → cerebral edema, vomiting, encephalopathy, asterixis.', cls:'warn' },
      { t: '<b>Labs</b>: ↑ NH₃ + <b>↑ orotic acid in urine</b>, NORMAL BUN.', cls:'mnemonic' },
      { t: '<b>Orotic acid is the differentiator</b> from CPS-I deficiency (which is ↑ NH₃ only).', cls:'mnemonic' },
      { t: 'Treatment: low-protein diet + lactulose + rifaximin + benzoate/phenylacetate (sequester N).', cls:'drug' }
    ]
  },
  cpsi: {
    name: 'CPS-I deficiency',
    enzyme: 'Carbamoyl Phosphate Synthetase I (urea cycle)',
    why: 'First step of urea cycle blocked → NH₃ has nowhere to go. No carbamoyl-P is made → no spillover into pyrimidines, so NO orotic acid.',
    pearls: [
      { t: '<b>Hyperammonemia</b> from infancy → neurotoxicity, vomiting, encephalopathy.', cls:'warn' },
      { t: '<b>Labs</b>: ↑ NH₃ alone, NORMAL orotic acid (vs OTC deficiency).', cls:'mnemonic' },
      { t: 'Treatment: same as OTC — low protein + ammonia scavengers.', cls:'drug' }
    ]
  },

  // ---- Amino acid disorders ----
  pku: {
    name: 'Phenylketonuria (PKU)',
    enzyme: 'Phenylalanine hydroxylase (or BH4 cofactor)',
    why: 'Phe can\'t be converted to Tyr → ↑↑ Phe in blood → phenylketones spill into urine. Tyr becomes essential → impaired neurotransmitter & melanin synthesis.',
    pearls: [
      { t: '<b>Autosomal recessive</b>. Universal newborn screening.', cls:'mnemonic' },
      { t: '<b>Clinical</b>: intellectual disability + <b>musty body odor</b> + <b>light skin/blond hair</b> (low melanin) + eczema + seizures.', cls:'warn' },
      { t: '<b>Treatment</b>: Phe-restricted diet for life + Tyr supplementation. <b>Avoid aspartame</b> (contains Phe).', cls:'drug' },
      { t: '<b>Maternal PKU</b>: mother\'s ↑ Phe crosses placenta → fetal microcephaly + congenital heart defects.', cls:'warn' }
    ]
  },
  hartnup: {
    name: 'Hartnup disease',
    enzyme: 'Neutral amino acid transporter (SLC6A19) — intestine + kidney',
    why: 'Can\'t absorb neutral AAs including tryptophan → low tryptophan → can\'t make niacin (B3) from trp → pellagra-like symptoms.',
    pearls: [
      { t: '<b>Pellagra-like rash</b> on sun-exposed areas + cerebellar ataxia + neurological symptoms.', cls:'warn' },
      { t: 'Mnemonic: "Tryptophan trapped in gut" — can\'t absorb the AA needed to make niacin.', cls:'mnemonic' },
      { t: 'Treatment: <b>niacin supplementation</b> + high-protein diet.', cls:'drug' }
    ]
  },
  carcinoid: {
    name: 'Carcinoid syndrome',
    enzyme: 'Neuroendocrine tumor (typically midgut)',
    why: 'Tumor cells consume tryptophan to make serotonin. Systemic symptoms appear only when the tumor metastasizes to the liver (bypassing first-pass clearance).',
    pearls: [
      { t: '<b>Classic triad</b>: episodic flushing + secretory diarrhea + right-sided heart valve fibrosis.', cls:'warn' },
      { t: '<b>Tryptophan depleted</b> → secondary niacin deficiency → pellagra.', cls:'mnemonic' },
      { t: 'Diagnosis: ↑ urinary <b>5-HIAA</b> (serotonin metabolite).' },
      { t: 'Treatment: <b>octreotide</b> (somatostatin analog) blocks serotonin release.', cls:'drug' }
    ]
  },

  // ---- B-vitamin deficiencies ----
  wernicke: {
    name: 'Wernicke-Korsakoff',
    enzyme: 'Thiamine (B1) deficiency',
    why: 'Without B1, PDH + α-KG-DH + transketolase fail → mitochondrial dysfunction hits brain regions with the highest energy demand (mammillary bodies, thalamus).',
    pearls: [
      { t: '<b>Wernicke triad</b>: confusion + ataxia + ophthalmoplegia. <i>Reversible</i> if treated quickly.', cls:'warn' },
      { t: '<b>Korsakoff</b>: anterograde amnesia + confabulation + apathy. <i>Irreversible</i> sequela.', cls:'warn' },
      { t: '<b>Classic cause</b>: chronic alcoholism. Also: malnutrition, hyperemesis gravidarum, post-bariatric surgery.', cls:'mnemonic' },
      { t: '<b>Always give thiamine BEFORE glucose</b> in malnourished patients — glucose without B1 can precipitate Wernicke.', cls:'drug' }
    ]
  },
  pellagra: {
    name: 'Pellagra',
    enzyme: 'Niacin (B3) deficiency',
    why: 'Niacin (NAD/NADP) deficiency disrupts redox reactions in skin, gut, and brain.',
    pearls: [
      { t: '<b>3 D\'s (+D)</b>: <b>D</b>ermatitis (sun-exposed areas) + <b>D</b>iarrhea + <b>D</b>ementia + <b>D</b>eath.', cls:'mnemonic' },
      { t: 'Causes: corn-only diet, Hartnup, carcinoid syndrome, isoniazid (depletes B6 needed for trp→niacin).', cls:'mnemonic' },
      { t: 'Treatment: niacin supplementation.', cls:'drug' }
    ]
  },

  // ---- Classic syndromes ----
  leschnyhan: {
    name: 'Lesch-Nyhan syndrome',
    enzyme: 'HGPRT deficiency (purine salvage)',
    why: 'No purine salvage → PRPP accumulates → drives <i>de novo</i> purine synthesis → ↑↑ uric acid.',
    pearls: [
      { t: '<b>X-linked recessive</b>. Boys only.', cls:'mnemonic' },
      { t: '<b>Clinical tetrad</b>: <b>self-mutilation</b> (lip/finger biting) + hyperuricemia (gout, tophi) + intellectual disability + dystonia / hyperreflexia.', cls:'warn' },
      { t: 'Mnemonic: <b>HGPRT</b> → <b>H</b>yperuricemia, <b>G</b>out, <b>P</b>issed-off (aggression), <b>R</b>etardation, dys<b>T</b>onia.', cls:'mnemonic' },
      { t: 'Treatment: <b>allopurinol</b> or <b>febuxostat</b> for hyperuricemia.', cls:'drug' }
    ]
  },
  reye: {
    name: 'Reye syndrome',
    enzyme: 'Aspirin-induced mitochondrial dysfunction (after viral illness)',
    why: 'Aspirin metabolites damage mitochondria → β-oxidation fails + urea cycle slows → fatty liver + hyperammonemia + encephalopathy.',
    pearls: [
      { t: '<b>Children</b> + recent viral illness (flu, varicella) + <b>aspirin</b> → Reye syndrome.', cls:'warn' },
      { t: 'Presents: <b>vomiting → encephalopathy</b> → coma. Hepatomegaly + ↑ LFTs + ↑ NH₃.', cls:'warn' },
      { t: '<b>Avoid aspirin in children</b> with viral illness — use acetaminophen instead.', cls:'drug' }
    ]
  },
  cgd: {
    name: 'Chronic Granulomatous Disease (CGD)',
    enzyme: 'NADPH oxidase (phagocyte respiratory burst)',
    why: 'Phagocytes can\'t mount the respiratory burst → can\'t kill <b>catalase-positive</b> organisms (which neutralize their own H₂O₂).',
    pearls: [
      { t: '<b>Recurrent infections</b> with catalase-positive organisms: <i>Staph aureus, Aspergillus, Burkholderia, Serratia, E. coli</i>.', cls:'warn' },
      { t: 'Mnemonic: <b>"SPACE"</b> — <b>S</b>taph, <b>P</b>seudomonas, <b>A</b>spergillus, <b>C</b>andida, <b>E</b>nterics.', cls:'mnemonic' },
      { t: 'Diagnosis: <b>negative NBT test</b> (nitroblue tetrazolium fails to reduce), or DHR flow cytometry.', cls:'mnemonic' },
      { t: 'Treatment: prophylactic TMP-SMX + itraconazole + interferon-γ.', cls:'drug' }
    ]
  },
  fh: {
    name: 'Familial Hypercholesterolemia',
    enzyme: 'LDL receptor (LDLR) defect',
    why: 'LDL can\'t be cleared from circulation → severe hypercholesterolemia from birth.',
    pearls: [
      { t: '<b>Autosomal dominant</b>. Heterozygotes have moderate ↑ LDL; <b>homozygotes</b> have severe ↑↑↑ LDL.', cls:'mnemonic' },
      { t: 'Heterozygotes: MI by age 30–40. Homozygotes: MI in childhood.', cls:'warn' },
      { t: 'Findings: <b>tendon xanthomas</b> (Achilles), <b>xanthelasmas</b> (eyelids), <b>corneal arcus</b> at a young age.', cls:'warn' },
      { t: 'Treatment: high-dose statins + PCSK9 inhibitors (homozygotes may need LDL apheresis).', cls:'drug' }
    ]
  },
  pernicious: {
    name: 'Pernicious anemia',
    enzyme: 'Autoimmune destruction of parietal cells → no intrinsic factor → no B12 absorption',
    why: 'B12 needs intrinsic factor to be absorbed in the terminal ileum. Without IF → no B12 → ↑ MMA + ↑ homocysteine.',
    pearls: [
      { t: '<b>Macrocytic megaloblastic anemia</b> + <b>neurological deficits</b> (subacute combined degeneration of dorsal columns + lateral corticospinal tracts).', cls:'warn' },
      { t: 'Labs: ↑ MMA + ↑ homocysteine + ↓ B12 + <b>anti-IF antibodies</b>.', cls:'mnemonic' },
      { t: 'Associated with other autoimmune conditions; ↑ gastric cancer risk.' },
      { t: 'Treatment: <b>parenteral B12</b> (IM or sublingual).', cls:'drug' }
    ]
  },
  aip: {
    name: 'Acute Intermittent Porphyria',
    enzyme: 'Porphobilinogen deaminase (HMBS)',
    why: 'Heme synthesis blocked at the PBG step → ALA + PBG accumulate → neurotoxicity. No skin findings (porphyrins don\'t reach skin).',
    pearls: [
      { t: '<b>5 P\'s</b>: <b>P</b>ainful abdomen + <b>P</b>ort-wine urine + <b>P</b>olyneuropathy + <b>P</b>sychological symptoms + <b>P</b>recipitated by drugs / fasting.', cls:'mnemonic' },
      { t: '<b>No skin findings</b> (vs other porphyrias). Triggers: barbiturates, alcohol, fasting, infection.', cls:'warn' },
      { t: 'Labs: ↑ urinary <b>ALA</b> + ↑ <b>PBG</b>.', cls:'mnemonic' },
      { t: 'Treatment: <b>hemin + glucose</b> (both suppress ALA synthase).', cls:'drug' }
    ]
  },
  pct: {
    name: 'Porphyria Cutanea Tarda',
    enzyme: 'Uroporphyrinogen decarboxylase (UROD)',
    why: 'Uroporphyrinogen accumulates → reaches skin → photoactivated porphyrins trigger blistering on sun exposure.',
    pearls: [
      { t: 'Most common porphyria. Often associated with <b>HCV infection</b>, alcohol, estrogens.', cls:'mnemonic' },
      { t: '<b>Blistering photosensitive rash</b> on sun-exposed skin (hands, face).', cls:'warn' },
      { t: '<b>Tea-colored urine</b> (uroporphyrins). Hypertrichosis common.', cls:'warn' },
      { t: 'Treatment: avoid sun, phlebotomy (lower iron), hydroxychloroquine.', cls:'drug' }
    ]
  },
  leadpoisoning: {
    name: 'Lead poisoning',
    enzyme: 'Lead inhibits ALA dehydratase + ferrochelatase',
    why: 'Both heme synthesis enzymes blocked → microcytic anemia + ↑ protoporphyrin + multisystem toxicity.',
    pearls: [
      { t: '<b>Microcytic anemia</b> with <b>basophilic stippling</b> on smear.', cls:'warn' },
      { t: '<b>Adults</b> (occupational): abdominal pain + neuropathy (wrist/foot drop) + HTN.', cls:'warn' },
      { t: '<b>Children</b> (paint chips, dust): cognitive impairment + gingival lead lines (Burton lines).', cls:'warn' },
      { t: 'Labs: ↑ blood lead + ↑ urinary ALA + ↑ erythrocyte protoporphyrin.' },
      { t: 'Treatment: <b>dimercaprol + EDTA</b> (severe); <b>succimer</b> (mild / children, oral).', cls:'drug' }
    ]
  },
  propionicacidemia: {
    name: 'Propionic acidemia',
    enzyme: 'Propionyl-CoA carboxylase (biotin) deficiency',
    why: 'Propionyl-CoA can\'t become methylmalonyl-CoA → propionyl-CoA + propionic acid pile up and succinyl-CoA is not replenished. The accumulated propionyl-CoA <b>also shuts down the urea cycle</b>.',
    pearls: [
      { t: 'Source = odd-chain FAs + the <b>"VOMIT"</b> amino acids: <b>V</b>aline, <b>O</b>dd-chain, <b>M</b>ethionine, <b>I</b>soleucine, <b>T</b>hreonine.', cls:'mnemonic' },
      { t: 'Infant: poor feeding, vomiting, hypotonia, <b>anion-gap metabolic acidosis</b> + ketosis.', cls:'warn' },
      { t: '<b>Secondary hyperammonemia</b>: accumulated propionyl-CoA inhibits <b>N-acetylglutamate synthase</b> → ↓ <b>NAG</b> → <b>CPS-I can\'t be activated</b> → urea cycle stalls → NH₃ accumulates. (Depleted succinyl-CoA/anaplerosis also impairs TCA.)', cls:'warn' },
      { t: '<b>Normal MMA</b> — the block is BEFORE methylmalonyl-CoA. That\'s what separates it from methylmalonic acidemia.', cls:'mnemonic' },
      { t: 'Treatment: low-protein diet (limit VOMIT AAs), carnitine, ± biotin trial.', cls:'drug' },
    ]
  },
  mma: {
    name: 'Methylmalonic acidemia',
    enzyme: 'Methylmalonyl-CoA mutase (or its B12 cofactor) deficiency',
    why: 'Methylmalonyl-CoA can\'t be converted to succinyl-CoA → methylmalonic acid builds up and succinyl-CoA isn\'t replenished. Also occurs functionally in any B12 deficiency.',
    pearls: [
      { t: '<b>↑ MMA</b> in blood + urine → anion-gap metabolic acidosis.', cls:'warn' },
      { t: 'Infant: vomiting, lethargy, hypotonia, failure to thrive, acidosis.', cls:'warn' },
      { t: '<b>Secondary hyperammonemia</b> (same as propionic acidemia): the built-up CoA esters inhibit <b>N-acetylglutamate synthase</b> → ↓ NAG → CPS-I not activated → urea cycle stalls.', cls:'warn' },
      { t: '<b>↑ MMA is what separates B12 deficiency from folate deficiency</b> (folate def → MMA normal).', cls:'mnemonic' },
      { t: 'B12 (cobalamin) is the cofactor — so B12 deficiency mimics this.', cls:'mnemonic' },
    ]
  },
  homocystinuria: {
    name: 'Homocystinuria',
    enzyme: 'Cystathionine synthase deficiency (B6-dependent) — most common form',
    why: 'Homocysteine can\'t proceed to cystathionine/cysteine → homocysteine + methionine accumulate and spill into urine.',
    pearls: [
      { t: '<b>Marfan-like habitus</b> (tall, long limbs, pectus) BUT with <b>intellectual disability</b> + <b>thrombosis</b> (Marfan has neither).', cls:'warn' },
      { t: '<b>Lens dislocation is DOWNWARD</b> (& inward). Mnemonic: homocystinuria = down. Marfan = up.', cls:'mnemonic' },
      { t: 'Premature atherosclerosis + venous/arterial thrombosis → strokes/MI in youth.', cls:'warn' },
      { t: 'Treatment: ↓ methionine + ↑ cysteine diet; many respond to high-dose <b>B6 (pyridoxine)</b>; supplement folate/B12.', cls:'drug' },
    ]
  },
  dka: {
    name: 'Diabetic Ketoacidosis',
    enzyme: 'Severe insulin deficiency (T1DM > T2DM)',
    why: 'No insulin → unchecked lipolysis + β-oxidation → liver makes massive acetyl-CoA → ketogenesis floods bloodstream with β-OHB.',
    pearls: [
      { t: 'Classic: <b>↑↑ glucose</b> + <b>↑↑ ketones</b> + anion-gap metabolic acidosis + Kussmaul breathing + <b>fruity breath</b> (acetone).', cls:'warn' },
      { t: 'β-OHB > acetoacetate (high NADH/NAD⁺ ratio). <b>Urine dipstick MISSES β-OHB</b>!', cls:'warn' },
      { t: 'Triggers: <b>I</b>nfection + <b>I</b>nsulin missed + <b>I</b>nfarction (the 3 I\'s).', cls:'mnemonic' },
      { t: 'Treatment: <b>fluids → insulin → electrolytes (K⁺!)</b>. Watch for cerebral edema in kids.', cls:'drug' }
    ]
  },
};

/* Acronym → full name. Used to expand enzyme abbreviations in the right
   panel (the map keeps the compact acronym). Keep LONGER / more-specific
   tokens before shorter ones so expansion doesn't partially match. */
const ENZYME_FULL = {
  'PFK-1':       'Phosphofructokinase-1',
  'G6PDH':       'Glucose-6-phosphate dehydrogenase',
  'CPS-I':       'Carbamoyl phosphate synthetase I',
  'CPT-1':       'Carnitine palmitoyltransferase-1',
  'PEPCK':       'PEP carboxykinase',
  'F-1,6-BPase': 'Fructose-1,6-bisphosphatase',
  'G6Pase':      'Glucose-6-phosphatase',
  'ACC':         'Acetyl-CoA carboxylase',
  'PDH':         'Pyruvate dehydrogenase complex',
  'LDH':         'Lactate dehydrogenase',
  'ALT':         'Alanine aminotransferase',
  'AST':         'Aspartate aminotransferase',
  'OTC':         'Ornithine transcarbamoylase',
};

/* Enzyme classes — the "think in buckets" system. Each class does ONE kind
   of reaction and uses ONE kind of cofactor. abbr/color drive the in-map
   highlight; the rest fills the right-panel teaching card. */
const ENZ_CLASS = {
  carb: {
    abbr:'CARB', color:'#d4a574', need:'Biotin (B7)',
    name:'Carboxylases',
    does:'Add a carboxyl group — fix a <b>CO₂</b> onto the substrate.',
    cofactor:'Biotin (B7) + ATP',
    members:[
      '<b>Pyruvate carboxylase</b> → OAA  (gluconeogenesis / anaplerosis)',
      '<b>Acetyl-CoA carboxylase (ACC)</b> → malonyl-CoA  (FA synthesis ★ rate-limiting)',
      '<b>Propionyl-CoA carboxylase</b> → methylmalonyl-CoA  (odd-chain FA)',
      '<b>Methylcrotonyl-CoA carboxylase</b>  (leucine catabolism)',
    ],
    pearls:[
      {t:'<b>The 4 carboxylases ALL need biotin (B7)</b> — "Bio-CO₂."', cls:'mnemonic'},
      {t:'Raw egg whites contain <b>avidin</b> → binds biotin → deficiency.', cls:'warn'},
    ]
  },
  dh: {
    abbr:'DH', color:'#8ae8cd', need:'NAD or FAD (B3 / B2)',
    name:'Dehydrogenases',
    does:'Redox reactions — strip <b>electrons / H</b> off the substrate and load them onto a carrier.',
    cofactor:'NAD⁺ (B3) or FAD (B2)  →  NADH / FADH₂',
    members:[
      '<b>PDH</b> &amp; <b>α-KG dehydrogenase</b> — share the same 5 cofactors (B1, B2, B3, B5, lipoic)',
      '<b>Isocitrate dehydrogenase</b> — TCA rate-limiting',
      '<b>Succinate dehydrogenase</b> = Complex II  (uses FAD)',
      '<b>G6PDH</b> — PPP, makes NADPH',
      '<b>LDH</b> · <b>Malate dehydrogenase</b> · <b>G3P dehydrogenase</b>',
    ],
    pearls:[
      {t:'NAD⁺-linked (B3) feeds catabolism/ETC; <b>NADP(H)</b> is for biosynthesis.', cls:'mnemonic'},
      {t:'FAD-linked ones (SDH, β-ox) tie to <b>B2</b> (riboflavin).', cls:''},
    ]
  },
  kin: {
    abbr:'KIN', color:'#7eb5ff', need:'ATP',
    name:'Kinases',
    does:'Transfer a <b>phosphate from ATP</b> onto the substrate (phosphorylation).',
    cofactor:'ATP → ADP',
    members:[
      '<b>Hexokinase / Glucokinase</b> — traps glucose as G6P',
      '<b>PFK-1</b> — glycolysis ★ rate-limiting (the committed step)',
      '<b>Pyruvate kinase</b> — substrate-level ATP',
    ],
    pearls:[
      {t:'Kinases <i>add</i> phosphate (use ATP); <b>phosphatases</b> <i>remove</i> it — opposite enzymes run glycolysis vs gluconeogenesis.', cls:'mnemonic'},
    ]
  },
  tram: {
    abbr:'B6', color:'#ff8fc2', need:'PLP (B6)',
    name:'Transaminases',
    does:'Move an <b>amino group</b> from an amino acid onto α-KG (transamination).',
    cofactor:'PLP — vitamin B6',
    members:[
      '<b>ALT</b> — alanine ↔ pyruvate  (liver-specific marker)',
      '<b>AST</b> — aspartate ↔ OAA  (also heart / muscle)',
    ],
    pearls:[
      {t:'<b>ALL transaminases need B6 (PLP).</b>', cls:'mnemonic'},
      {t:'AST:ALT &gt; 2 → <b>alcoholic</b>; ALT &gt; AST → <b>viral</b> hepatitis.', cls:'mnemonic'},
    ]
  },
  phos: {
    abbr:'Pase', color:'#7dd984', need:'water (no vitamin)',
    name:'Phosphatases',
    does:'<b>Remove a phosphate</b> by hydrolysis — they drive the gluconeogenesis bypass.',
    cofactor:'water (no vitamin / no ATP)',
    members:[
      '<b>F-1,6-BPase</b> — gluconeogenesis ★ rate-limiting',
      '<b>G6Pase</b> — final glucose release  (liver / kidney only)',
    ],
    pearls:[
      {t:'<b>G6Pase</b> deficiency = Von Gierke. Muscle lacks G6Pase → can\'t export glucose.', cls:'warn'},
      {t:'Phosphatases reverse what kinases did — that\'s why glycolysis and gluconeogenesis use different enzymes.', cls:'mnemonic'},
    ]
  },
  red: {
    abbr:'RED', color:'#f48bc1', need:'NADPH',
    name:'Reductases',
    does:'<b>Reduce</b> the substrate using <b>NADPH</b> as the electron donor.',
    cofactor:'NADPH',
    members:[
      '<b>HMG-CoA reductase</b> — cholesterol ★ rate-limiting (the statin target)',
    ],
    pearls:[
      {t:'Biosynthetic <b>NADPH</b> comes from the PPP (G6PDH).', cls:''},
      {t:'<b>Statins</b> competitively inhibit HMG-CoA reductase.', cls:'drug'},
    ]
  },
};

const VIT_COLOR = {
  B1:'#5fd0e0', B2:'#fbe34d', B3:'#ffa64a', B5:'#7eb5ff',
  B6:'#ff8fc2', B7:'#d4a574', B9:'#7dd984', B12:'#ff5e72', lipoic:'#c4a4ff'
};

const CLIN_VITAMIN = {
  B1: {
    name: 'B1 — Thiamine (TPP)',
    role: 'Decarboxylation of α-keto acids + transketolase',
    why: 'Cofactor for the <b>α-keto acid dehydrogenase</b> complexes (PDH, αKG-DH, branched-chain α-KAD) and for <b>transketolase</b> in the PPP.',
    pearls: [
      { t: 'Memory hook: <b>"ATP"</b> — <b>α</b>-KG-DH, <b>T</b>ransketolase, <b>P</b>DH (+ BCKDH).', cls:'mnemonic' },
      { t: '<b>Wernicke encephalopathy</b>: confusion + ataxia + ophthalmoplegia (CN VI palsy / nystagmus). Reversible if treated.', cls:'warn' },
      { t: '<b>Korsakoff</b>: anterograde amnesia + confabulation. <i>Irreversible</i> — what Wernicke becomes if untreated.', cls:'warn' },
      { t: '<b>Wet beriberi</b>: high-output dilated cardiomyopathy. <b>Dry beriberi</b>: peripheral neuropathy + muscle wasting.', cls:'warn' },
      { t: '<b>Always give B1 BEFORE glucose</b> in alcoholics — glucose without B1 can precipitate Wernicke.', cls:'drug' },
      { t: 'Lab: ↑ RBC transketolase activity after thiamine challenge confirms deficiency.', cls:'mnemonic' }
    ]
  },
  B2: {
    name: 'B2 — Riboflavin (FAD / FMN)',
    role: 'Redox carrier — FAD/FMN-dependent dehydrogenases',
    why: 'Electron carrier in <b>Complex II</b>, <b>β-oxidation</b>, PDH, αKG-DH.',
    pearls: [
      { t: 'Mnemonic: <b>"2 C\'s"</b> of B2 deficiency — <b>C</b>heilosis (cracked mouth corners) + <b>C</b>orneal vascularization. Also glossitis.', cls:'mnemonic' },
      { t: 'Rarely deficient alone — usually with other B vitamin deficiencies (alcoholism, malnutrition).' },
      { t: '"FAD the riboflavin" — FAD = the F in B2.', cls:'mnemonic' }
    ]
  },
  B3: {
    name: 'B3 — Niacin (NAD / NADP)',
    role: 'Universal redox cofactor; made from tryptophan',
    why: 'Electron carrier for nearly every dehydrogenase. Can be synthesized from <b>tryptophan</b> (needs B6).',
    pearls: [
      { t: '<b>Pellagra — the 3 D\'s (+D)</b>: <b>D</b>ermatitis (sun-exposed) + <b>D</b>iarrhea + <b>D</b>ementia + <b>D</b>eath.', cls:'warn' },
      { t: '<b>Hartnup disease</b>: defective neutral AA transporter → can\'t absorb tryptophan → pellagra.', cls:'warn' },
      { t: '<b>Carcinoid syndrome</b>: tryptophan diverted to serotonin → pellagra (plus flushing, diarrhea, right-sided heart valves).', cls:'warn' },
      { t: '<b>Isoniazid</b> depletes B6 → can\'t convert trp → niacin → pellagra. Co-administer B6.', cls:'drug' },
      { t: '<b>Niacin as a drug</b>: ↓ LDL + ↓ TG + ↑ HDL. SE: flushing (PG-mediated) — pre-treat with aspirin.', cls:'drug' }
    ]
  },
  B5: {
    name: 'B5 — Pantothenate (CoA)',
    role: 'Component of Coenzyme A + ACP of fatty acid synthase',
    why: 'Found in <b>Coenzyme A</b> and the <b>ACP arm of FA synthase</b>. Used in every acyl-transfer reaction.',
    pearls: [
      { t: 'Used by basically every acyl-CoA enzyme: PDH, αKG-DH, β-ox, FA synthesis, ketogenesis, cholesterol synth.' },
      { t: 'Deficiency is <b>rare</b>; if it happens: dermatitis + enteritis + alopecia + adrenal insufficiency.', cls:'warn' },
      { t: '"<b>Penta</b>nthenate" → vitamin B<b>5</b>.', cls:'mnemonic' }
    ]
  },
  B6: {
    name: 'B6 — Pyridoxine (PLP)',
    role: 'Transamination, decarboxylation, glycogen phosphorylase, heme synth',
    why: 'Cofactor for <b>ALL transaminases</b>, glycogen phosphorylase, and several biosynthesis enzymes (heme, neurotransmitters, niacin from trp).',
    pearls: [
      { t: '<b>"B6 = Synthesis"</b> — needed to MAKE heme (ALA synthase), neurotransmitters (dopamine via DDC, GABA via GAD, serotonin), and niacin from trp.', cls:'mnemonic' },
      { t: 'Used by: ALT, AST, all transaminases, glycogen phosphorylase, cystathionine synthase, ALA synthase.' },
      { t: '<b>Isoniazid (INH)</b> depletes B6 → peripheral neuropathy + sideroblastic anemia. <i>Always co-give B6</i>.', cls:'drug' },
      { t: '<b>INH overdose</b> → seizures refractory to benzos. Antidote: high-dose B6.', cls:'drug' },
      { t: 'Deficiency: <b>peripheral neuropathy</b>, convulsions in infants, sideroblastic anemia, cheilosis, glossitis.', cls:'warn' }
    ]
  },
  B7: {
    name: 'B7 — Biotin',
    role: 'Carboxylation — adds CO₂',
    why: '<b>Carries CO₂</b> for carboxylase enzymes.',
    pearls: [
      { t: 'The <b>4 carboxylases</b>: <b>P</b>yruvate carboxylase (→ OAA), <b>A</b>cetyl-CoA carboxylase (→ malonyl-CoA), <b>P</b>ropionyl-CoA carboxylase (odd-chain FA), <b>M</b>ethylcrotonyl-CoA carboxylase (leucine).', cls:'mnemonic' },
      { t: 'Mnemonic: <b>"Bio-CO₂"</b> — biotin carries CO₂.', cls:'mnemonic' },
      { t: '<b>Raw egg whites</b> contain <b>avidin</b>, which binds biotin tightly → deficiency in raw-egg eaters.', cls:'warn' },
      { t: 'Long-term antibiotics also cause deficiency (kill gut flora that make biotin).', cls:'drug' },
      { t: 'Deficiency: dermatitis + alopecia + enteritis (mimics zinc deficiency).' }
    ]
  },
  B9: {
    name: 'B9 — Folate (THF)',
    role: '1-carbon transfers + DNA synthesis',
    why: 'Carries <b>1-carbon units</b> as tetrahydrofolate (THF). Required for <b>DNA synthesis</b>.',
    pearls: [
      { t: '<b>Megaloblastic macrocytic anemia + hypersegmented neutrophils</b>. <i>NO neuro deficits</i> (key difference from B12).', cls:'warn' },
      { t: 'Labs: ↑ homocysteine, <b>NORMAL methylmalonic acid (MMA)</b>. The MMA is what separates folate from B12 deficiency.', cls:'mnemonic' },
      { t: '<b>Pregnancy → neural tube defects</b> (spina bifida, anencephaly). Supplement <i>before</i> conception.', cls:'warn' },
      { t: '<b>Drug-induced</b>: methotrexate, trimethoprim, phenytoin, sulfasalazine, alcohol.', cls:'drug' },
      { t: 'Stores last ~3 months (vs B12 ~3 years) → folate deficiency appears faster.' }
    ]
  },
  B12: {
    name: 'B12 — Cobalamin',
    role: 'Methionine synthase + methylmalonyl-CoA mutase',
    why: 'Cofactor for <b>methionine synthase</b> (with folate) and <b>methylmalonyl-CoA mutase</b> (odd-chain FAs + branched AAs → succinyl-CoA).',
    pearls: [
      { t: '<b>Megaloblastic anemia + NEURO</b> — subacute combined degeneration (dorsal columns, lateral corticospinal, spinocerebellar tracts).', cls:'warn' },
      { t: 'Labs: ↑ homocysteine <i>AND</i> ↑ <b>methylmalonic acid (MMA)</b>. ↑MMA separates B12 from folate.', cls:'mnemonic' },
      { t: '<b>Pernicious anemia</b>: autoimmune destruction of parietal cells → no intrinsic factor → no B12 absorption.', cls:'warn' },
      { t: 'Other causes: terminal ileum disease (Crohn\'s, surgery), <i>Diphyllobothrium latum</i> (fish tapeworm), strict vegan diet, chronic PPI/H2 blockers.', cls:'warn' },
      { t: 'Stores last ~3 years in the liver — deficiency develops slowly.' },
      { t: '<b>Never give folate alone if B12 might be low</b> — masks anemia while neuro damage progresses.', cls:'drug' }
    ]
  },
  lipoic: {
    name: 'Lipoic acid',
    role: 'α-keto acid DH complexes (PDH, αKG-DH, BCKDH)',
    why: 'Cofactor for the <b>α-keto acid dehydrogenase complexes</b>: PDH, αKG-DH, BCKDH.',
    pearls: [
      { t: '<b>Arsenic poisoning</b> binds lipoic acid → blocks PDH + αKG-DH + BCKDH simultaneously → lactic acidosis + neuro toxicity.', cls:'warn' },
      { t: 'Arsenic Sx: garlic breath, rice-water stools, hyperpigmentation, Mees lines on nails.', cls:'warn' },
      { t: 'PDH cofactor mnemonic: <b>"Tender Loving Care For Nancy"</b> = <b>T</b>PP, <b>L</b>ipoic, <b>C</b>oA, <b>F</b>AD, <b>N</b>AD.', cls:'mnemonic' },
      { t: 'Not strictly a vitamin — but tested alongside the B vitamins for these enzymes.' }
    ]
  }
};

const CLIN_PATHWAY = {
  glyco: {
    why: 'Universal energy pathway — every cell. RBCs and renal medulla do ONLY this.',
    pearls: [
      { t: '<b>Net per glucose</b>: 2 ATP + 2 NADH + 2 pyruvate.' },
      { t: '<b>★ PFK-1</b> rate-limiting. Insulin ↑ via F-2,6-BP; glucagon ↓ via F-2,6-BP.' },
      { t: '<b>Hexokinase</b> (everywhere, low Km, inhibited by G6P) vs <b>Glucokinase</b> (liver/β-cell, high Km, induced by insulin).', cls:'mnemonic' },
      { t: 'Substrate-level phos at <i>PGK</i> and <i>PK</i>.' },
      { t: '<b>Pyruvate kinase deficiency</b> → chronic hemolytic anemia (2nd most common after G6PDH).', cls:'warn' },
      { t: 'Inhibitors: <i>arsenic</i> (G3P-DH/lipoic), <i>fluoride</i> (enolase).', cls:'drug' },
    ]
  },
  gng: {
    why: 'Liver (and kidney) reverse glycolysis during fasting to maintain blood glucose. Brain depends on this.',
    pearls: [
      { t: '<b>4 bypass enzymes</b>: pyruvate carboxylase (mitochondrial, biotin) → PEPCK (cytosolic, GTP) → F-1,6-BPase ★ → G6Pase (ER, liver/kidney only).' },
      { t: '<b>Acetyl-CoA</b> activates pyruvate carboxylase (anaplerosis when TCA full).' },
      { t: 'Substrates: lactate (Cori), alanine (Cahill), glycerol, glucogenic AAs. <i>Acetyl-CoA cannot</i> → fats don\'t become glucose.', cls:'warn' },
      { t: 'Glucagon ↑ via cAMP/PKA + ↑PEPCK transcription. Cortisol also ↑ (Cushing → hyperglycemia).' },
      { t: '<b>Von Gierke (GSD I)</b>: G6Pase deficiency → severe hypoglycemia + hepatomegaly.', cls:'warn' },
    ]
  },
  tca: {
    why: 'Universal oxidation of acetyl-CoA → 3 NADH + 1 FADH₂ + 1 GTP. Also a biosynthetic hub.',
    pearls: [
      { t: '<b>Per acetyl-CoA</b>: 3 NADH + 1 FADH₂ + 1 GTP + 2 CO₂.' },
      { t: '<b>Citrate synthase</b> and <b>isocitrate DH</b> are the main regulated steps.' },
      { t: '<b>Anaplerosis</b>: pyruvate carboxylase refills OAA when low.' },
      { t: '<b>Cataplerosis</b>: citrate → FA synth, succinyl-CoA → heme, α-KG → AAs.' },
      { t: '<i>Fluoroacetate</i> (rat poison) → fluorocitrate blocks aconitase.', cls:'drug' },
      { t: 'AST/ALT use TCA intermediates (OAA, α-KG) — that\'s why they rise in liver injury.' },
    ]
  },
  etc: {
    why: 'Proton gradient from complexes I/III/IV → ATP synthase makes most of the cell\'s ATP.',
    pearls: [
      { t: '<b>Complex II = SDH</b>, the only TCA enzyme in the membrane. Doesn\'t pump H⁺ → FADH₂ ≈ 1.5 ATP, NADH ≈ 2.5 ATP.', cls:'mnemonic' },
      { t: '<b>Complex IV inhibitors</b>: <i>cyanide, CO, H₂S</i>. CN tx: hydroxocobalamin, nitrites, thiosulfate.', cls:'warn' },
      { t: '<b>ATP synthase inhibitor</b>: oligomycin.', cls:'drug' },
      { t: '<b>Uncouplers</b> (collapse gradient → heat, no ATP): 2,4-DNP, aspirin OD, thermogenin (brown fat).', cls:'drug' },
      { t: '<b>Aspirin OD</b>: respiratory alkalosis early → anion-gap metabolic acidosis. Mixed disturbance.', cls:'warn' },
    ]
  },
  ppp: {
    why: 'NADPH (biosynthesis + oxidative defense) and ribose-5-P (nucleotides).',
    pearls: [
      { t: '<b>G6PDH ★</b> rate-limiting. Oxidative phase irreversible.' },
      { t: 'NADPH uses: FA/chol synth, glutathione regen (RBC), CYP450, NADPH oxidase (neutrophils).' },
      { t: '<b>G6PDH deficiency</b>: X-linked, most common enzyme defect worldwide.', cls:'warn' },
      { t: 'Triggers: fava beans, primaquine, sulfa, dapsone, infection. Smear: Heinz bodies + bite cells.', cls:'mnemonic' },
      { t: '<b>CGD</b> (chronic granulomatous disease): NADPH oxidase defect → recurrent <i>catalase⁺</i> infections (Staph, Aspergillus).', cls:'warn' },
      { t: '<i>Transketolase</i> activity is the marker for thiamine (B1) status.' },
    ]
  },
  glyg: {
    why: 'Short-term glucose storage. Liver feeds blood; muscle feeds itself.',
    pearls: [
      { t: '<b>Glycogen phosphorylase ★</b> breakdown. Activated by glucagon (liver), AMP + epi (muscle).' },
      { t: '<b>Glycogen synthase ★</b> synthesis. Activated by insulin (dephosphorylation).' },
      { t: '<b>GSD I (Von Gierke)</b>: G6Pase — severe hypoglyc + hepatomegaly + lactic acidosis + hyperuricemia.', cls:'warn' },
      { t: '<b>GSD II (Pompe)</b>: lysosomal α-glucosidase — <i>cardiomegaly</i>, infant death. "Pompe Pumps your heart."', cls:'mnemonic' },
      { t: '<b>GSD III (Cori)</b>: debranching — mild, normal lactate.' },
      { t: '<b>GSD V (McArdle)</b>: muscle phosphorylase — exercise cramps, no lactate, "second wind."' },
    ]
  },
  fas: {
    why: 'Builds storage fat from excess carbs. Cytosolic.',
    pearls: [
      { t: 'Acetyl-CoA must leave mitochondria via <b>citrate shuttle</b> (ATP-citrate lyase).' },
      { t: '<b>ACC ★</b> rate-limiting. Biotin. ↑ by citrate/insulin, ↓ by palmitoyl-CoA, glucagon, AMPK.' },
      { t: '<b>FA synthase</b> makes palmitate (C16) using ~14 NADPH from PPP.' },
      { t: '<b>Reciprocal regulation</b>: malonyl-CoA inhibits CPT-1 → β-ox off when FA synth on.', cls:'mnemonic' },
    ]
  },
  box: {
    why: 'Burns fatty acids for energy. Massive ATP yield per FA.',
    pearls: [
      { t: 'Activation in cytosol (acyl-CoA synthetase). Long chains need <b>CPT-1 ★</b> to enter mitochondria.' },
      { t: 'Each spiral: −2C + 1 NADH + 1 FADH₂ + 1 acetyl-CoA.' },
      { t: '<b>MCAD deficiency</b>: most common FA ox disorder. <i>Hypoketotic hypoglycemia</i> + dicarboxylic aciduria + SIDS risk.', cls:'warn' },
      { t: '<b>Primary carnitine deficiency</b>: muscle weakness + cardiomyopathy + hypoketotic hypoglycemia.', cls:'warn' },
      { t: 'Odd-chain → propionyl-CoA → methylmalonyl-CoA → succinyl-CoA (B12 step).' },
    ]
  },
  keto: {
    why: 'Alt fuel during fasting/DKA. Brain switches to ketones after ~3 days starvation.',
    pearls: [
      { t: '<b>HMG-CoA synthase ★</b> (mitochondrial).' },
      { t: 'Ketones: acetoacetate, β-hydroxybutyrate (major), acetone (volatile → fruity breath).' },
      { t: '<b>Urine dipstick misses β-OHB</b> — the dominant DKA ketone.', cls:'warn' },
      { t: '<b>Liver makes them but can\'t use them</b> (no thiophorase/SCOT).', cls:'mnemonic' },
      { t: '<b>DKA</b>: ↑glucose + ↑ketones + anion gap acidosis + Kussmaul + fruity breath.', cls:'warn' },
      { t: '<b>Alcoholic ketoacidosis</b>: low/normal glucose, ↑↑β-OHB.', cls:'warn' },
    ]
  },
  chol: {
    why: 'Membranes, all steroid hormones, bile acids, vit D. Hot drug target.',
    pearls: [
      { t: '<b>HMG-CoA reductase ★</b> — uses 2 NADPH.' },
      { t: '<b>Statins</b> inhibit → ↓LDL + ↑LDLR.', cls:'drug' },
      { t: 'Side effects: myopathy/rhabdo (worse with fibrates, niacin, grapefruit), ↑LFTs.', cls:'warn' },
      { t: 'Other drugs: PCSK9 inhibitors (↑LDLR), ezetimibe (↓absorption), fibrates (PPARα → ↓TG).', cls:'drug' },
      { t: '<b>Familial hypercholesterolemia</b>: LDLR defect → xanthomas + early MI.', cls:'warn' },
    ]
  },
  urea: {
    why: 'Detoxifies ammonia from AA breakdown. Liver only.',
    pearls: [
      { t: '<b>CPS-I ★</b> rate-limiting; needs N-acetylglutamate.' },
      { t: '<b>OTC deficiency</b> (X-linked, most common UCD): ↑NH₃ + ↑orotic acid, no ↑BUN.', cls:'warn' },
      { t: '<b>CPS-I deficiency</b>: ↑NH₃, no orotic acid. (Use orotic acid to differentiate.)', cls:'mnemonic' },
      { t: '<b>2 N atoms</b>: 1 from NH₃ (CPS-I), 1 from aspartate (argininosuccinate synthetase).' },
      { t: 'Fumarate output → re-enters TCA.' },
      { t: 'Hyperammonemia tx: low protein + lactulose + rifaximin + benzoate/phenylacetate.', cls:'drug' },
    ]
  },
  aa: {
    why: 'Transamination links protein catabolism to central metabolism.',
    pearls: [
      { t: 'All transaminases use <b>B6 (PLP)</b>.' },
      { t: '<b>ALT</b>: alanine ↔ pyruvate (Cahill; liver-specific marker).' },
      { t: '<b>AST</b>: aspartate ↔ OAA (also in heart/muscle; less specific).' },
      { t: '<i>AST > ALT (>2)</i> → alcoholic. <i>ALT > AST</i> → viral.', cls:'mnemonic' },
      { t: '<b>GDH</b> releases free NH₃ from glutamate → urea cycle.' },
      { t: '<b>Glutamine synthetase</b> (muscle, brain): NH₃ trapping for safe transport.' },
    ]
  },
  heme: {
    why: 'Hemoglobin + cytochromes + catalase. Defects = porphyrias + sideroblastic anemias.',
    pearls: [
      { t: '<b>ALA synthase ★</b> rate-limiting; uses B6; succinyl-CoA + glycine → δ-ALA.' },
      { t: '<b>Lead poisoning</b>: inhibits ALA dehydratase + ferrochelatase → microcytic anemia + basophilic stippling + abdominal pain.', cls:'warn' },
      { t: '<b>AIP</b> (PBG deaminase deficiency): abdominal/neuro/psych; ↑ALA + ↑PBG; no skin. Tx: hemin + glucose.', cls:'warn' },
      { t: '<b>PCT</b> (UROD deficiency): most common porphyria; blistering photosensitivity.', cls:'warn' },
      { t: '<b>Sideroblastic anemia</b>: ringed sideroblasts; B6 deficiency, lead, alcohol, INH, X-linked ALAS2.', cls:'mnemonic' },
    ]
  },
};
