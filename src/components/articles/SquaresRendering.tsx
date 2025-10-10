import { useMemo, useRef, useState } from "react";

type Position = { left: number; top: number };

const SQUARE_SIZE = 48;
const GAP = 10;
const DURATION_MS = 500;
const SQUARE_NUMBER = 121;
const COLS = 11;
const COUNT_THRESHOLD1 = 130;
const COUNT_THRESHOLD2 = 400;

function computeGridPositions(count: number,
  squareSize: number,
  gap: number,
  cols: number
): { positions: Position[]; rows: number } {

  const positions: Position[] = [];
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    positions.push({ left: col * (squareSize + gap), top: row * (squareSize + gap) });
  }
  const rows = Math.ceil(count / cols);
  console.log('positions', positions);

  return { positions, rows };
}

function shuffleIndices(length: number): number[] {
  const next = Array.from({ length }, (_, i) => i);
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

type DemoProps = {
  count: number;
  indices: number[];
  positions: Position[];
  rows: number;
  isAnimating: boolean;
  showShadow: boolean;
  squareSize: number;
  gap: number;
};

function BadSquaresInner({ count, indices, positions, rows, showShadow, squareSize, gap}: DemoProps): React.ReactElement {
  const containerHeight = rows * (squareSize + gap) - gap;

  return (
    <div className="relative" style={{height: containerHeight}}>
      {Array.from({ length: count }, (_, i) => {
        const idx = indices[i];
        const { left, top } = positions[idx] ?? { left: 0, top: 0 };
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: squareSize,
              height: squareSize,
              borderRadius: 8,
              border: "2px solid #ef4723",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              top,
              left,
              transition: "top 500ms ease, left 500ms ease",
              boxShadow: showShadow ? "0 14px 28px rgba(239,68,68,0.45)" : undefined,
            }}
          >
            {i + 1}
          </div>
        );
      })}
    </div>
  );
}

function GoodSquaresInner({ count, indices, positions, rows, isAnimating, showShadow, squareSize, gap }: DemoProps): React.ReactElement {
  const containerHeight = rows * (squareSize + gap) - gap;
  return (
    <div className="relative" style={{height: containerHeight}}>
      {Array.from({ length: count }, (_, i) => {
        const idx = indices[i];
        const { left, top } = positions[idx] ?? { left: 0, top: 0 };
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: squareSize,
              height: squareSize,
              borderRadius: 8,
              border: "2px solid #22c55e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              transform: `translate(${left}px, ${top}px)`,
              opacity: isAnimating ? 0.9 : 1,
              transition: "transform 500ms ease, opacity 500ms ease",
              boxShadow: showShadow ? "0 14px 28px rgba(239,68,68,0.45)" : undefined,
            }}
          >
            {i + 1}
          </div>
        );
      })}
    </div>
  );
}

export function SquaresRendering(): React.ReactElement {
  const [mode, setMode] = useState<"bad" | "good">("bad");
  const [indices, setIndices] = useState<number[]>(() => Array.from({ length: SQUARE_NUMBER }, (_, i) => i));
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showShadow, setShowShadow] = useState<boolean>(true);
  const refDebounceShuffle = useRef<NodeJS.Timeout | null>(null);
  const [resize, setResize] = useState<boolean>(false);

  const count = indices.length;
  const squareSize = resize ? count > COUNT_THRESHOLD2 ? 18 : count > COUNT_THRESHOLD1 ? 27 : SQUARE_SIZE : SQUARE_SIZE;
  const gap = resize ? count > COUNT_THRESHOLD2 ? 0.5 : count > COUNT_THRESHOLD1 ? 2 : GAP : GAP;
  const cols = resize ? count > COUNT_THRESHOLD2 ? COLS * 3 : count > COUNT_THRESHOLD1 ? COLS * 2 : COLS : COLS; 

  const { positions, rows } = useMemo(() => {
    return computeGridPositions(count, squareSize, gap, cols);
  }, [count, squareSize, gap, cols]);

  function onCountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIndices(Array.from({ length: Number(e.target.value) }, (_, i) => i));
  }

  function onResizeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setResize(e.target.checked);
  }
  
  const onShuffle = () => {
    setIndices(shuffleIndices(count));
    setIsAnimating(true);

    if (refDebounceShuffle.current) {
        clearTimeout(refDebounceShuffle.current);
    } 

    refDebounceShuffle.current = setTimeout(() => 
        setIsAnimating(false) ,DURATION_MS);
    };

  const tabBaseClass = `px-2.5 py-1.5 font-bold text-white cursor-pointer flex-1 rounded-2xl border`;

  const badTabClass = `${tabBaseClass} ${
    mode === "bad" ? "bg-red-600 border-red-600" : "hover:border-red-600 border-black"
  }`;
  const goodTabClass = `${tabBaseClass} ${
    mode === "good" ? "bg-green-600 border-green-600" : "hover:border-green-600 border-black"
  }`;

  return (
    <div>
      <div className="flex flex-col items-center gap-3 mb-3">
        <div className="flex w-full gap-3">
          <button onClick={() => setMode("bad")} className={`${badTabClass}`}>Unoptimized</button>
          <button onClick={() => setMode("good")} className={`${goodTabClass}`}>Optimized</button>
        </div>
        <div className={`border rounded-2xl w-full flex flex-col justify-center items-center gap-4 py-4 ${mode === "bad" ? "border-red-600" : "border-green-600"}`}>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={showShadow} onChange={e => setShowShadow(e.target.checked)} />
          <span>Shadow</span>
        </label>
        <div className="w-1/2">
        <div className="flex justify-between items-center pb-1">

          <span className="text-sm">Number of squares: {count}</span>
          <label className="flex items-center gap-1">
          <input type="checkbox" checked={resize} onChange={onResizeChange} />
          <span className="text-sm">Resize</span>
        </label>
        </div>
        <input onChange={onCountChange} type="range" min={10} max={1000} defaultValue={SQUARE_NUMBER} className="w-full h-5" />
        </div>
      <button onClick={onShuffle} className={`w-fit px-3 py-2 rounded-2xl border font-extrabold cursor-pointer ${mode === "bad" ? "border-red-600" : "border-green-600"}`}>Shuffle</button>
        </div>
      </div>

<div style={{fontSize: resize ? count > COUNT_THRESHOLD2 ? '8px' : count > COUNT_THRESHOLD1 ? '10px' : 'inherit' : 'inherit'}}>
      {mode === "bad" ? (
        <BadSquaresInner count={count} indices={indices} positions={positions} rows={rows} isAnimating={isAnimating} showShadow={showShadow} squareSize={squareSize} gap={gap} />
      ) : (
        <GoodSquaresInner count={count} indices={indices} positions={positions} rows={rows} isAnimating={isAnimating} showShadow={showShadow} squareSize={squareSize} gap={gap} />
      )}
    </div>
    </div>
  );
}

