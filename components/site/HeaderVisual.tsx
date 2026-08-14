/**
 * Animated blueprint motif for page headers — pure linework, no invented
 * specs, drawn with the same self-drawing/marching/rotating CSS classes as
 * the homepage hero drawing. Server component; all motion is CSS.
 *
 * Twelve motifs so every product family (and most solutions, applications
 * and industries) gets its own context-relevant drawing.
 */
export type HeaderMotif =
  | "pin"
  | "spring"
  | "bearing"
  | "gear"
  | "profile"
  | "pneumatic"
  | "bolt"
  | "plate"
  | "gripper"
  | "cutter"
  | "caster"
  | "draft"
  | "cube"
  | "sheet"
  | "assembly"
  | "factory"
  | "caliper";

/** Pick a context-relevant motif from a slug / free text. Order matters. */
export function motifFor(text: string): HeaderMotif {
  const t = text.toLowerCase();
  if (/\bcad\b|\bdxf\b|\bstep\b/.test(t)) return "cube";
  if (/catalogue|datasheet|brochure|privacy|terms|legal/.test(t)) return "sheet";
  if (/caliper|measur|inspect|gauge/.test(t)) return "caliper";
  if (/spring|damper|shock|gas/.test(t)) return "spring";
  if (/bearing|linear|bush|shaft|rail|slide/.test(t)) return "bearing";
  if (/pneumatic|vacuum|cylinder|fitting|valve|air/.test(t)) return "pneumatic";
  if (/profile|aluminium|aluminum|frame|structural|extrusion/.test(t)) return "profile";
  if (/cutting|cutter|mill|drill|ream|blade|saw|manufactur|machining/.test(t)) return "cutter";
  if (/automation|robot|gripper|handling|convey|packaging|pick|electronic/.test(t)) return "gripper";
  if (/functional|caster|castor|handle|hinge|latch|wheel/.test(t)) return "caster";
  if (/fastener|bolt|screw|washer|collar|nut|seal|standard|assembly|building|hardware|electrical/.test(t)) return "bolt";
  if (/material|plate|sheet|rod|urethane|plastic/.test(t)) return "plate";
  if (/custom|special|bespoke|sourcing/.test(t)) return "draft";
  if (/belt|pulley|gear|chain|sprocket|coupling|transmission|motor|power/.test(t)) return "gear";
  if (/pin|punch|die|mould|mold|ejector|guide|locat|sleeve|core|cool|tool/.test(t)) return "pin";
  return "gear";
}

const line = "hsl(var(--fg-subtle) / 0.9)";
const faint = "hsl(var(--muted) / 0.75)";
const accent = "hsl(var(--accent))";
const centre = "hsl(var(--accent) / 0.65)";

function delay(s: number) {
  return { "--draw-delay": `${s}s` } as React.CSSProperties;
}

const MOTIFS: Record<HeaderMotif, () => React.ReactNode> = {
  pin: PinMotif,
  spring: SpringMotif,
  bearing: BearingMotif,
  gear: GearMotif,
  profile: ProfileMotif,
  pneumatic: PneumaticMotif,
  bolt: BoltMotif,
  plate: PlateMotif,
  gripper: GripperMotif,
  cutter: CutterMotif,
  caster: CasterMotif,
  draft: DraftMotif,
  cube: CubeMotif,
  sheet: SheetMotif,
  assembly: AssemblyMotif,
  factory: FactoryMotif,
  caliper: CaliperMotif,
};

export function HeaderVisual({ motif }: { motif: HeaderMotif }) {
  const Motif = MOTIFS[motif] ?? GearMotif;
  return (
    <div aria-hidden className="animate-float-slow select-none">
      <svg viewBox="0 0 320 240" className="block w-full max-w-[20rem]" role="presentation">
        <defs>
          <marker id="hv-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,1.5 L9,5 L0,8.5 z" fill={accent} />
          </marker>
          <pattern id="hv-hatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="7" stroke="hsl(var(--muted) / 0.45)" strokeWidth="1" />
          </pattern>
        </defs>
        {/* corner registration ticks shared by every motif */}
        <g stroke={faint} strokeWidth="1">
          {[
            [10, 10], [310, 10], [10, 230], [310, 230],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <line x1={x - 6} y1={y} x2={x + 6} y2={y} pathLength={1} className="draw-path" style={delay(0.1)} />
              <line x1={x} y1={y - 6} x2={x} y2={y + 6} pathLength={1} className="draw-path" style={delay(0.1)} />
            </g>
          ))}
        </g>
        <Motif />
      </svg>
    </div>
  );
}

function PinMotif() {
  return (
    <g>
      <g stroke={line} strokeWidth="1.5" fill="hsl(var(--surface) / 0.5)">
        <rect x="26" y="94" width="16" height="44" rx="1.5" pathLength={1} className="draw-path" style={delay(0.25)} />
        <rect x="42" y="106" width="196" height="20" rx="1" pathLength={1} className="draw-path" style={delay(0.35)} />
        <path d="M238 106 l10 5 v10 l-10 5" fill="none" pathLength={1} className="draw-path" style={delay(0.55)} />
      </g>
      <line x1="14" y1="116" x2="262" y2="116" stroke={centre} strokeWidth="1" className="centerline" />
      {/* length dimension */}
      <g strokeWidth="1" className="animate-fade-in" style={{ animationDelay: "1.2s" }}>
        <line x1="42" y1="132" x2="42" y2="164" stroke={faint} />
        <line x1="238" y1="132" x2="238" y2="164" stroke={faint} />
        <line x1="42" y1="158" x2="238" y2="158" stroke={accent} markerStart="url(#hv-arrow)" markerEnd="url(#hv-arrow)" />
      </g>
      {/* section view */}
      <g>
        <circle cx="278" cy="62" r="24" fill="none" stroke={line} strokeWidth="1.4" pathLength={1} className="draw-path" style={delay(0.6)} />
        <circle cx="278" cy="62" r="9" fill="none" stroke={accent} strokeWidth="1.3" pathLength={1} className="draw-path" style={delay(0.75)} />
        <line x1="246" y1="62" x2="310" y2="62" stroke="hsl(var(--accent) / 0.6)" strokeWidth="1" className="centerline" />
        <line x1="278" y1="30" x2="278" y2="94" stroke="hsl(var(--accent) / 0.6)" strokeWidth="1" className="centerline" />
      </g>
    </g>
  );
}

function SpringMotif() {
  return (
    <g>
      <g className="spring-breathe">
        <g stroke="hsl(var(--heat))" strokeWidth="1.6" fill="none">
          {Array.from({ length: 8 }).map((_, i) => (
            <path key={i} d={`M${52 + i * 26} 168 l14 -96 h12`} pathLength={1} className="draw-path" style={delay(0.4 + i * 0.07)} />
          ))}
        </g>
        <g stroke={line} strokeWidth="1.5" fill="none">
          <line x1="46" y1="72" x2="46" y2="168" pathLength={1} className="draw-path" style={delay(0.25)} />
          <line x1="278" y1="72" x2="278" y2="168" pathLength={1} className="draw-path" style={delay(0.25)} />
          <line x1="38" y1="72" x2="286" y2="72" pathLength={1} className="draw-path" style={delay(0.3)} />
          <line x1="38" y1="168" x2="286" y2="168" pathLength={1} className="draw-path" style={delay(0.3)} />
        </g>
      </g>
      <line x1="24" y1="120" x2="300" y2="120" stroke={centre} strokeWidth="1" className="centerline" />
    </g>
  );
}

function BearingMotif() {
  return (
    <g>
      <g stroke={line} strokeWidth="1.5" fill="none">
        <circle cx="160" cy="120" r="84" pathLength={1} className="draw-path" style={delay(0.3)} />
        <circle cx="160" cy="120" r="68" pathLength={1} className="draw-path" style={delay(0.4)} />
        <circle cx="160" cy="120" r="46" pathLength={1} className="draw-path" style={delay(0.5)} />
      </g>
      <circle cx="160" cy="120" r="30" fill="none" stroke={accent} strokeWidth="1.4" pathLength={1} className="draw-path" style={delay(0.6)} />
      <g className="animate-spin-slow" style={{ transformOrigin: "160px 120px", transformBox: "view-box" }}>
        {Array.from({ length: 9 }).map((_, i) => {
          const a = (i * 2 * Math.PI) / 9;
          return (
            <circle
              key={i}
              cx={160 + 57 * Math.cos(a)}
              cy={120 + 57 * Math.sin(a)}
              r="8"
              fill="hsl(var(--accent) / 0.12)"
              stroke={accent}
              strokeWidth="1.2"
              pathLength={1}
              className="draw-path"
              style={delay(0.65 + i * 0.05)}
            />
          );
        })}
      </g>
      <line x1="56" y1="120" x2="264" y2="120" stroke={centre} strokeWidth="1" className="centerline" />
      <line x1="160" y1="16" x2="160" y2="224" stroke={centre} strokeWidth="1" className="centerline" />
    </g>
  );
}

function gearTeeth(cx: number, cy: number, n: number, r1: number, r2: number, key: string, d0: number) {
  return Array.from({ length: n }).map((_, i) => {
    const a = (i * 2 * Math.PI) / n;
    return (
      <line
        key={`${key}-${i}`}
        x1={cx + r1 * Math.cos(a)}
        y1={cy + r1 * Math.sin(a)}
        x2={cx + r2 * Math.cos(a)}
        y2={cy + r2 * Math.sin(a)}
        pathLength={1}
        className="draw-path"
        style={delay(d0 + i * 0.03)}
      />
    );
  });
}

function GearMotif() {
  return (
    <g>
      {/* main gear */}
      <g className="animate-spin-slow" style={{ transformOrigin: "138px 128px", transformBox: "view-box" }}>
        <circle cx="138" cy="128" r="58" fill="none" stroke={line} strokeWidth="1.5" pathLength={1} className="draw-path" style={delay(0.3)} />
        <g stroke={line} strokeWidth="1.5">{gearTeeth(138, 128, 16, 58, 72, "g1", 0.5)}</g>
        <circle cx="138" cy="128" r="18" fill="none" stroke={accent} strokeWidth="1.4" pathLength={1} className="draw-path" style={delay(0.6)} />
      </g>
      {/* meshing pinion, counter-rotating */}
      <g className="animate-spin-rev" style={{ transformOrigin: "243px 76px", transformBox: "view-box" }}>
        <circle cx="243" cy="76" r="30" fill="none" stroke={line} strokeWidth="1.4" pathLength={1} className="draw-path" style={delay(0.45)} />
        <g stroke={line} strokeWidth="1.4">{gearTeeth(243, 76, 10, 30, 41, "g2", 0.55)}</g>
        <circle cx="243" cy="76" r="9" fill="none" stroke={accent} strokeWidth="1.3" pathLength={1} className="draw-path" style={delay(0.7)} />
      </g>
      <circle cx="138" cy="128" r="58" fill="none" stroke="hsl(var(--accent) / 0.45)" strokeWidth="1" className="centerline" />
      <line x1="138" y1="128" x2="243" y2="76" stroke="hsl(var(--accent) / 0.5)" strokeWidth="1" className="centerline" />
    </g>
  );
}

function ProfileMotif() {
  const slot = (transform: string) => (
    <path
      d="M-14 0 v10 h8 v8 h12 v-8 h8 v-10"
      transform={transform}
      fill="none"
      pathLength={1}
      className="draw-path"
      style={delay(0.55)}
    />
  );
  return (
    <g>
      <rect x="82" y="42" width="156" height="156" rx="10" fill="none" stroke={line} strokeWidth="1.6" pathLength={1} className="draw-path" style={delay(0.3)} />
      <g stroke={line} strokeWidth="1.4">
        {slot("translate(160 42)")}
        {slot("translate(160 198) rotate(180)")}
        {slot("translate(82 120) rotate(90)")}
        {slot("translate(238 120) rotate(-90)")}
      </g>
      <circle cx="160" cy="120" r="16" fill="none" stroke={accent} strokeWidth="1.4" pathLength={1} className="draw-path" style={delay(0.7)} />
      <g stroke={faint} strokeWidth="1.2">
        <line x1="149" y1="109" x2="104" y2="64" pathLength={1} className="draw-path" style={delay(0.8)} />
        <line x1="171" y1="109" x2="216" y2="64" pathLength={1} className="draw-path" style={delay(0.8)} />
        <line x1="149" y1="131" x2="104" y2="176" pathLength={1} className="draw-path" style={delay(0.8)} />
        <line x1="171" y1="131" x2="216" y2="176" pathLength={1} className="draw-path" style={delay(0.8)} />
      </g>
      <line x1="66" y1="120" x2="254" y2="120" stroke="hsl(var(--accent) / 0.6)" strokeWidth="1" className="centerline" />
      <line x1="160" y1="26" x2="160" y2="214" stroke="hsl(var(--accent) / 0.6)" strokeWidth="1" className="centerline" />
    </g>
  );
}

function PneumaticMotif() {
  return (
    <g>
      <g stroke={line} strokeWidth="1.5" fill="none">
        <rect x="52" y="86" width="150" height="68" rx="4" pathLength={1} className="draw-path" style={delay(0.3)} />
        <rect x="42" y="78" width="10" height="84" rx="2" pathLength={1} className="draw-path" style={delay(0.4)} />
        <rect x="202" y="78" width="10" height="84" rx="2" pathLength={1} className="draw-path" style={delay(0.4)} />
        <rect x="70" y="72" width="12" height="14" pathLength={1} className="draw-path" style={delay(0.6)} />
        <rect x="172" y="72" width="12" height="14" pathLength={1} className="draw-path" style={delay(0.6)} />
      </g>
      <g className="piston-stroke">
        <rect x="212" y="112" width="74" height="16" rx="2" fill="hsl(var(--surface) / 0.5)" stroke={accent} strokeWidth="1.4" pathLength={1} className="draw-path" style={delay(0.55)} />
        <circle cx="294" cy="120" r="8" fill="none" stroke={accent} strokeWidth="1.4" pathLength={1} className="draw-path" style={delay(0.7)} />
      </g>
      <line x1="30" y1="120" x2="308" y2="120" stroke={centre} strokeWidth="1" className="centerline" />
    </g>
  );
}

/** Hex bolt — side view with threads + hex end view. Machine standard hardware. */
function BoltMotif() {
  return (
    <g>
      <g stroke={line} strokeWidth="1.5" fill="hsl(var(--surface) / 0.5)">
        {/* hex head, side */}
        <rect x="36" y="92" width="34" height="56" rx="2" pathLength={1} className="draw-path" style={delay(0.25)} />
        <line x1="36" y1="110" x2="70" y2="110" stroke={faint} strokeWidth="1.2" pathLength={1} className="draw-path" style={delay(0.4)} />
        <line x1="36" y1="130" x2="70" y2="130" stroke={faint} strokeWidth="1.2" pathLength={1} className="draw-path" style={delay(0.4)} />
        {/* shank */}
        <rect x="70" y="108" width="168" height="24" rx="1" pathLength={1} className="draw-path" style={delay(0.35)} />
        <path d="M238 108 l8 5 v14 l-8 5" fill="none" pathLength={1} className="draw-path" style={delay(0.55)} />
      </g>
      {/* threads */}
      <g stroke={faint} strokeWidth="1.1">
        {Array.from({ length: 9 }).map((_, i) => (
          <line
            key={i}
            x1={140 + i * 11}
            y1="108"
            x2={132 + i * 11}
            y2="132"
            pathLength={1}
            className="draw-path"
            style={delay(0.6 + i * 0.04)}
          />
        ))}
      </g>
      <line x1="24" y1="120" x2="258" y2="120" stroke={centre} strokeWidth="1" className="centerline" />
      {/* hex end view */}
      <g>
        <path
          d="M300 62 L289 81 L267 81 L256 62 L267 43 L289 43 Z"
          fill="none"
          stroke={line}
          strokeWidth="1.4"
          pathLength={1}
          className="draw-path"
          style={delay(0.6)}
        />
        <circle cx="278" cy="62" r="9" fill="none" stroke={accent} strokeWidth="1.3" pathLength={1} className="draw-path" style={delay(0.75)} />
        <line x1="248" y1="62" x2="308" y2="62" stroke="hsl(var(--accent) / 0.6)" strokeWidth="1" className="centerline" />
        <line x1="278" y1="32" x2="278" y2="92" stroke="hsl(var(--accent) / 0.6)" strokeWidth="1" className="centerline" />
      </g>
    </g>
  );
}

/** Stacked plates + rod section — industrial materials stock. */
function PlateMotif() {
  return (
    <g>
      {/* plate stack */}
      <rect x="72" y="86" width="210" height="22" rx="2" fill="none" stroke={line} strokeWidth="1.5" pathLength={1} className="draw-path" style={delay(0.3)} />
      <rect x="60" y="118" width="210" height="22" rx="2" fill="url(#hv-hatch)" stroke={line} strokeWidth="1.5" pathLength={1} className="draw-path" style={delay(0.45)} />
      <rect x="48" y="150" width="210" height="22" rx="2" fill="none" stroke={line} strokeWidth="1.5" pathLength={1} className="draw-path" style={delay(0.6)} />
      {/* thickness dimension on the middle plate */}
      <g strokeWidth="1" className="animate-fade-in" style={{ animationDelay: "1.3s" }}>
        <line x1="270" y1="118" x2="296" y2="118" stroke={faint} />
        <line x1="270" y1="140" x2="296" y2="140" stroke={faint} />
        <line x1="290" y1="118" x2="290" y2="140" stroke={accent} markerStart="url(#hv-arrow)" markerEnd="url(#hv-arrow)" />
      </g>
      {/* rod cross-section */}
      <circle cx="52" cy="52" r="18" fill="none" stroke={line} strokeWidth="1.4" pathLength={1} className="draw-path" style={delay(0.7)} />
      <circle cx="52" cy="52" r="6" fill="none" stroke={accent} strokeWidth="1.3" pathLength={1} className="draw-path" style={delay(0.85)} />
      <line x1="26" y1="52" x2="78" y2="52" stroke="hsl(var(--accent) / 0.6)" strokeWidth="1" className="centerline" />
      <line x1="52" y1="26" x2="52" y2="78" stroke="hsl(var(--accent) / 0.6)" strokeWidth="1" className="centerline" />
    </g>
  );
}

/** Parallel gripper with opening/closing fingers — automation & handling. */
function GripperMotif() {
  return (
    <g>
      <g stroke={line} strokeWidth="1.5" fill="none">
        {/* mounting flange + body */}
        <rect x="140" y="36" width="40" height="12" rx="2" pathLength={1} className="draw-path" style={delay(0.25)} />
        <rect x="124" y="48" width="72" height="56" rx="5" pathLength={1} className="draw-path" style={delay(0.35)} />
        {/* side ports */}
        <line x1="116" y1="66" x2="124" y2="66" pathLength={1} className="draw-path" style={delay(0.5)} />
        <line x1="196" y1="66" x2="204" y2="66" pathLength={1} className="draw-path" style={delay(0.5)} />
      </g>
      {/* fingers — open/close loop */}
      <g className="gripper-l">
        <path d="M134 104 v46 h12 v16 h-20 v-62" fill="none" stroke={line} strokeWidth="1.5" pathLength={1} className="draw-path" style={delay(0.5)} />
      </g>
      <g className="gripper-r">
        <path d="M186 104 v46 h-12 v16 h20 v-62" fill="none" stroke={line} strokeWidth="1.5" pathLength={1} className="draw-path" style={delay(0.5)} />
      </g>
      {/* workpiece */}
      <circle cx="160" cy="176" r="11" fill="hsl(var(--accent) / 0.12)" stroke={accent} strokeWidth="1.4" pathLength={1} className="draw-path" style={delay(0.8)} />
      <line x1="160" y1="24" x2="160" y2="210" stroke={centre} strokeWidth="1" className="centerline" />
      <line x1="120" y1="176" x2="200" y2="176" stroke="hsl(var(--accent) / 0.5)" strokeWidth="1" className="centerline" />
    </g>
  );
}

/** End mill with helical flutes + rotating tip view — cutting tools. */
function CutterMotif() {
  return (
    <g>
      <g stroke={line} strokeWidth="1.5" fill="none">
        {/* shank */}
        <rect x="146" y="36" width="28" height="60" rx="2" pathLength={1} className="draw-path" style={delay(0.25)} />
        {/* flute body */}
        <rect x="140" y="96" width="40" height="88" rx="2" pathLength={1} className="draw-path" style={delay(0.35)} />
        {/* cutting corner chamfers */}
        <path d="M140 184 l6 8 h28 l6 -8" pathLength={1} className="draw-path" style={delay(0.55)} />
      </g>
      {/* helical flutes */}
      <g stroke={faint} strokeWidth="1.2" fill="none">
        <path d="M146 96 q24 44 -2 88" pathLength={1} className="draw-path" style={delay(0.6)} />
        <path d="M160 96 q24 44 -2 88" pathLength={1} className="draw-path" style={delay(0.68)} />
        <path d="M174 96 q24 44 -2 88" pathLength={1} className="draw-path" style={delay(0.76)} />
      </g>
      <line x1="160" y1="24" x2="160" y2="212" stroke={centre} strokeWidth="1" className="centerline" />
      {/* rotating tip view, 4 flutes */}
      <g className="animate-spin-slow" style={{ transformOrigin: "256px 72px", transformBox: "view-box" }}>
        <circle cx="256" cy="72" r="26" fill="none" stroke={line} strokeWidth="1.4" pathLength={1} className="draw-path" style={delay(0.5)} />
        {[0, 90, 180, 270].map((deg) => (
          <path
            key={deg}
            d="M256 72 L282 72 L278 62"
            transform={`rotate(${deg} 256 72)`}
            fill="none"
            stroke={faint}
            strokeWidth="1.2"
            pathLength={1}
            className="draw-path"
            style={delay(0.7)}
          />
        ))}
        <circle cx="256" cy="72" r="5" fill="none" stroke={accent} strokeWidth="1.3" pathLength={1} className="draw-path" style={delay(0.85)} />
      </g>
    </g>
  );
}

/** Caster with spinning wheel — functional components. */
function CasterMotif() {
  return (
    <g>
      <g stroke={line} strokeWidth="1.5" fill="none">
        {/* top plate + bolt holes */}
        <rect x="104" y="44" width="112" height="12" rx="2" pathLength={1} className="draw-path" style={delay(0.25)} />
        <circle cx="118" cy="50" r="3.5" pathLength={1} className="draw-path" style={delay(0.4)} />
        <circle cx="202" cy="50" r="3.5" pathLength={1} className="draw-path" style={delay(0.4)} />
        {/* fork */}
        <path d="M122 56 l12 76" pathLength={1} className="draw-path" style={delay(0.45)} />
        <path d="M198 56 l-12 76" pathLength={1} className="draw-path" style={delay(0.45)} />
      </g>
      {/* wheel — rotating spokes */}
      <g className="animate-spin-slow" style={{ transformOrigin: "160px 150px", transformBox: "view-box" }}>
        <circle cx="160" cy="150" r="44" fill="none" stroke={line} strokeWidth="1.5" pathLength={1} className="draw-path" style={delay(0.5)} />
        {[30, 120, 210, 300].map((deg) => (
          <line
            key={deg}
            x1="160"
            y1="150"
            x2={160 + 38 * Math.cos((deg * Math.PI) / 180)}
            y2={150 + 38 * Math.sin((deg * Math.PI) / 180)}
            stroke={faint}
            strokeWidth="1.2"
            pathLength={1}
            className="draw-path"
            style={delay(0.65)}
          />
        ))}
        <circle cx="160" cy="150" r="10" fill="none" stroke={accent} strokeWidth="1.4" pathLength={1} className="draw-path" style={delay(0.8)} />
      </g>
      {/* ground with hatching */}
      <line x1="88" y1="202" x2="232" y2="202" stroke={line} strokeWidth="1.4" pathLength={1} className="draw-path" style={delay(0.9)} />
      <g stroke={faint} strokeWidth="1">
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1={98 + i * 17} y1="202" x2={90 + i * 17} y2="212" pathLength={1} className="draw-path" style={delay(1 + i * 0.03)} />
        ))}
      </g>
    </g>
  );
}

/** Part being drafted over construction geometry — custom components. */
function DraftMotif() {
  return (
    <g>
      {/* construction geometry */}
      <rect x="96" y="66" width="140" height="108" fill="none" stroke="hsl(var(--muted) / 0.55)" strokeWidth="1" className="centerline" />
      <circle cx="150" cy="120" r="54" fill="none" stroke="hsl(var(--muted) / 0.55)" strokeWidth="1" className="centerline" />
      {/* compass arc */}
      <path d="M258 156 A96 96 0 0 0 216 66" fill="none" stroke="hsl(var(--accent) / 0.5)" strokeWidth="1" className="centerline" />
      {/* the part taking shape */}
      <path
        d="M110 168 h64 v-26 h34 v-44 h-98 z"
        fill="hsl(var(--surface) / 0.5)"
        stroke={line}
        strokeWidth="1.6"
        pathLength={1}
        className="draw-path"
        style={{ ...delay(0.4), animationDuration: "2.4s" }}
      />
      <circle cx="140" cy="130" r="12" fill="none" stroke={accent} strokeWidth="1.4" pathLength={1} className="draw-path" style={delay(1)} />
      <line x1="118" y1="130" x2="162" y2="130" stroke="hsl(var(--accent) / 0.6)" strokeWidth="1" className="centerline" />
      <line x1="140" y1="108" x2="140" y2="152" stroke="hsl(var(--accent) / 0.6)" strokeWidth="1" className="centerline" />
      {/* dimension being added */}
      <g strokeWidth="1" className="animate-fade-in" style={{ animationDelay: "1.6s" }}>
        <line x1="110" y1="174" x2="110" y2="196" stroke={faint} />
        <line x1="174" y1="174" x2="174" y2="196" stroke={faint} />
        <line x1="110" y1="190" x2="174" y2="190" stroke={accent} markerStart="url(#hv-arrow)" markerEnd="url(#hv-arrow)" />
      </g>
      {/* datum crosshair */}
      <g stroke="hsl(var(--accent) / 0.55)" strokeWidth="1" className="animate-pulse-soft">
        <line x1="248" y1="188" x2="264" y2="188" />
        <line x1="256" y1="180" x2="256" y2="196" />
        <circle cx="256" cy="188" r="5" fill="none" />
      </g>
    </g>
  );
}

/** Isometric wireframe block with hidden edges + datum triad — CAD & drawings. */
function CubeMotif() {
  return (
    <g>
      {/* visible edges */}
      <g stroke={line} strokeWidth="1.5" fill="none">
        <path d="M110 170 L210 170 L210 110 L110 110 Z" pathLength={1} className="draw-path" style={delay(0.3)} />
        <path d="M110 110 L155 84 L255 84 L210 110" pathLength={1} className="draw-path" style={delay(0.45)} />
        <path d="M210 170 L255 144 L255 84" pathLength={1} className="draw-path" style={delay(0.6)} />
      </g>
      {/* hidden edges */}
      <g stroke={faint} strokeWidth="1.1" strokeDasharray="5 4" fill="none">
        <path d="M110 170 L155 144" pathLength={1} className="draw-path" style={delay(0.75)} />
        <path d="M155 144 L155 84" pathLength={1} className="draw-path" style={delay(0.8)} />
        <path d="M155 144 L255 144" pathLength={1} className="draw-path" style={delay(0.85)} />
      </g>
      {/* dimensions */}
      <g strokeWidth="1" className="animate-fade-in" style={{ animationDelay: "1.4s" }}>
        <line x1="110" y1="176" x2="110" y2="196" stroke={faint} />
        <line x1="210" y1="176" x2="210" y2="196" stroke={faint} />
        <line x1="110" y1="190" x2="210" y2="190" stroke={accent} markerStart="url(#hv-arrow)" markerEnd="url(#hv-arrow)" />
        <line x1="262" y1="84" x2="282" y2="84" stroke={faint} />
        <line x1="262" y1="144" x2="282" y2="144" stroke={faint} />
        <line x1="276" y1="84" x2="276" y2="144" stroke={accent} markerStart="url(#hv-arrow)" markerEnd="url(#hv-arrow)" />
      </g>
      {/* datum triad */}
      <g strokeWidth="1.3" className="animate-fade-in" style={{ animationDelay: "1.1s" }}>
        <line x1="56" y1="196" x2="88" y2="196" stroke={accent} markerEnd="url(#hv-arrow)" />
        <line x1="56" y1="196" x2="56" y2="164" stroke={accent} markerEnd="url(#hv-arrow)" />
        <line x1="56" y1="196" x2="76" y2="212" stroke={faint} markerEnd="url(#hv-arrow)" />
      </g>
      {/* bore on the top face */}
      <circle cx="182" cy="128" r="14" fill="none" stroke={accent} strokeWidth="1.3" pathLength={1} className="draw-path" style={delay(1)} />
      <line x1="162" y1="128" x2="202" y2="128" stroke="hsl(var(--accent) / 0.6)" strokeWidth="1" className="centerline" />
      <line x1="182" y1="108" x2="182" y2="148" stroke="hsl(var(--accent) / 0.6)" strokeWidth="1" className="centerline" />
    </g>
  );
}

/** Datasheet with fold, drawing block and spec lines — catalogues, docs, forms. */
function SheetMotif() {
  return (
    <g>
      {/* back sheet */}
      <rect x="104" y="52" width="128" height="164" rx="3" fill="none" stroke={faint} strokeWidth="1.2" pathLength={1} className="draw-path" style={delay(0.3)} />
      {/* front sheet with folded corner */}
      <path
        d="M90 40 h100 l28 28 v136 h-128 z"
        fill="hsl(var(--surface) / 0.6)"
        stroke={line}
        strokeWidth="1.5"
        pathLength={1}
        className="draw-path"
        style={delay(0.4)}
      />
      <path d="M190 40 v28 h28" fill="none" stroke={accent} strokeWidth="1.3" pathLength={1} className="draw-path" style={delay(0.6)} />
      {/* small drawing block: part + centerlines */}
      <circle cx="130" cy="92" r="16" fill="none" stroke={line} strokeWidth="1.3" pathLength={1} className="draw-path" style={delay(0.7)} />
      <line x1="108" y1="92" x2="152" y2="92" stroke="hsl(var(--accent) / 0.6)" strokeWidth="1" className="centerline" />
      <line x1="130" y1="70" x2="130" y2="114" stroke="hsl(var(--accent) / 0.6)" strokeWidth="1" className="centerline" />
      <rect x="158" y="82" width="42" height="20" rx="2" fill="none" stroke={faint} strokeWidth="1.2" pathLength={1} className="draw-path" style={delay(0.8)} />
      {/* spec lines */}
      <g stroke={faint} strokeWidth="1.4">
        {[128, 142, 156, 170].map((y, i) => (
          <line key={y} x1="104" y1={y} x2={i % 2 ? 176 : 200} y2={y} pathLength={1} className="draw-path" style={delay(0.9 + i * 0.08)} />
        ))}
      </g>
      {/* title block */}
      <line x1="90" y1="186" x2="218" y2="186" stroke={line} strokeWidth="1.2" pathLength={1} className="draw-path" style={delay(1.2)} />
      <line x1="150" y1="186" x2="150" y2="204" stroke={faint} strokeWidth="1" pathLength={1} className="draw-path" style={delay(1.3)} />
    </g>
  );
}

/** Exploded fastener assembly converging on a bore — applications. */
function AssemblyMotif() {
  return (
    <g>
      <line x1="160" y1="20" x2="160" y2="222" stroke={centre} strokeWidth="1" className="centerline" />
      {/* bolt, breathing toward the assembly */}
      <g className="explode-a">
        <path d="M138 46 L149 64 L171 64 L182 46 L171 28 L149 28 Z" fill="none" stroke={line} strokeWidth="1.4" pathLength={1} className="draw-path" style={delay(0.3)} />
        <rect x="152" y="64" width="16" height="26" rx="1" fill="none" stroke={line} strokeWidth="1.4" pathLength={1} className="draw-path" style={delay(0.45)} />
      </g>
      {/* washer */}
      <g className="explode-b">
        <rect x="128" y="112" width="64" height="10" rx="2" fill="none" stroke={line} strokeWidth="1.4" pathLength={1} className="draw-path" style={delay(0.55)} />
        <line x1="152" y1="112" x2="152" y2="122" stroke={faint} strokeWidth="1.1" pathLength={1} className="draw-path" style={delay(0.65)} />
        <line x1="168" y1="112" x2="168" y2="122" stroke={faint} strokeWidth="1.1" pathLength={1} className="draw-path" style={delay(0.65)} />
      </g>
      {/* base block with tapped bore */}
      <rect x="104" y="148" width="112" height="52" rx="3" fill="hsl(var(--surface) / 0.5)" stroke={line} strokeWidth="1.5" pathLength={1} className="draw-path" style={delay(0.7)} />
      <g stroke={faint} strokeWidth="1.1" strokeDasharray="5 4">
        <line x1="152" y1="148" x2="152" y2="188" pathLength={1} className="draw-path" style={delay(0.9)} />
        <line x1="168" y1="148" x2="168" y2="188" pathLength={1} className="draw-path" style={delay(0.9)} />
      </g>
      {/* bore section, side */}
      <circle cx="262" cy="174" r="20" fill="none" stroke={line} strokeWidth="1.3" pathLength={1} className="draw-path" style={delay(1)} />
      <circle cx="262" cy="174" r="8" fill="none" stroke={accent} strokeWidth="1.3" pathLength={1} className="draw-path" style={delay(1.1)} />
      <line x1="236" y1="174" x2="288" y2="174" stroke="hsl(var(--accent) / 0.6)" strokeWidth="1" className="centerline" />
      <line x1="262" y1="148" x2="262" y2="200" stroke="hsl(var(--accent) / 0.6)" strokeWidth="1" className="centerline" />
    </g>
  );
}

/** Sawtooth-roof works with running stack — industries. */
function FactoryMotif() {
  return (
    <g>
      {/* sawtooth building */}
      <path
        d="M60 190 V120 L104 90 V120 L148 90 V120 L192 90 V120 H236 V190 Z"
        fill="hsl(var(--surface) / 0.5)"
        stroke={line}
        strokeWidth="1.5"
        pathLength={1}
        className="draw-path"
        style={{ ...delay(0.3), animationDuration: "2s" }}
      />
      {/* windows + door */}
      <g stroke={faint} strokeWidth="1.2" fill="none">
        <rect x="76" y="140" width="24" height="18" pathLength={1} className="draw-path" style={delay(0.8)} />
        <rect x="116" y="140" width="24" height="18" pathLength={1} className="draw-path" style={delay(0.85)} />
        <rect x="156" y="140" width="24" height="18" pathLength={1} className="draw-path" style={delay(0.9)} />
        <rect x="200" y="158" width="22" height="32" pathLength={1} className="draw-path" style={delay(0.95)} />
      </g>
      {/* stack + pulsing exhaust */}
      <rect x="244" y="96" width="14" height="94" fill="none" stroke={line} strokeWidth="1.4" pathLength={1} className="draw-path" style={delay(0.6)} />
      <g fill="none" stroke="hsl(var(--accent) / 0.6)" strokeWidth="1.2" className="animate-pulse-soft">
        <circle cx="254" cy="82" r="6" />
        <circle cx="262" cy="66" r="8" />
      </g>
      {/* ground + hatching */}
      <line x1="40" y1="190" x2="284" y2="190" stroke={line} strokeWidth="1.4" pathLength={1} className="draw-path" style={delay(1)} />
      <g stroke={faint} strokeWidth="1">
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1={52 + i * 20} y1="190" x2={44 + i * 20} y2="200" pathLength={1} className="draw-path" style={delay(1.1 + i * 0.02)} />
        ))}
      </g>
      {/* roof glazing accents */}
      <g stroke="hsl(var(--accent) / 0.7)" strokeWidth="1.3">
        <line x1="60" y1="120" x2="104" y2="90" pathLength={1} className="draw-path" style={delay(0.7)} />
        <line x1="104" y1="120" x2="148" y2="90" pathLength={1} className="draw-path" style={delay(0.75)} />
        <line x1="148" y1="120" x2="192" y2="90" pathLength={1} className="draw-path" style={delay(0.8)} />
      </g>
    </g>
  );
}

/** Vernier caliper measuring a part, jaw sliding — engineering & about. */
function CaliperMotif() {
  return (
    <g>
      {/* main beam with scale */}
      <rect x="56" y="86" width="228" height="18" rx="2" fill="hsl(var(--surface) / 0.6)" stroke={line} strokeWidth="1.5" pathLength={1} className="draw-path" style={delay(0.3)} />
      <g stroke={faint} strokeWidth="1">
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={i} x1={72 + i * 13} y1="86" x2={72 + i * 13} y2={i % 5 === 0 ? 96 : 92} pathLength={1} className="draw-path" style={delay(0.5 + i * 0.03)} />
        ))}
      </g>
      {/* fixed jaw */}
      <path d="M56 104 v58 h14 v-58" fill="none" stroke={line} strokeWidth="1.5" pathLength={1} className="draw-path" style={delay(0.45)} />
      {/* sliding jaw + vernier, oscillating */}
      <g className="caliper-slide">
        <path d="M144 104 v58 h-14 v-58" fill="none" stroke={line} strokeWidth="1.5" pathLength={1} className="draw-path" style={delay(0.55)} />
        <rect x="130" y="104" width="44" height="16" rx="2" fill="none" stroke={accent} strokeWidth="1.3" pathLength={1} className="draw-path" style={delay(0.7)} />
        <g stroke="hsl(var(--accent) / 0.8)" strokeWidth="1">
          {[138, 146, 154, 162].map((x) => (
            <line key={x} x1={x} y1="112" x2={x} y2="120" pathLength={1} className="draw-path" style={delay(0.8)} />
          ))}
        </g>
      </g>
      {/* measured part */}
      <circle cx="100" cy="136" r="20" fill="hsl(var(--accent) / 0.1)" stroke={accent} strokeWidth="1.4" pathLength={1} className="draw-path" style={delay(0.9)} />
      <line x1="74" y1="136" x2="126" y2="136" stroke="hsl(var(--accent) / 0.6)" strokeWidth="1" className="centerline" />
      <line x1="100" y1="110" x2="100" y2="162" stroke="hsl(var(--accent) / 0.6)" strokeWidth="1" className="centerline" />
      {/* depth rod */}
      <rect x="284" y="92" width="24" height="6" fill="none" stroke={faint} strokeWidth="1.2" pathLength={1} className="draw-path" style={delay(1)} />
    </g>
  );
}
