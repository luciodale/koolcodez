import { type ReactNode } from 'react';

// Using a 'type' alias for the DemoContainer's props
type DemoContainerProps = {
  children: ReactNode;
};

// A utility component for consistent demo styling
function DemoContainer({ children }: DemoContainerProps) {
  return (
    <div className="border border-slate-700/50 rounded-xl backdrop-blur-sm">
      {/* Header */}
      <div className="p-2 flex items-center gap-3 border-b border-slate-700/50">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <div className="text-slate-300 font-medium text-lg">Demo</div>
      </div>
      
      {/* Interactive Demo */}
      <div className="p-4 border-slate-700/50">
        {children}
      </div>
    </div>
  );
}

export function AccentColorExample() {
  return (
    <DemoContainer>
      <div className="[accent-color:blue] flex flex-col gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" defaultChecked className="w-[18px] h-[18px]" />
          Accept terms and conditions
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="radio-group" defaultChecked className="w-[18px] h-[18px]" />
          Option 1
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="radio-group" className="w-[18px] h-[18px]" />
          Option 2
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          Range: <input type="range" min="0" max="100" defaultValue="75" className="w-full h-5" />
        </label>
      </div>
    </DemoContainer>
  );
}

export function HasSelectorExample() {
  return (
    <DemoContainer>
      <div className="space-y-4">
        <div className="border-2 border-slate-600 p-4 rounded-lg transition-all duration-300 ease-in-out [&:has(input:checked)]:border-green-500 [&:has(input:checked)]:bg-green-900/30 [&:has(input:checked)]:scale-[1.02]">
          <label className="flex items-center gap-2 font-bold cursor-pointer text-red-400">
            <input type="checkbox" className="w-[18px] h-[18px]" />
            Click me to change my parent's border and background!
          </label>
        </div>
        <div className="border-2 border-slate-600 p-4 rounded-lg transition-all duration-300 ease-in-out [&:has(input:checked)]:border-green-500 [&:has(input:checked)]:bg-green-900/30 [&:has(input:checked)]:scale-[1.02]">
          <label className="flex items-center gap-2 font-bold cursor-pointer text-red-400">
            <input type="checkbox" className="w-[18px] h-[18px]" />
            This card will also change when checked
          </label>
        </div>
      </div>
    </DemoContainer>
  );
}

export function TextWrapExample() {
  return (
    <DemoContainer>
      <div className="flex justify-center items-center flex-col md:flex-row gap-6">
        <div className="w-full max-w-[300px] md:w-1/2 border border-slate-600 p-4 rounded-lg bg-slate-700">
          <div className="w-full text-xl leading-tight text-slate-200">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem aut cum eum id quos est.
          </div>
        </div>
        <div className="w-full max-w-[300px] md:w-1/2 border border-slate-600 p-4 rounded-lg bg-slate-700">
          <div className="w-full text-xl leading-tight [text-wrap:balance] text-slate-200">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem aut cum eum id quos est.
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}

export function ScrollSnapExample() {
  return (
    <DemoContainer>
      <p className="text-sm text-slate-400 mb-4">
        Scroll horizontally to see the snap behavior
      </p>
      <div className="flex overflow-x-auto [scroll-snap-type:x_mandatory] rounded-lg gap-0 [scrollbar-width:thin] [scrollbar-color:#475569_#1e293b]">
        <div className="flex-none w-full h-[150px] grid place-items-center text-3xl font-bold [scroll-snap-align:center] rounded-lg text-white bg-red-500">Slide 1</div>
        <div className="flex-none w-full h-[150px] grid place-items-center text-3xl font-bold [scroll-snap-align:center] rounded-lg text-white bg-blue-500">Slide 2</div>
        <div className="flex-none w-full h-[150px] grid place-items-center text-3xl font-bold [scroll-snap-align:center] rounded-lg text-white bg-purple-500">Slide 3</div>
        <div className="flex-none w-full h-[150px] grid place-items-center text-3xl font-bold [scroll-snap-align:center] rounded-lg text-white bg-green-500">Slide 4</div>
      </div>
    </DemoContainer>
  );
}

export function AspectRatioExample() {
  return (
    <DemoContainer>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-slate-400 mb-2">16:9 aspect ratio</p>
          <div className="w-full [aspect-ratio:16/9] bg-blue-500 grid place-items-center font-bold rounded-lg text-white">
            16:9 Video
          </div>
        </div>
        <div>
          <p className="text-sm text-slate-400 mb-2">1:1 square ratio</p>
          <div className="w-full [aspect-ratio:1] bg-red-500 grid place-items-center font-bold rounded-lg text-white">
            Square
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}

export function OverscrollBehaviorExample() {
  return (
    <DemoContainer>
      <p className="text-sm text-slate-400 mb-4">
        Scroll inside the inner box. Without <code className="bg-slate-700 px-1 rounded text-xs">overscroll-behavior</code>, the parent would scroll too.
      </p>
      
      <div className="h-[300px] overflow-auto p-6 rounded-xl border border-slate-600 shadow-inner">
        <div className="space-y-4">
          <div className="bg-slate-700 p-4 rounded-lg shadow-sm border border-slate-600">
            <h4 className="font-semibold text-slate-200 mb-2">Parent Container</h4>
            <p className="text-sm text-slate-300">This content scrolls normally when you reach the top/bottom.</p>
          </div>
          
          <div className="bg-slate-700 border-2 border-blue-500/30 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-blue-900/50 px-4 py-2 border-b border-blue-500/30">
              <h4 className="font-semibold text-blue-300 text-sm">Inner Container with overscroll-behavior: contain</h4>
            </div>
            <div className="h-[120px] overflow-auto bg-slate-800 p-4 [overscroll-behavior:contain]">
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-16 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  Scroll me down!
                </div>
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-16 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  Keep scrolling...
                </div>
                <div className="bg-gradient-to-r from-orange-600 to-red-600 h-16 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  Almost there...
                </div>
                <div className="bg-gradient-to-r from-pink-600 to-rose-600 h-16 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  You reached the bottom!
                </div>
                <div className="bg-slate-600 h-8 rounded flex items-center justify-center text-slate-300 text-xs">
                  Parent won't scroll when you reach here
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-700 p-4 rounded-lg shadow-sm border border-slate-600">
            <h4 className="font-semibold text-slate-200 mb-2">More Parent Content</h4>
            <p className="text-sm text-slate-300">This content stays in place when the inner container overscrolls.</p>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}

export function InsetExample() {
  return (
    <DemoContainer>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-slate-400 mb-2">inset: 1rem</p>
          <div className="relative h-[120px] bg-slate-700 rounded-lg border border-slate-600">
            <div className="absolute inset-4 bg-blue-600 rounded grid place-items-center font-bold text-white">
              1rem offset
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm text-slate-400 mb-2">inset: 0</p>
          <div className="relative h-[120px] bg-slate-700 rounded-lg border border-slate-600">
            <div className="absolute inset-0 bg-red-600 rounded grid place-items-center font-bold text-white">
              Full cover
            </div>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}

export function GapExample() {
  return (
    <DemoContainer>
      <p className="text-sm text-slate-400 mb-4">
        The <code className="bg-slate-700 px-1 rounded text-xs">gap</code> property works differently in flexbox vs grid layouts.
      </p>
      
      <div className="space-y-6">
        {/* Flexbox Gap */}
        <div>
          <h4 className="text-slate-200 font-semibold mb-3">Flexbox with gap</h4>
          <div className="flex gap-4 p-4 bg-slate-700 rounded-lg border border-slate-600">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">1</div>
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">2</div>
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">3</div>
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">4</div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Gap creates space between flex items (horizontal spacing)</p>
        </div>

        {/* Grid Gap */}
        <div>
          <h4 className="text-slate-200 font-semibold mb-3">Grid with gap</h4>
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-700 rounded-lg border border-slate-600">
            <div className="bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">1</div>
            <div className=" bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">2</div>
            <div className=" bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">3</div>
            <div className=" bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">4</div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Gap creates space between grid items (both row and column spacing)</p>
        </div>

      </div>
    </DemoContainer>
  );
}

export function PointerEventsExample() {
  return (
    <DemoContainer>
      <p className="text-sm text-slate-400 mb-4">
        The red overlay has <code className="bg-slate-700 px-1 rounded text-xs">pointer-events: none</code>, so you can click the button underneath it.
      </p>
      <div className="relative h-[200px] border border-slate-600 rounded-lg bg-slate-700 overflow-hidden">
        {/* Background button */}
        <button 
          className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 bg-blue-600 border-none text-white rounded-lg cursor-pointer font-bold transition-colors hover:bg-blue-700 z-10" 
          onClick={() => alert('Button clicked! The overlay didn\'t block the click.')}
        >
          Click Me
        </button>
        
        {/* Overlay with pointer-events: none */}
        <div className="absolute inset-0 bg-red-500/60 z-20 flex items-start justify-center pt-8 [pointer-events:none]">
          <div className="text-white font-bold text-lg">
            Overlay with pointer-events: none
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}