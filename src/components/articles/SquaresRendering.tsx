import React, { useMemo, useRef, useState } from "react";

type Position = { left: number; top: number };

const SQUARE_SIZE = 48;
const GAP = 10;
const DURATION_MS = 500;

function computeGridPositions(count: number): { positions: Position[]; rows: number } {
  const cols = Math.max(1, Math.ceil(Math.sqrt(count))); // simple, no container measurement
  const positions: Position[] = [];
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    positions.push({ left: col * (SQUARE_SIZE + GAP), top: row * (SQUARE_SIZE + GAP) });
  }
  const rows = Math.ceil(count / cols);
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
};

function BadSquaresInner({ count, indices, positions, rows, isAnimating, showShadow }: DemoProps): React.ReactElement {
  const containerHeight = rows * (SQUARE_SIZE + GAP) - GAP;
	
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
              width: SQUARE_SIZE,
              height: SQUARE_SIZE,
              borderRadius: 8,
              border: "2px solid #ef4723",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              color: "white",
              boxSizing: "border-box",
              top,
              left,
              transition: isAnimating ? "top 500ms ease, left 500ms ease" : undefined,
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

function GoodSquaresInner({ count, indices, positions, rows, isAnimating, showShadow }: DemoProps): React.ReactElement {
  const containerHeight = rows * (SQUARE_SIZE + GAP) - GAP;
  return (
    <div style={{ position: "relative", width: "100%", height: containerHeight, borderRadius: 8, overflow: "hidden" }}>
      {Array.from({ length: count }, (_, i) => {
        const idx = indices[i];
        const { left, top } = positions[idx] ?? { left: 0, top: 0 };
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: SQUARE_SIZE,
              height: SQUARE_SIZE,
              borderRadius: 8,
              border: "2px solid #22c55e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              color: "white",
              boxSizing: "border-box",
              transform: `translate(${left}px, ${top}px)`,
              opacity: isAnimating ? 0.7 : 1,
              transition: isAnimating ? "transform 500ms ease, opacity 500ms ease" : undefined,
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
  const [count] = useState<number>(121);
  const [mode, setMode] = useState<"bad" | "good">("bad");
  const [indices, setIndices] = useState<number[]>(() => Array.from({ length: count }, (_, i) => i));
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showShadow, setShowShadow] = useState<boolean>(false);
  const refDebounceShuffle = useRef<NodeJS.Timeout | null>(null);

  const { positions, rows } = useMemo(() => computeGridPositions(count), [count]);

  const onShuffle = () => {
    setIndices(shuffleIndices(count));
    setIsAnimating(true);

    if (refDebounceShuffle.current) {
        clearTimeout(refDebounceShuffle.current);
    } 

    refDebounceShuffle.current = setTimeout(() => 
        setIsAnimating(false) ,DURATION_MS + 50);
    };

  const btnBaseClass = `px-2.5 py-1.5 rounded-xl border font-bold cursor-pointer`;

  const badBtnClass = `${btnBaseClass} ${
    mode === "bad" ? "border-orange-600 bg-red-100 text-orange-600" : "border-orange-600 text-orange-600 bg-transparent"
  }`;
  const goodBtnClass = `${btnBaseClass} ${
    mode === "good" ? "border-green-500 bg-green-100 text-green-600" : "border-green-500 text-green-600 bg-transparent"
  }`;

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <button onClick={onShuffle} className="px-3 py-2 rounded-2xl border border-orange-600 bg-transparent text-orange-600 font-extrabold cursor-pointer">Shuffle</button>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={showShadow} onChange={e => setShowShadow(e.target.checked)} />
          <span>Shadow</span>
        </label>
        <div className="flex items-center gap-2">
          <button onClick={() => setMode("bad")} className={badBtnClass}>Unoptimized</button>
          <button onClick={() => setMode("good")} className={goodBtnClass}>Optimized</button>
        </div>
      </div>

      {mode === "bad" ? (
        <BadSquaresInner count={count} indices={indices} positions={positions} rows={rows} isAnimating={isAnimating} showShadow={showShadow} />
      ) : (
        <GoodSquaresInner count={count} indices={indices} positions={positions} rows={rows} isAnimating={isAnimating} showShadow={showShadow} />
      )}
    </div>
  );
}

