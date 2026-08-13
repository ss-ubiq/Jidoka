/**
 * SEO keyword landing pages — the organic-search layer (§59, §60).
 *
 * One page per high-demand generic search term, chosen from REAL demand data
 * (JIDOKA's internal sales history). This is how large component platforms rank for
 * generic words: a dedicated, content-rich, honest page per component type.
 *
 * Content rules: general, verifiable engineering knowledge only — materials, types and
 * selection factors an engineer would recognise. No invented JIDOKA specs, stock or
 * certifications (§3). Every page converts to RFQ (§67).
 */

export type KeywordFaq = { q: string; a: string };
export type KeywordType = { name: string; desc: string };

export type KeywordPage = {
  slug: string;
  term: string; // the H1 / generic search term
  searchTitle: string; // <title> shown on Google
  metaDescription: string;
  keywords: string[];
  intro: string;
  whatIs: string;
  types: KeywordType[];
  materials?: string;
  selection: string[];
  faqs: KeywordFaq[];
  familyId: string;
  related: string[]; // slugs of related keyword pages
};

export const keywordPages: KeywordPage[] = [
  {
    slug: "ejector-pins",
    term: "Ejector Pins",
    searchTitle: "Ejector Pins — SKD61 & SKH51 Ejector Pin Supplier India",
    metaDescription:
      "Straight, precision and rectangular ejector pins in SKD61 and SKH51 for plastic moulds and die casting. Request a quote from JIDOKA — ejector pin supplier for tool rooms across India.",
    keywords: ["ejector pins", "ejector pin supplier India", "SKD61 ejector pins", "SKH51 ejector pins", "straight ejector pins", "precision ejector pins", "mould ejector pins", "ejector pin price"],
    intro:
      "Ejector pins push the finished part off the core when a plastic mould or die opens. They cycle millions of times against heat and friction, so material, hardness and fit decide tool life.",
    whatIs:
      "An ejector pin is a hardened, precision-ground pin mounted in the ejector plate of a mould or die. When the tool opens, the ejector system drives the pins forward to release the moulded part cleanly. Pins run in fitted holes, so diameter tolerance and surface finish directly affect flash, galling and maintenance intervals.",
    types: [
      { name: "Straight ejector pins", desc: "The standard form — constant diameter with a cylindrical head. The workhorse for most plastic moulds." },
      { name: "Precision ejector pins", desc: "Tighter diameter tolerance and finer surface finish for close-fitting holes and low-flash moulding." },
      { name: "Shouldered / stepped pins", desc: "A larger-diameter body stepped to a thin working end — stiffer than a thin straight pin of the same working diameter." },
      { name: "Rectangular (blade) ejector pins", desc: "Flat working section for ejecting thin ribs and slots where a round pin will not fit." },
      { name: "Ejector sleeves", desc: "Hollow pins that eject around a core pin, used for bosses and circular features." },
    ],
    materials:
      "Common grades are SKD61 (H13 equivalent hot-work tool steel, typically nitrided for wear) and SKH51 (M2 high-speed steel) for higher temperature and abrasive resins. Surface treatments such as nitriding improve wear and galling resistance.",
    selection: [
      "Diameter and overall length — matched to the ejector hole with the correct fit.",
      "Material and hardness — SKD61 for general moulding, SKH51 for demanding or abrasive applications.",
      "Head type — cylindrical head standard; stepped or blade forms for special geometry.",
      "Surface treatment — nitrided pins for longer life in high-cycle tools.",
      "Quantity and repeatability — production tools consume pins as maintenance items.",
    ],
    faqs: [
      { q: "What material are ejector pins made of?", a: "Most ejector pins are SKD61 hot-work tool steel (H13 equivalent), usually nitrided for wear resistance. SKH51 (M2 high-speed steel) pins are used for higher temperatures and abrasive, glass-filled resins." },
      { q: "What is the difference between straight and precision ejector pins?", a: "Both are constant-diameter pins; precision ejector pins are ground to a tighter diameter tolerance with a finer finish, for close-fitting holes where flash and gas venting must be controlled." },
      { q: "When should I use a rectangular (blade) ejector pin?", a: "When the part has thin ribs or narrow slots that a round pin cannot reach — the flat blade section ejects along the rib without marking the part face." },
      { q: "How do I order ejector pins from JIDOKA?", a: "Send the diameter, length, material and quantity — or simply your existing part number or a drawing — through the Request a Quote form and our engineering team responds with a quotation." },
    ],
    familyId: "mould-and-die",
    related: ["punches", "button-dies", "leader-pins", "die-springs"],
  },
  {
    slug: "punches",
    term: "Punches",
    searchTitle: "Punches — Precision Press Tool Punches Supplier India",
    metaDescription:
      "Precision punches for press tools and dies — straight, jector, center-hole and coated punches. Send your specification or drawing to JIDOKA for a quotation.",
    keywords: ["punches", "press tool punches", "jector punches", "punch supplier India", "TiCN coated punches", "piercing punches", "die punches"],
    intro:
      "Punches do the cutting and forming in press tools. Edge life, shank accuracy and coating decide how many strokes a tool runs between regrinds.",
    whatIs:
      "A punch is a hardened cutting or forming pin held in the punch plate of a press tool. Working with a matching die button, it pierces, blanks or forms sheet material each press stroke. Punches are consumable precision parts — bought repeatedly across a tool's life.",
    types: [
      { name: "Straight punches", desc: "Constant-diameter body with a cylindrical head — general piercing work." },
      { name: "Shoulder (shank) punches", desc: "Reduced working point on a stronger shank for small hole diameters." },
      { name: "Jector punches", desc: "Built-in spring-loaded ejector pin prevents slugs pulling back up with the punch." },
      { name: "Punches with center hole", desc: "Air-relief hole through the punch face to stop slug vacuum adhesion." },
      { name: "Coated punches (TiCN etc.)", desc: "Hard coatings extend edge life in high-volume or stainless work." },
    ],
    materials:
      "Typically SKD11 (D2 equivalent) cold-work tool steel, SKH51 high-speed steel for tougher duty, and carbide for very high volume production. TiCN and similar coatings reduce galling and extend regrind intervals.",
    selection: [
      "Point diameter and shank diameter with required tolerance.",
      "Overall length and head style to suit the punch plate.",
      "Material and coating for the sheet material and production volume.",
      "Jector or center-hole options where slug pulling is a problem.",
      "Matching die button clearance for the sheet thickness.",
    ],
    faqs: [
      { q: "What is a jector punch?", a: "A jector punch has a small spring-loaded pin in its face that pushes the cut slug into the die, preventing the slug from riding back up with the punch — a common cause of double-hits and tool damage." },
      { q: "Which punch material should I choose?", a: "SKD11 suits general press work; SKH51 gives more toughness for interrupted or heavier cuts; carbide and coated punches pay off in high-volume production where regrind downtime matters." },
      { q: "Can JIDOKA supply punches to my drawing or existing part number?", a: "Yes — send the drawing, specification or the part number you currently buy through the Request a Quote or Find an Alternative form and our team will review and quote it." },
    ],
    familyId: "mould-and-die",
    related: ["button-dies", "ejector-pins", "locating-pins"],
  },
  {
    slug: "button-dies",
    term: "Button Dies",
    searchTitle: "Button Dies — Die Buttons & Dowel-Slot Dies Supplier India",
    metaDescription:
      "Button dies (die buttons) including dowel-slot and headed types for press tools. Pair with precision punches. Request a quotation from JIDOKA.",
    keywords: ["button dies", "die buttons", "dowel slot button dies", "press tool die buttons", "die button supplier India"],
    intro:
      "Button dies are the hardened female counterparts to punches — the slug passes through them each stroke. Correct clearance and land geometry control burr height and edge life.",
    whatIs:
      "A button die (die button) is a hardened bushing pressed into the die plate. The punch enters it to shear the sheet; the cut slug falls through its relieved bore. Because they wear with every stroke, button dies are standard replaceable parts ordered by bore, body diameter and type.",
    types: [
      { name: "Plain (headless) button dies", desc: "Press-fit cylindrical body — the compact standard form." },
      { name: "Headed button dies", desc: "Flanged head takes the press-out load and fixes axial position." },
      { name: "Dowel-slot button dies", desc: "Slot in the body engages a dowel to lock orientation — essential for shaped (non-round) holes." },
      { name: "Tapered-relief types", desc: "Straight land with taper relief below for clean slug discharge." },
    ],
    materials:
      "Commonly SKD11 (D2 equivalent) and carbide for high-volume work. The cutting clearance between punch and die button is chosen from sheet material and thickness — typically a percentage of stock thickness per side.",
    selection: [
      "Bore (hole) size and shape, with punch clearance for the sheet.",
      "Body diameter and length to suit the die plate pocket.",
      "Headed vs headless, and dowel-slot where orientation must be fixed.",
      "Material/coating matched to volume.",
    ],
    faqs: [
      { q: "What is a dowel-slot button die used for?", a: "The dowel slot locks the die button's rotation. It is required when the hole shape is not round (oblong, D-shaped, keyed), so the die stays aligned with the punch." },
      { q: "How is punch-to-die clearance chosen?", a: "As a percentage of sheet thickness per side, depending on the material — softer materials use smaller clearance, harder or thicker sheet uses more. Correct clearance minimises burr and maximises edge life." },
    ],
    familyId: "mould-and-die",
    related: ["punches", "ejector-pins", "locating-pins"],
  },
  {
    slug: "locating-pins",
    term: "Locating Pins",
    searchTitle: "Locating Pins for Jigs & Fixtures — Supplier India",
    metaDescription:
      "Locating pins for jigs and fixtures — round and diamond, shouldered and tapered types in hardened steel. Request a quote from JIDOKA.",
    keywords: ["locating pins", "locating pins for jigs", "diamond locating pins", "fixture locating pins", "locating pin supplier India"],
    intro:
      "Locating pins fix a workpiece in a repeatable position on a jig or fixture. The round-plus-diamond pair is the standard method of constraining a part without over-constraint.",
    whatIs:
      "A locating pin is a hardened, precision-ground pin that engages a hole in the workpiece to define its position. Fixtures typically use one round pin (primary location) and one diamond (relieved) pin to absorb hole-pitch tolerance — giving exact, repeatable placement every load.",
    types: [
      { name: "Round locating pins", desc: "Full-diameter engagement — the primary datum pin." },
      { name: "Diamond (relieved) pins", desc: "Contact on two flats only, absorbing centre-distance tolerance without play." },
      { name: "Shouldered locating pins", desc: "Flange sets seating height and takes insertion load." },
      { name: "Tapered / bullet-nose pins", desc: "Lead-in taper for fast, guided part loading." },
    ],
    materials: "Typically hardened SUJ2 bearing steel or SKD11, ground to tight diameter tolerance; some types supplied with press-fit or threaded mounting.",
    selection: [
      "Workpiece hole diameter and the fit class required.",
      "Round + diamond pairing for two-hole location.",
      "Mounting style — press-fit, shoulder seated, or threaded.",
      "Height of the working land and lead-in form for loading.",
    ],
    faqs: [
      { q: "Why use one round and one diamond locating pin?", a: "Two round pins over-constrain the part: any hole-pitch variation makes loading tight or impossible. The diamond pin locates in one direction only, absorbing pitch tolerance while still preventing rotation." },
      { q: "Can JIDOKA supply locating pins to a specific fit?", a: "Send the hole size, fit or the drawing through Request a Quote and our engineering team will confirm the matching pin specification." },
    ],
    familyId: "mould-and-die",
    related: ["guide-pins-and-bushes", "leader-pins", "punches"],
  },
  {
    slug: "leader-pins",
    term: "Leader Pins",
    searchTitle: "Leader Pins & Guide Pillars for Die Sets — Supplier India",
    metaDescription:
      "Leader pins (guide pillars) and matching bushes for press die sets and mould bases — hardened, ground alignment components. Get a quotation from JIDOKA.",
    keywords: ["leader pins", "guide pillars", "die set guide pins", "mould guide pillar", "leader pin supplier India"],
    intro:
      "Leader pins keep the two halves of a die set or mould base aligned through every stroke. Alignment accuracy here protects punches, cavities and product quality.",
    whatIs:
      "A leader pin (guide pillar) is a hardened, precision-ground pin fixed in one half of a die set that runs in a matching guide bush in the other half. Together they maintain punch-to-die alignment during operation and protect the tool during handling and setting.",
    types: [
      { name: "Straight leader pins", desc: "Plain ground pillar pressed into the die base — the standard form." },
      { name: "Shouldered leader pins", desc: "Stepped seat gives positive axial location and easier fitting." },
      { name: "Demountable types", desc: "Removable pins simplify maintenance on larger die sets." },
      { name: "Ball-cage guide sets", desc: "Pillar running in a ball cage and bush for low-friction, high-precision guiding." },
    ],
    materials: "Hardened SUJ2 bearing steel, ground and lapped; used with plain bronze/steel bushes or ball cages depending on speed and precision.",
    selection: [
      "Pin diameter and length for the die set size and stroke.",
      "Plain bush or ball-cage guiding by speed and precision requirement.",
      "Straight or shouldered mounting to suit the plate design.",
      "Matched pin + bush pairs for correct running clearance.",
    ],
    faqs: [
      { q: "What is the difference between plain and ball-cage guide pillars?", a: "Plain pillars slide directly in a bush — simple and rigid. Ball-cage sets run on recirculating balls, giving lower friction and very high alignment accuracy for fast or precision tools." },
      { q: "Are leader pins supplied with bushes?", a: "Pins and bushes are made as matched pairs. Tell us the die set details and we will quote the correct pin-and-bush combination." },
    ],
    familyId: "mould-and-die",
    related: ["guide-pins-and-bushes", "ejector-pins", "locating-pins"],
  },
  {
    slug: "guide-pins-and-bushes",
    term: "Guide Pins & Guide Bushes",
    searchTitle: "Guide Pins & Guide Bushes for Moulds — Supplier India",
    metaDescription:
      "Mould guide pins and guide bushes — straight and shouldered types, plain and oil-groove bushes. Matched alignment components from JIDOKA. Request a quote.",
    keywords: ["guide pins", "guide bushes", "mould guide pin", "guide bush supplier India", "guide pillar and bush"],
    intro:
      "Guide pins and bushes align mould halves at every close. They are the first components to feel misalignment — and the cheapest place to fix it.",
    whatIs:
      "Guide pins (pillars) mounted in one mould half run inside guide bushes in the other, aligning core and cavity before the leader components of the press or machine take over. Worn pins and bushes show up as flash, witness lines and accelerated wear elsewhere in the tool — replacing them is routine maintenance.",
    types: [
      { name: "Straight guide pins", desc: "Plain press-fit pillar, the standard mould form." },
      { name: "Shouldered guide pins", desc: "Positive axial seating for heavier tools." },
      { name: "Plain guide bushes", desc: "Hardened ground bush, press-fitted, running directly on the pin." },
      { name: "Oil-groove / self-lubricating bushes", desc: "Lubricant grooves or embedded solid lubricant for reduced maintenance." },
    ],
    materials: "Hardened SUJ2 or case-hardened steel, ground; bushes also in bronze with solid lubricant for oil-free running.",
    selection: [
      "Diameter and length for the mould base standard being followed.",
      "Straight vs shouldered mounting.",
      "Bush type — plain, oil-groove or self-lubricating.",
      "Matched clearance between pin and bush.",
    ],
    faqs: [
      { q: "When should guide pins and bushes be replaced?", a: "When alignment marks, flash or visible wear bands appear. Because they are standard parts, replacing pins and bushes at maintenance intervals is far cheaper than the cavity damage misalignment causes." },
      { q: "Do you supply self-lubricating guide bushes?", a: "Yes — oil-free and oil-groove bush options are available on enquiry; send the sizes through Request a Quote." },
    ],
    familyId: "mould-and-die",
    related: ["leader-pins", "oil-free-bushings", "ejector-pins"],
  },
  {
    slug: "coil-springs",
    term: "Coil Springs",
    searchTitle: "Coil Springs — Regular Load Compression Springs Supplier India",
    metaDescription:
      "Coil compression springs across light to heavy load classes for moulds, dies, fixtures and machines. Colour-coded load ratings. Request a quote from JIDOKA.",
    keywords: ["coil springs", "compression springs", "regular load coil springs", "coil spring supplier India", "mould springs"],
    intro:
      "Coil springs return plates, strip parts and hold pressure in tools and machines. Standardised load classes make replacement fast — if you match the class correctly.",
    whatIs:
      "A coil (compression) spring resists being compressed and returns stored force as it extends. Industrial standard ranges are organised by outside diameter, free length and load class, usually colour-coded, so a worn spring can be swapped for an identical rating without recalculation.",
    types: [
      { name: "Light load", desc: "Longer deflection at lower force — gentle return duties." },
      { name: "Medium / regular load", desc: "The general-purpose class covering most tool and machine duties." },
      { name: "Heavy / extra-heavy load", desc: "High force in the same envelope, at reduced allowable deflection." },
      { name: "Wire springs", desc: "Round-wire general springs in wide size ranges for machines and fixtures." },
    ],
    materials: "Typically oil-tempered spring steel (e.g. SWOSC-V / piano wire grades); ends closed and ground for square seating.",
    selection: [
      "Hole (OD) and rod (ID) sizes the spring must work within.",
      "Free length and required working deflection — stay inside the class's allowable %.",
      "Load class by colour code or required force at working height.",
      "Cycle life — reduce working deflection for long-life duties.",
    ],
    faqs: [
      { q: "What do coil spring colours mean?", a: "Colours identify the load class (light, medium, heavy, extra-heavy) within standard spring ranges — the same physical size is available in several force ratings, and the colour tells them apart." },
      { q: "How much can a coil spring be compressed?", a: "Each load class has a maximum allowable deflection as a percentage of free length (heavier classes allow less). Staying below it — further below for high-cycle duty — is what determines spring life." },
    ],
    familyId: "springs-and-force",
    related: ["die-springs", "gas-springs", "ejector-pins"],
  },
  {
    slug: "die-springs",
    term: "Die Springs",
    searchTitle: "Die Springs — Rectangular Wire Press Die Springs Supplier India",
    metaDescription:
      "Rectangular-wire die springs in standard colour-coded load ratings for press tools and moulds. Long-life force components from JIDOKA. Request a quote.",
    keywords: ["die springs", "rectangular wire springs", "press die springs", "die spring supplier India", "colour coded die springs"],
    intro:
      "Die springs pack maximum force into a standard hole — rectangular wire and controlled stress make them the force standard in press tools.",
    whatIs:
      "A die spring is a heavy-duty compression spring wound from rectangular-section wire, delivering far more force than a round-wire spring of the same envelope. They are standardised by hole diameter, rod diameter and free length, with internationally recognised colour codes for load rating.",
    types: [
      { name: "Light / medium load die springs", desc: "Higher allowable deflection for stripper and return duties." },
      { name: "Heavy load die springs", desc: "Standard press-tool force class." },
      { name: "Extra heavy load die springs", desc: "Maximum force, minimum deflection — clamping and forming pressure." },
    ],
    materials: "Chrome-alloy spring steel, rectangular section, shot-peened; guided on a rod or in a hole to prevent buckling.",
    selection: [
      "Hole diameter and rod diameter the spring runs on.",
      "Free length and working stroke — respect the class's max deflection.",
      "Load class (colour) for the required force.",
      "Guided installation and even pre-load across multiple springs.",
    ],
    faqs: [
      { q: "Why use a die spring instead of a normal coil spring?", a: "Rectangular wire fills the space better, so a die spring gives substantially higher force from the same hole and allows harder duty cycles — the standard choice inside press tools." },
      { q: "How long do die springs last?", a: "Life depends on the percentage of maximum deflection used per stroke: running at reduced deflection multiplies life. For long production runs springs are selected a class heavier and run lighter." },
    ],
    familyId: "springs-and-force",
    related: ["coil-springs", "gas-springs", "punches"],
  },
  {
    slug: "gas-springs",
    term: "Gas Springs",
    searchTitle: "Gas Springs for Press Tools & Moulds — Supplier India",
    metaDescription:
      "Nitrogen gas springs delivering high, near-constant force from the first millimetre of stroke — for forming, stripping and clamping in dies. Request a quote from JIDOKA.",
    keywords: ["gas springs", "nitrogen gas springs", "die gas springs", "gas spring supplier India", "gas springs for press tools"],
    intro:
      "Gas springs deliver full force from the very start of the stroke — something no mechanical spring can do — which is why modern forming dies rely on them.",
    whatIs:
      "A gas spring is a sealed cylinder charged with high-pressure nitrogen. Unlike a coil spring, force is high at initial contact and rises only modestly over stroke, giving a flatter force curve, and much higher force per unit of space. In dies they power strippers, pads and cam returns.",
    types: [
      { name: "Standard gas springs", desc: "Self-contained charged cylinders in standard body diameters and strokes." },
      { name: "Compact / mini types", desc: "Short bodies for space-limited pads." },
      { name: "Linked systems", desc: "Multiple cylinders hosed to a control panel for equalised force and monitoring." },
    ],
    selection: [
      "Initial force required and total at end of stroke.",
      "Stroke length and closed height available in the tool.",
      "Mounting style and port position.",
      "Cycle rate and temperature — affects service interval.",
    ],
    faqs: [
      { q: "What is the advantage of a gas spring over a die spring?", a: "A gas spring provides its full rated force from the first point of contact and keeps the force curve nearly flat over stroke, while a mechanical spring starts near zero and climbs. That means fewer, smaller force units and better-controlled forming pressure." },
      { q: "Are gas springs serviceable?", a: "Yes — they are recharged or resealed at service intervals depending on cycles and operating temperature. Include your cycle rate in the enquiry and we can advise the right specification." },
    ],
    familyId: "springs-and-force",
    related: ["die-springs", "coil-springs", "ejector-pins"],
  },
  {
    slug: "oil-free-bushings",
    term: "Oil-Free Bushings",
    searchTitle: "Oil-Free Bushings & Self-Lubricating Bushes — Supplier India",
    metaDescription:
      "Maintenance-free oil-free bushings with embedded solid lubricant — for guide pillars, slides and pivots where oiling is impossible. Request a quote from JIDOKA.",
    keywords: ["oil free bushings", "self lubricating bushings", "graphite bushings", "oilless bushes", "oil free bushing supplier India", "slide plates"],
    intro:
      "Oil-free bushings run without lubrication lines — solid lubricant embedded in the bearing wall feeds the sliding surface continuously.",
    whatIs:
      "An oil-free (self-lubricating) bushing is a bronze or steel-backed bearing with graphite or other solid-lubricant plugs embedded in its running surface. As the shaft moves, a transfer film forms, so the bearing operates maintenance-free at high load and low-to-moderate speed — ideal inside moulds, fixtures and machines where re-oiling is impractical.",
    types: [
      { name: "Cylindrical oil-free bushings", desc: "Plain bushes for shafts and guide pillars." },
      { name: "Flanged types", desc: "Flange takes axial thrust and simplifies location." },
      { name: "Oil-free slide plates", desc: "Flat self-lubricating wear plates for slides, cams and wear surfaces." },
      { name: "Guide-pillar bushes", desc: "Matched to mould and die guide pins for oil-free alignment." },
    ],
    materials: "High-strength bronze (often with embedded graphite), steel-backed variants, and polymer-lined types for lighter duties.",
    selection: [
      "Shaft diameter, housing bore and length (or plate size).",
      "Load and sliding speed — oil-free bearings favour high load / lower speed.",
      "Temperature and environment.",
      "Flanged or plain, bush or plate format.",
    ],
    faqs: [
      { q: "How do oil-free bushings work without lubrication?", a: "Solid lubricant (typically graphite) embedded in the bearing surface transfers to the shaft as it moves, forming a self-renewing lubricating film — no oil lines or greasing schedule required." },
      { q: "Where are oil-free slide plates used?", a: "As flat wear surfaces under slides, cams and pressure pads in moulds, dies and machines — anywhere a flat sliding interface must run dry." },
    ],
    familyId: "linear-motion",
    related: ["guide-pins-and-bushes", "linear-shafts", "linear-bearings"],
  },
  {
    slug: "linear-shafts",
    term: "Linear Shafts",
    searchTitle: "Linear Shafts — Hardened Ground Precision Shafts Supplier India",
    metaDescription:
      "Induction-hardened, precision-ground linear shafts for linear bearings and guide applications — standard and custom-machined ends. Request a quote from JIDOKA.",
    keywords: ["linear shafts", "precision shafts", "hardened ground shafts", "linear shaft supplier India", "guide shafts"],
    intro:
      "The shaft is half of every linear bushing system — its hardness, roundness and surface finish set the accuracy and life of the motion.",
    whatIs:
      "A linear shaft is an induction-hardened, precision-ground round bar on which linear ball bearings or plain bushes run. Shafts are specified by diameter tolerance (commonly g6/h7 class fits), surface hardness and straightness, and are routinely supplied with machined ends — threads, steps, flats — to suit the machine design.",
    types: [
      { name: "Plain linear shafts", desc: "Full-length ground shaft, cut to length." },
      { name: "End-machined shafts", desc: "Threaded, stepped or drilled ends to drawing for direct assembly." },
      { name: "Hollow shafts", desc: "Weight-reduced versions for moving-shaft designs." },
      { name: "Stainless / plated shafts", desc: "Corrosion-resistant options for wet or clean environments." },
    ],
    materials: "Typically SUJ2 bearing steel or induction-hardening carbon steel, hard-chrome-plated options; stainless (SUS440C class) where corrosion matters.",
    selection: [
      "Diameter and tolerance class matched to the bearing.",
      "Length, straightness and support spacing to limit deflection.",
      "Surface hardness for ball-bearing running.",
      "End machining details — send a drawing for exact quotation.",
    ],
    faqs: [
      { q: "What tolerance are linear shafts supplied to?", a: "Standard shafts for linear ball bearings are ground to a g6 or h7 class diameter tolerance with controlled roundness and straightness — matching the bearing maker's recommended fit." },
      { q: "Can shafts be supplied with machined ends?", a: "Yes — threads, steps, flats and mounting holes are standard options. Send your drawing through Request a Quote and we will quote the machined shaft complete." },
    ],
    familyId: "linear-motion",
    related: ["linear-bearings", "linear-guide-rails", "oil-free-bushings"],
  },
  {
    slug: "linear-bearings",
    term: "Linear Bearings",
    searchTitle: "Linear Bearings & Linear Bushings — Supplier India",
    metaDescription:
      "Linear ball bearings and bushings — standard, clearance-adjustable, open and flanged types with matching shafts. Request a quote from JIDOKA.",
    keywords: ["linear bearings", "linear bushings", "linear ball bearings", "LM bearings", "linear bearing supplier India"],
    intro:
      "Linear bearings put recirculating balls between shaft and carriage, turning sliding friction into smooth rolling motion.",
    whatIs:
      "A linear (ball) bearing is a bushing containing recirculating ball circuits that run directly on a hardened shaft, giving low-friction linear motion. Standard series cover common shaft diameters; variants handle clearance adjustment, supported-shaft (open) designs and flange mounting.",
    types: [
      { name: "Standard linear bushings", desc: "Cylindrical body, retained ball circuits — the basic unit." },
      { name: "Clearance-adjustable types", desc: "Slit body allows fine radial clearance adjustment in the housing." },
      { name: "Open types", desc: "Cut-away section clears the rail of a supported shaft for long, rigid axes." },
      { name: "Flanged types", desc: "Integral flange bolts straight to the carriage — no housing needed." },
    ],
    selection: [
      "Shaft diameter and the matching bearing series.",
      "Load and life calculation from the applied load and stroke.",
      "Closed, open or flanged form by the mounting design.",
      "Sealing and lubrication for the environment.",
    ],
    faqs: [
      { q: "What is the difference between a linear bearing and a linear bushing?", a: "The terms are used interchangeably — both mean a bushing-format bearing running on a round shaft. 'Linear ball bushing' emphasises the recirculating-ball construction versus a plain (sliding) bushing." },
      { q: "When should I use an open-type linear bearing?", a: "When the shaft is continuously supported along its length (for rigidity on long axes), the bearing needs an open segment to pass the shaft support rail." },
    ],
    familyId: "linear-motion",
    related: ["linear-shafts", "linear-guide-rails", "oil-free-bushings"],
  },
  {
    slug: "linear-guide-rails",
    term: "Linear Guide Rails",
    searchTitle: "Linear Guide Rails & Carriages (Profile Rails) — Supplier India",
    metaDescription:
      "Profile linear guide rails with recirculating-ball carriages — high rigidity and accuracy for machine axes and automation. Request a quote from JIDOKA.",
    keywords: ["linear guide rails", "linear guides", "profile rails", "LM guide", "linear guideway supplier India", "linear rail and block"],
    intro:
      "Profile rail guides carry heavy, offset loads with high rigidity — the standard motion element of machine tools and automation axes.",
    whatIs:
      "A linear guide (profile rail) system pairs a precision-ground rail with one or more recirculating-ball carriages (blocks). The gothic-arch raceways take load in all four directions, giving far higher moment rigidity than round-shaft systems — which is why machine axes, gantries and precision stages are built on them.",
    types: [
      { name: "Standard profile rail + block", desc: "The general automation workhorse in multiple width series." },
      { name: "Miniature guides", desc: "Compact rails for small stages and instruments." },
      { name: "Preloaded / high-rigidity classes", desc: "Interference-set balls remove play for cutting and precision axes." },
      { name: "High-accuracy classes", desc: "Tighter running parallelism grades for measurement and machining." },
    ],
    selection: [
      "Load, moment and life calculation to size the rail series.",
      "Accuracy class and preload for the application.",
      "Number of blocks per rail and rail length (butted rails for long axes).",
      "Lubrication and sealing options.",
    ],
    faqs: [
      { q: "Profile rail or round shaft — which linear guide should I use?", a: "Profile rails give higher rigidity and moment capacity and mount on a machined surface; round-shaft systems tolerate less-precise mounting and cost less. For loaded, accurate axes profile rail is standard; for simple guided motion round shaft is often enough." },
      { q: "What does preload mean on a linear guide?", a: "A slight interference between balls and raceways that removes internal clearance. Preload increases rigidity and repeatability at the cost of slightly higher friction — chosen by class to match the duty." },
    ],
    familyId: "linear-motion",
    related: ["linear-bearings", "linear-shafts", "aluminium-profile"],
  },
  {
    slug: "aluminium-profile",
    term: "Aluminium Profile",
    searchTitle: "Aluminium Profile / Extrusion for Machine Frames — Supplier India",
    metaDescription:
      "T-slot aluminium profiles (extrusions) with brackets, connectors and accessories for machine frames, guards and workstations. Request a quote from JIDOKA.",
    keywords: ["aluminium profile", "aluminium extrusion", "t slot aluminium profile", "aluminium profile supplier India", "machine frame aluminium", "40x40 aluminium profile"],
    intro:
      "T-slot aluminium profile turns frame building into assembly — cut, bolt, reconfigure — no welding, no painting.",
    whatIs:
      "Structural aluminium profile is an extruded section with T-slots on each face. Frames, guards, enclosures and workstations are assembled from cut lengths using slot nuts, brackets and connectors, and can be modified or extended at any time. Series are named by slot pitch and section (20, 30, 40, 45 series and up).",
    types: [
      { name: "Standard square sections", desc: "20×20 to 90×90 and beyond — the framing base." },
      { name: "Rectangular & heavy sections", desc: "Higher bending stiffness for spans and bases." },
      { name: "Connectors & brackets", desc: "Angles, gussets, hinges, slot nuts and end fasteners." },
      { name: "Accessories", desc: "Panel-holding, feet, casters, handles, door and guard hardware." },
    ],
    materials: "Typically 6063-T5 anodised aluminium; slot nuts and fasteners in steel or stainless.",
    selection: [
      "Series / slot size compatible across the frame and its accessories.",
      "Section size from load and span (deflection governs sizing).",
      "Connection method — brackets are flexible, end-fasteners are cleaner.",
      "Accessories: panels, doors, feet, casters as a single coordinated order.",
    ],
    faqs: [
      { q: "Which aluminium profile size should I use?", a: "Pick the series (e.g. 30 or 40) by the loads and spans: deflection under load usually decides. Frames commonly mix a heavier base series with lighter guarding sections of the same slot standard." },
      { q: "Can JIDOKA supply profile cut to length with accessories?", a: "Send your frame design, cut list or even a sketch through Request a Quote / Submit BOM and we will quote profile, brackets, fasteners and accessories together." },
    ],
    familyId: "profile-frame",
    related: ["linear-guide-rails", "chain-and-sprockets", "timing-belts-and-pulleys"],
  },
  {
    slug: "timing-belts-and-pulleys",
    term: "Timing Belts & Pulleys",
    searchTitle: "Timing Belts & Timing Pulleys — Supplier India",
    metaDescription:
      "Timing belts and matching pulleys — classical, T/AT and HTD profiles for synchronous power transmission and positioning drives. Request a quote from JIDOKA.",
    keywords: ["timing belts", "timing pulleys", "HTD belts", "synchronous belts", "timing belt supplier India", "timing pulley supplier India"],
    intro:
      "Timing belts transmit torque tooth-by-tooth — no slip, no lubrication — making them the default for positioning drives and clean power transmission.",
    whatIs:
      "A timing (synchronous) belt has moulded teeth that mesh with grooved pulleys, keeping driver and driven shafts in exact phase. Profiles (T, AT, HTD 3M/5M/8M, GT classes) trade tooth strength, backlash and quietness. Because there is no slip, they suit axis drives, conveyors and any drive where position matters.",
    types: [
      { name: "T / AT profile belts", desc: "Trapezoidal metric profiles; AT adds a stronger tooth for stiffer drives." },
      { name: "HTD (3M/5M/8M) belts", desc: "Curvilinear teeth carry higher torque smoothly." },
      { name: "Open-length belting", desc: "Cut lengths for linear axes with clamped ends." },
      { name: "Timing pulleys", desc: "Aluminium or steel, pilot-bore or taper-bush, with or without flanges." },
    ],
    selection: [
      "Profile and pitch from torque and speed.",
      "Belt width from the power rating tables.",
      "Tooth counts for the required ratio and centre distance.",
      "Pulley material, bore and flange requirement; tensioning method.",
    ],
    faqs: [
      { q: "What is the difference between HTD and T-profile timing belts?", a: "HTD's rounded (curvilinear) tooth engages more deeply and carries more torque for the same width; classical T profiles have more backlash but are widespread and economical. Positioning drives often use AT or GT-class profiles for stiffness." },
      { q: "Can I get a matching belt and pulley set quoted together?", a: "Yes — send speed, torque or the existing part numbers and we quote belt and pulleys as a matched set, including bore machining where needed." },
    ],
    familyId: "power-transmission",
    related: ["chain-and-sprockets", "linear-guide-rails", "aluminium-profile"],
  },
  {
    slug: "chain-and-sprockets",
    term: "Chain & Sprockets",
    searchTitle: "Roller Chain & Sprockets — Supplier India",
    metaDescription:
      "Roller chain and matching sprockets — simplex and duplex, standard pitches with pilot-bore and finished-bore sprockets. Request a quote from JIDOKA.",
    keywords: ["roller chain", "sprockets", "chain and sprocket supplier India", "duplex chain", "conveyor chain", "chain drive"],
    intro:
      "Chain drives move serious torque over long centre distances and rough conditions — the muscle of conveyors and heavy machine drives.",
    whatIs:
      "A roller chain drive pairs a standardised chain (metric BS 08B/10B/12B or ANSI 40/50/60 classes) with toothed sprockets. It tolerates shock loads, dirt and imprecise centre distances better than belts, at the cost of lubrication and periodic tension adjustment — the standard for conveyors and heavy drives.",
    types: [
      { name: "Simplex roller chain", desc: "Single-strand standard pitches." },
      { name: "Duplex / triplex chain", desc: "Multi-strand for higher power in the same pitch." },
      { name: "Attachment chain", desc: "Bent-lug and extended-pin links to carry conveyor attachments." },
      { name: "Sprockets", desc: "Pilot-bore or finished-bore with key and set screws; hardened teeth for long life." },
    ],
    selection: [
      "Chain pitch and strand count from power and speed.",
      "Sprocket tooth counts for ratio and chain wrap.",
      "Bore, keyway and mounting details for the shafts.",
      "Lubrication and tensioning provision in the design.",
    ],
    faqs: [
      { q: "How do I identify my existing chain?", a: "Measure the pitch (pin-to-pin), roller diameter and inner width — these map to a standard designation such as 08B or ANSI 40. A photo with a rule in shot is usually enough; send it via our Find an Alternative form." },
      { q: "Do you supply matching sprockets with machined bores?", a: "Yes — sprockets are available pilot-bore for your machining, or finished to your bore/keyway specification on enquiry." },
    ],
    familyId: "power-transmission",
    related: ["timing-belts-and-pulleys", "aluminium-profile", "linear-shafts"],
  },
  {
    slug: "cooling-components",
    term: "Mould Cooling Components",
    searchTitle: "Mould Cooling Components — Baffles, Plugs & Nipples Supplier India",
    metaDescription:
      "Mould cooling components — water baffles, spiral plugs, cooling nipples, plugs and O-rings for mould temperature control. Request a quote from JIDOKA.",
    keywords: ["mould cooling components", "cooling baffles", "water baffles", "cooling nipples", "mould cooling supplier India", "spiral baffle"],
    intro:
      "Cooling decides cycle time. Baffles, plugs and nipples route water through the mould so every cavity region holds the right temperature.",
    whatIs:
      "Mould cooling components are the standard fittings that carry cooling water through a mould: nipples and plugs connect and blank the circuits, baffles and spiral cores push water up into cores and towers, and O-rings seal the joints. They are consumable standards, replaced at tool maintenance.",
    types: [
      { name: "Cooling nipples & couplers", desc: "Quick-connect inlets and outlets for mould water lines." },
      { name: "Baffles & spiral plugs", desc: "Divert flow up into cores and deep sections that straight channels cannot reach." },
      { name: "Pipe plugs & blanking screws", desc: "Seal drilled channel ends and unused ports." },
      { name: "O-rings & seals", desc: "Seal plate joints and inserts in the water circuit." },
    ],
    selection: [
      "Thread standards (PT/NPT/metric) matching the mould drilling.",
      "Channel diameter and the baffle size for the core bore.",
      "Temperature and coolant compatibility of seals.",
      "Quantities as maintenance spares — these are consumables.",
    ],
    faqs: [
      { q: "What does a baffle do in a mould?", a: "A baffle divides a drilled cooling hole into an up-and-down flow path, forcing water to the top of a core or tower so heat is removed where straight channels cannot reach." },
      { q: "Can JIDOKA supply the full cooling kit for a tool?", a: "Yes — send the tool's cooling drawing or the list of nipples, plugs, baffles and O-rings, and we quote the set together." },
    ],
    familyId: "mould-and-die",
    related: ["ejector-pins", "o-rings-and-seals", "core-pins"],
  },
  {
    slug: "ejector-sleeves",
    term: "Ejector Sleeves",
    searchTitle: "Ejector Sleeves — SKD61 Sleeve Ejectors Supplier India",
    metaDescription:
      "Ejector sleeves in SKD61 — hollow ejectors that run over core pins to release bosses and circular features. Request a quote from JIDOKA.",
    keywords: ["ejector sleeves", "sleeve ejectors", "SKD61 ejector sleeves", "mould ejector sleeve supplier India"],
    intro:
      "Where a boss must be ejected around its core pin, only a sleeve can push evenly on the ring of plastic — the ejector sleeve is that part.",
    whatIs:
      "An ejector sleeve is a hardened, thin-walled hollow ejector that slides over a stationary core pin. On ejection it pushes the moulded boss off the core evenly, avoiding the distortion a single pin would cause. Wall thickness, concentricity and finish are critical because the sleeve runs steel-on-steel over the core pin.",
    types: [
      { name: "Standard ejector sleeves (SKD61)", desc: "Nitrided hot-work steel — the common specification." },
      { name: "Thin-wall sleeves", desc: "For small bosses; require careful support and fitting." },
      { name: "Stepped sleeves", desc: "Reinforced body stepped to the working wall for stiffness." },
    ],
    materials: "SKD61 nitrided is standard; the mating core pin is typically SKD61 or SKH51, sized to run inside the sleeve with a controlled clearance.",
    selection: [
      "Core pin diameter (sleeve bore) and boss outside diameter (sleeve OD).",
      "Overall length to reach through the ejector stroke.",
      "Wall thickness — thicker where possible for life.",
      "Matched core pin supplied together for correct running fit.",
    ],
    faqs: [
      { q: "Why use an ejector sleeve instead of pins beside the boss?", a: "Pins beside a boss push the surrounding face, often distorting or stressing the boss root. A sleeve pushes the boss itself, squarely around its full circumference, releasing it cleanly from the core pin." },
      { q: "Should the core pin and sleeve be ordered together?", a: "Yes — they work as a matched pair with a controlled running clearance. Order both together (or send the existing pair's sizes) for correct fit." },
    ],
    familyId: "mould-and-die",
    related: ["ejector-pins", "core-pins", "cooling-components"],
  },
  {
    slug: "guide-posts",
    term: "Guide Post Sets",
    searchTitle: "Guide Post Sets for Press Dies — Plain & Ball-Cage Supplier India",
    metaDescription:
      "Plain and ball-cage guide post sets for press die sets — posts, bushes and cages as matched assemblies. High-demand die components from JIDOKA. Request a quote.",
    keywords: ["guide post sets", "guide posts", "die set guide posts", "ball cage guide posts", "guide post supplier India"],
    intro:
      "Guide post sets are the alignment system of a press die — post, bush and (optionally) ball cage supplied as a matched assembly.",
    whatIs:
      "A guide post set aligns the upper and lower shoes of a die set through every press stroke. Plain sets run a ground post directly in a bronze or steel bush; ball-cage sets interpose a cage of recirculating balls for near-zero clearance and low friction. Sets are ordered by post diameter, length and mounting style, as matched assemblies.",
    types: [
      { name: "Plain guide post sets", desc: "Post and plain bush — rigid, economical, standard for general tools." },
      { name: "Ball-cage guide post sets", desc: "Post, ball cage and sleeve — high precision and speed, minimal play." },
      { name: "Demountable / removable types", desc: "Posts removable from the shoe for maintenance access." },
    ],
    materials: "Posts in hardened SUJ2 bearing steel, ground and lapped; bushes in bronze or hardened steel; cages with hardened balls.",
    selection: [
      "Post diameter and length for the die set size and shut height.",
      "Plain vs ball-cage by press speed and accuracy requirement.",
      "Mounting style (press-fit, demountable) per the die design.",
      "Order as matched sets — post, bush and cage together.",
    ],
    faqs: [
      { q: "Plain or ball-cage guide posts — which should I use?", a: "Plain sets are rigid and economical for general stamping. Ball-cage sets run with virtually no clearance at low friction, suiting high-speed presses and precision dies where alignment repeatability drives edge life." },
      { q: "Can I replace only the bush or cage of a set?", a: "Components are replaceable, but running clearance is set by the matched pair — replacing post and bush (or cage) together restores the original alignment accuracy." },
    ],
    familyId: "mould-and-die",
    related: ["leader-pins", "guide-pins-and-bushes", "punches"],
  },
  {
    slug: "core-pins",
    term: "Core Pins",
    searchTitle: "Core Pins for Moulds — Straight Core Pins Supplier India",
    metaDescription:
      "Straight core pins in SKD61 and SKH51 for plastic moulds — form holes and bosses, run with ejector sleeves. Request a quote from JIDOKA.",
    keywords: ["core pins", "mould core pins", "straight core pins", "core pin supplier India"],
    intro:
      "Core pins form the holes and bosses in a moulded part — precision pins that live inside the cavity, cycling with every shot.",
    whatIs:
      "A core pin is a hardened, ground pin mounted in the mould that forms an internal feature — a hole, boss bore or slot — in the moulded part. Where the feature must be ejected, the core pin runs inside an ejector sleeve. Like ejector pins, core pins are standardised consumables ordered by diameter, length and material.",
    types: [
      { name: "Standard straight core pins", desc: "Constant diameter with cylindrical head — the base form." },
      { name: "Stepped core pins", desc: "Reinforced shank stepped to the forming diameter." },
      { name: "Core pins for sleeves", desc: "Sized to run inside a matching ejector sleeve." },
    ],
    materials: "SKD61 (nitrided) standard; SKH51 for fine diameters and abrasive resins.",
    selection: [
      "Forming diameter and tolerance for the part feature.",
      "Overall length through the stack to the head seat.",
      "Material/treatment for resin and cycle life.",
      "Matched ejector sleeve where the feature is sleeve-ejected.",
    ],
    faqs: [
      { q: "What is the difference between a core pin and an ejector pin?", a: "A core pin forms a feature in the part and normally does not move with ejection; an ejector pin moves forward to push the part off. Where a formed boss must be ejected, the stationary core pin is paired with a moving ejector sleeve." },
    ],
    familyId: "mould-and-die",
    related: ["ejector-sleeves", "ejector-pins", "cooling-components"],
  },
  {
    slug: "o-rings-and-seals",
    term: "O-Rings & Seals",
    searchTitle: "O-Rings & Industrial Seals — NBR, FKM/Viton Supplier India",
    metaDescription:
      "O-rings and industrial seals in NBR, FKM (Viton) and silicone — standard sizes for moulds, machines, pneumatics and hydraulics. Request a quote from JIDOKA.",
    keywords: ["o-rings", "oil seals", "NBR o-rings", "viton o-rings", "o-ring supplier India", "industrial seals"],
    intro:
      "Every mould water line, cylinder and gearbox depends on seals. Standard O-ring sizes and the right elastomer keep them dry.",
    whatIs:
      "O-rings are toroidal elastomer seals compressed in a groove to seal static or slow-moving joints; oil seals (rotary shaft seals) seal rotating shafts with a sprung lip. Both follow international size standards, so identification by cross-section and diameter (or shaft/bore size) is usually enough to supply a replacement.",
    types: [
      { name: "NBR (nitrile) O-rings", desc: "General oil and water service — the industrial default." },
      { name: "FKM (Viton) O-rings", desc: "High temperature and aggressive chemical resistance." },
      { name: "Silicone / EPDM rings", desc: "Food-adjacent, steam and weather duties." },
      { name: "Oil seals (rotary)", desc: "Sprung-lip shaft seals by shaft/bore/width." },
    ],
    selection: [
      "Cross-section and inside diameter (or groove dimensions).",
      "Elastomer by fluid, temperature and standard compliance.",
      "Static vs dynamic duty — finish and hardness matter when moving.",
      "Quantity — seals are consumed at every service.",
    ],
    faqs: [
      { q: "How do I identify an O-ring for replacement?", a: "Measure the cross-section thickness and the inside diameter — these map to standard size charts. Add the fluid and temperature so the correct elastomer (NBR, FKM, silicone) can be confirmed." },
      { q: "When is FKM/Viton worth it over NBR?", a: "Above roughly 100–120 °C continuous, or with aggressive chemicals and fuels, FKM's temperature and chemical resistance outlasts NBR many times over — worth the premium wherever nitrile hardens and cracks." },
    ],
    familyId: "machine-standard",
    related: ["cooling-components", "plungers", "washers-and-shims"],
  },
  {
    slug: "plungers",
    term: "Plungers",
    searchTitle: "Spring Plungers & Ball Plungers — Supplier India",
    metaDescription:
      "Spring plungers, ball plungers and index plungers for positioning, detents and holding in jigs, fixtures and machines. Request a quote from JIDOKA.",
    keywords: ["spring plungers", "ball plungers", "index plungers", "plunger supplier India", "detent plungers"],
    intro:
      "Plungers give machines a sense of position — the click of a detent, the hold of a spring-loaded ball, the lock of an index pin.",
    whatIs:
      "A plunger is a spring-loaded pin or ball in a threaded or press-fit body. Ball and spring plungers create detents and hold parts against a stop; index plungers positively lock a moving element into indexed positions until manually retracted. They are standard elements in jigs, fixtures, guides and adjustable machine parts.",
    types: [
      { name: "Ball plungers", desc: "Spring-loaded ball in a threaded body — smooth detent action." },
      { name: "Spring plungers (pin type)", desc: "Flat or domed pin end for pressing and holding." },
      { name: "Index plungers", desc: "Retractable locking pin with knob — positive position locking." },
      { name: "Stopper / cushion types", desc: "Urethane-tipped and heavy-duty forms for end stops." },
    ],
    selection: [
      "Thread size and body length for the mounting.",
      "Spring force class — light for detents, heavy for holding.",
      "End form: ball, pin, dome or urethane tip.",
      "Locking (index) vs non-locking action.",
    ],
    faqs: [
      { q: "What is the difference between a ball plunger and an index plunger?", a: "A ball plunger yields under side force — ideal for detents and temporary holds. An index plunger's pin positively locks into a hole and must be manually pulled to release — used where the position must not move under load." },
    ],
    familyId: "machine-standard",
    related: ["locating-pins", "o-rings-and-seals", "shoulder-bolts"],
  },
  {
    slug: "shoulder-bolts",
    term: "Shoulder Bolts & Stripper Bolts",
    searchTitle: "Shoulder Bolts & Stripper Bolts (MSB) — Supplier India",
    metaDescription:
      "Shoulder bolts, stripper bolts (MSB) and specialty bolts — precision shoulder diameters for pivots, guides and stripper plates. Request a quote from JIDOKA.",
    keywords: ["shoulder bolts", "stripper bolts", "MSB bolts", "shoulder screw supplier India", "stopper bolts", "specialty bolts"],
    intro:
      "A shoulder bolt is a bearing surface, a guide and a fastener in one part — and in press tools, the stripper bolt version carries the stripper plate itself.",
    whatIs:
      "Shoulder bolts (shoulder screws) have a precision-ground cylindrical shoulder between head and thread; the shoulder acts as a shaft for pivots, rollers and guided parts. Stripper bolts are the die-making version — they suspend and guide the stripper plate, setting its stroke. Stopper bolts add urethane cushioning for end-stop duties.",
    types: [
      { name: "Shoulder bolts (screws)", desc: "Ground shoulder diameter with socket head — pivot and guide standard." },
      { name: "Stripper bolts (MSB)", desc: "Long guided shoulder for stripper plates in press tools." },
      { name: "Stopper bolts with urethane", desc: "Cushioned contact for moving-plate end stops." },
      { name: "Specialty / circulative bolts", desc: "Application-specific forms supplied on enquiry." },
    ],
    materials: "Alloy steel, hardened, with ground shoulder to close tolerance; stainless variants for corrosive environments.",
    selection: [
      "Shoulder diameter and length — the functional dimensions.",
      "Thread size below the shoulder for the mating plate.",
      "Head style and wrenching (socket standard).",
      "For stripper bolts: stroke and plate thickness set the length.",
    ],
    faqs: [
      { q: "What is a stripper bolt?", a: "A shoulder bolt made for press dies: its long ground shoulder passes through the stripper plate, suspending it and guiding its travel. The shoulder length sets the plate stroke, so it is chosen against the tool design rather than as a generic fastener." },
    ],
    familyId: "machine-standard",
    related: ["plungers", "washers-and-shims", "die-springs"],
  },
  {
    slug: "washers-and-shims",
    term: "Washers & Shims",
    searchTitle: "Washers, Shims & Shaft Collars — Supplier India",
    metaDescription:
      "Precision washers, shim plates and shaft collars for spacing, adjustment and shaft retention in machines and tools. Request a quote from JIDOKA.",
    keywords: ["washers", "shims", "shim plates", "shaft collars", "precision washers supplier India", "spacer shims"],
    intro:
      "Millimetres are set with washers and shims — the small parts that give an assembly its exact heights, gaps and preloads.",
    whatIs:
      "Washers spread load and set spacing under fasteners; shims are precision-thickness plates used to adjust heights, alignments and clearances; shaft collars clamp onto shafts to retain bearings, set positions and act as stops. All are standard, dimension-driven parts ordered by size and thickness.",
    types: [
      { name: "Plain & hardened washers", desc: "Load spreading and spacing under bolt heads." },
      { name: "Shim plates & shim stock", desc: "Ground thickness plates for height and alignment adjustment." },
      { name: "Shaft collars (set-screw / clamp)", desc: "Position stops and bearing retention on shafts." },
      { name: "Spacers & distance pieces", desc: "Tube and precision spacers for stack-ups." },
    ],
    selection: [
      "Bore/OD and thickness (with tolerance where functional).",
      "Material and hardness — hardened where the joint is loaded.",
      "Shim thickness steps needed for the adjustment range.",
      "Collar style: set-screw is compact, clamp type protects the shaft.",
    ],
    faqs: [
      { q: "What is the difference between set-screw and clamp shaft collars?", a: "A set-screw collar digs into the shaft — compact but marks it. A clamp collar grips by friction around the full circumference, holds better under shock, and can be repositioned without damaging the shaft." },
    ],
    familyId: "machine-standard",
    related: ["shoulder-bolts", "o-rings-and-seals", "linear-shafts"],
  },
  {
    slug: "shock-absorbers-and-dampers",
    term: "Shock Absorbers & Dampers",
    searchTitle: "Industrial Shock Absorbers & Dampers — Supplier India",
    metaDescription:
      "Industrial shock absorbers, dampers and urethane bumpers to decelerate moving loads smoothly in automation and machines. Request a quote from JIDOKA.",
    keywords: ["shock absorbers", "industrial shock absorbers", "dampers", "urethane bumpers", "shock absorber supplier India", "rotary dampers"],
    intro:
      "Every moving axis has to stop. Shock absorbers turn that stop from a bang into a controlled deceleration — protecting product, machine and cycle time.",
    whatIs:
      "An industrial shock absorber converts the kinetic energy of a moving load into heat through metered hydraulic flow, decelerating it smoothly over its stroke. Dampers do the same for slower motions (doors, lids), and urethane bumpers give simple cushioned end stops. Correct sizing uses the moving mass and impact speed.",
    types: [
      { name: "Miniature shock absorbers", desc: "Threaded-body hydraulic units for pick-and-place and small actuators." },
      { name: "Adjustable shock absorbers", desc: "Tunable orifice for varying loads." },
      { name: "Rotary / linear dampers", desc: "Controlled slow motion for doors, lids and trays." },
      { name: "Urethane bumpers & stoppers", desc: "Simple elastic end stops for light impacts." },
    ],
    selection: [
      "Moving mass and impact velocity → energy per cycle.",
      "Cycles per minute → total energy per hour capacity.",
      "Stroke available for deceleration.",
      "Thread/body size for the mounting.",
    ],
    faqs: [
      { q: "How do I size a shock absorber?", a: "From the moving mass, impact speed and any propelling force, calculate the energy per impact and per hour, then choose a unit rated above both with a stroke that fits the available space. Send these values with your enquiry and we confirm the selection." },
      { q: "When is a urethane bumper enough?", a: "For light masses, low speeds and infrequent impacts a urethane stop is simple and cheap. Once energy or cycle rate rises — or the stop must be quiet and controlled — a hydraulic shock absorber pays for itself in machine life." },
    ],
    familyId: "springs-and-force",
    related: ["gas-springs", "die-springs", "casters"],
  },
  {
    slug: "casters",
    term: "Casters",
    searchTitle: "Industrial Casters & Wheels — Supplier India",
    metaDescription:
      "Industrial casters — swivel, fixed, braked and levelling types for trolleys, machines and equipment. Request a quote from JIDOKA.",
    keywords: ["industrial casters", "caster wheels", "swivel casters", "braked casters", "caster supplier India", "levelling casters"],
    intro:
      "Casters put equipment on wheels — chosen right, they roll easily, lock firmly and survive the floor and load they live on.",
    whatIs:
      "A caster is a wheel in a mounting fork (rig) bolted or stemmed to equipment. Swivel rigs steer, fixed rigs track straight, brakes lock wheel or swivel, and levelling casters combine wheels with adjustable feet so a machine can roll into place and then stand rigid. Ratings are per caster at the expected speed and floor.",
    types: [
      { name: "Swivel & fixed casters", desc: "Combined on a chassis for steering and tracking." },
      { name: "Braked casters", desc: "Wheel and total-lock brakes for parked equipment." },
      { name: "Levelling casters", desc: "Roll to position, then screw down onto rigid feet." },
      { name: "Wheel materials", desc: "Nylon, urethane on iron, rubber — by floor, load and quietness." },
    ],
    selection: [
      "Load per caster with a safety margin (uneven floors load 3 of 4).",
      "Wheel diameter and material for the floor and obstacles.",
      "Swivel/fixed/braked combination for handling.",
      "Mounting: top plate or threaded stem, and overall height.",
    ],
    faqs: [
      { q: "How do I calculate the caster load rating I need?", a: "Divide the loaded equipment weight by three (not four — floors are uneven), and choose casters rated above that figure at your speed. Harder wheels roll easier; softer wheels protect floors and run quieter." },
    ],
    familyId: "functional",
    related: ["handles-and-levers", "shock-absorbers-and-dampers", "aluminium-profile"],
  },
  {
    slug: "handles-and-levers",
    term: "Handles & Levers",
    searchTitle: "Machine Handles, Handwheels & Levers — Supplier India",
    metaDescription:
      "Machine handles, handwheels, pull handles, clamp levers and knobs for equipment and fixtures. Request a quote from JIDOKA.",
    keywords: ["machine handles", "handwheels", "clamp levers", "pull handles", "machine knobs", "handle supplier India"],
    intro:
      "Handles and levers are how people meet machines — the touch points that make equipment adjustable, movable and safe to operate.",
    whatIs:
      "Machine handles cover the operator hardware of equipment: pull and grab handles for doors and covers, handwheels for screws and valves, clamp levers that lock adjustments by hand, and knobs for smaller controls. All are standardised by mounting dimensions, so replacement and design selection is by size and duty.",
    types: [
      { name: "Pull & grab handles", desc: "Door, cover and drawer handles in metal and polymer." },
      { name: "Handwheels", desc: "Spoked and solid wheels, with or without fold-away crank." },
      { name: "Adjustable clamp levers", desc: "Ratcheting levers that clamp in any lever position." },
      { name: "Knobs & thumb screws", desc: "Small adjustment and locking controls." },
    ],
    selection: [
      "Mounting: hole pitch, thread size (male/female) and orientation.",
      "Load and torque the operator must apply.",
      "Material and finish — polymer, aluminium, stainless.",
      "Ergonomics: grip length and clearance around the handle.",
    ],
    faqs: [
      { q: "What is an adjustable clamp lever?", a: "A lever with a spring ratchet between handle and screw: lift, reposition, and clamp again — so it can always finish in a convenient orientation regardless of thread position. The standard for hand-locked adjustments." },
    ],
    familyId: "functional",
    related: ["casters", "washers-and-shims", "aluminium-profile"],
  },
  {
    slug: "couplings",
    term: "Shaft Couplings",
    searchTitle: "Shaft Couplings — Disc, Jaw & Universal Joints Supplier India",
    metaDescription:
      "Shaft couplings — disc couplings, jaw/spider types, rigid couplings and universal joints for motor-to-shaft connections. Request a quote from JIDOKA.",
    keywords: ["shaft couplings", "disc couplings", "jaw couplings", "universal joints", "coupling supplier India", "motor couplings"],
    intro:
      "A coupling forgives what machining can't: the small misalignments between motor and shaft that would otherwise destroy bearings.",
    whatIs:
      "A shaft coupling connects two shafts to transmit torque while accommodating the inevitable angular, parallel and axial misalignment between them. Disc couplings flex thin metal discs for zero-backlash servo drives; jaw types cushion through an elastomer spider; universal joints handle large angles; rigid couplings join truly aligned shafts.",
    types: [
      { name: "Disc couplings", desc: "Stainless disc packs — zero backlash, high torsional stiffness, servo standard." },
      { name: "Jaw (spider) couplings", desc: "Elastomer insert damps vibration and shock." },
      { name: "Universal joints", desc: "Large angular misalignment and remote drives." },
      { name: "Rigid couplings", desc: "Solid clamped connection for precisely aligned shafts." },
    ],
    selection: [
      "Torque (with service factor) and peak/reversing loads.",
      "Bore sizes both ends, keyed or clamping.",
      "Misalignment type and amount to be absorbed.",
      "Backlash requirement — zero for positioning drives.",
    ],
    faqs: [
      { q: "Which coupling should I use with a servo motor?", a: "A zero-backlash type — typically a disc coupling (or bellows) — so position commands translate exactly to the load. Jaw couplings with spiders suit general motors where slight elasticity and damping are acceptable." },
      { q: "When is a universal joint the right choice?", a: "When shafts meet at a significant angle or the drive must reach an offset position — universal joints transmit through angles no flexible coupling can, singly or in pairs for constant velocity." },
    ],
    familyId: "power-transmission",
    related: ["timing-belts-and-pulleys", "chain-and-sprockets", "linear-shafts"],
  },
];

export const keywordBySlug = new Map(keywordPages.map((k) => [k.slug, k]));

/** Keyword pages grouped by family — used for cross-linking from family pages. */
export const keywordsByFamily = keywordPages.reduce<Record<string, KeywordPage[]>>((acc, k) => {
  (acc[k.familyId] ||= []).push(k);
  return acc;
}, {});
