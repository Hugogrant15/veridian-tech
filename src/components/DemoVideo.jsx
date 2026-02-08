import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import {
  CheckCircle,
  QrCode,
  Menu,
  Bell,
  Calendar,
  Wrench,
  Users,
  ScanLine,
} from "lucide-react";

export const DemoVideo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- ANIMATION HELPERS ---
  const spr = (delay) =>
    spring({
      frame: frame - delay,
      fps,
      config: { damping: 200 },
    });

  // === SCENE TIMING ===
  // 0-100: Login
  // 100-220: Dashboard & Generate
  // 220-300: Guard Scan

  const loginOpacity = interpolate(frame, [90, 100], [1, 0]);
  const dashOpacity = interpolate(frame, [90, 100, 210, 220], [0, 1, 1, 0]);
  const guardOpacity = interpolate(frame, [210, 220], [0, 1]);

  // Login Animations
  const typePhone = interpolate(frame, [20, 50], [0, 11]); // "09088989098"
  const typePass = interpolate(frame, [50, 70], [0, 6]); // "••••••"
  const btnScale = interpolate(frame, [75, 80, 85], [1, 0.95, 1]);

  // Dashboard Animations
  const modalUp = interpolate(frame, [130, 150], [500, 0], {
    extrapolateRight: "clamp",
  });
  const modalOpacity = interpolate(frame, [130, 150], [0, 1], {
    extrapolateRight: "clamp",
  });
  const showCode = spr(170);

  // Guard Animations
  const scanLine = interpolate(frame, [230, 280], [0, 100], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const successScale = spr(270);

  // --- MOCK DATA ---
  const PHONE = "09088989098";

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* ==================== SCENE 1: LOGIN ==================== */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center font-sans"
        style={{ opacity: loginOpacity }}
      >
        {/* Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

        <div className="relative w-full max-w-sm p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">EasyPass</h1>
            <p className="text-gray-300 text-xs tracking-widest uppercase">
              Secure Access Control
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase ml-1">
                Phone Number
              </label>
              <div className="w-full h-12 px-4 bg-black/20 border border-white/10 rounded-xl text-white flex items-center mt-1">
                {PHONE.substring(0, Math.round(typePhone))}
                {frame > 20 && frame < 50 && (
                  <span className="animate-pulse">|</span>
                )}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase ml-1">
                Password
              </label>
              <div className="w-full h-12 px-4 bg-black/20 border border-white/10 rounded-xl text-white flex items-center mt-1 text-xl tracking-widest">
                {"••••••".substring(0, Math.round(typePass))}
              </div>
            </div>

            <button
              style={{ transform: `scale(${btnScale})` }}
              className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg bg-gradient-to-r from-blue-600 to-emerald-600 mt-2"
            >
              {frame > 80 ? "Authenticating..." : "Sign In"}
            </button>
          </div>
        </div>
      </div>

      {/* ==================== SCENE 2: DASHBOARD ==================== */}
      <div
        className="absolute inset-0 bg-gray-900 font-sans text-white overflow-hidden"
        style={{ opacity: dashOpacity }}
      >
        {/* Header */}
        <header className="sticky top-0 bg-black/20 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold">
              EP
            </div>
            <span className="text-sm font-bold">Resident Portal</span>
          </div>
          <div className="flex gap-4">
            <Bell size={20} className="text-gray-400" />
            <Menu size={20} className="text-gray-400" />
          </div>
        </header>

        <main className="p-6 max-w-lg mx-auto space-y-6">
          {/* Welcome */}
          <div>
            <h2 className="text-2xl font-bold">Welcome, John</h2>
            <p className="text-gray-400 text-sm">Residency: Block B, Flat 4</p>
          </div>

          {/* Action Card (Invite) */}
          <div className="relative group transform transition-all active:scale-95">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-75"></div>
            <div className="relative bg-gray-900 ring-1 ring-white/10 rounded-xl px-6 py-5 flex items-center justify-between">
              <div>
                <span className="block text-xl font-bold text-white mb-1">
                  Invite Visitor
                </span>
                <span className="text-xs text-gray-400">
                  Generate one-time code
                </span>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Users size={20} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-xl border border-white/5">
              <Calendar className="text-pink-500 mb-2" size={20} />
              <div className="font-bold">Events</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-xl border border-white/5">
              <Wrench className="text-emerald-500 mb-2" size={20} />
              <div className="font-bold">Service</div>
            </div>
          </div>
        </main>

        {/* GENERATE MODAL */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
          style={{ opacity: modalOpacity }}
        >
          <div
            className="w-full max-w-md bg-gray-900 border border-white/10 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl"
            style={{ transform: `translateY(${modalUp}px)` }}
          >
            <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-center mb-6">
              Access Generated
            </h3>

            <div
              style={{ transform: `scale(${showCode})`, opacity: showCode }}
              className="bg-white p-6 rounded-2xl mx-auto w-64 h-64 flex flex-col items-center justify-center shadow-lg"
            >
              <QrCode size={180} color="black" />
              <p className="text-black font-mono font-bold text-2xl mt-4 tracking-widest">
                894-221
              </p>
            </div>

            <button className="w-full mt-8 py-3 bg-white/10 rounded-xl font-bold">
              Share Code
            </button>
          </div>
        </div>
      </div>

      {/* ==================== SCENE 3: GUARD SCAN ==================== */}
      <div
        className="absolute inset-0 bg-black font-sans flex flex-col"
        style={{ opacity: guardOpacity }}
      >
        <div className="flex-1 relative overflow-hidden">
          {/* Camera Feed Simulation */}
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <div className="text-gray-600 text-xs">Camera Feed Active</div>
          </div>

          {/* The QR Code being scanned (in world) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50 blur-sm">
            <QrCode size={200} color="white" />
          </div>

          {/* Scanner Overlay */}
          <div className="absolute inset-0 border-[40px] border-black/50 z-10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/50 rounded-lg z-20 flex flex-col justify-between p-2">
            <div className="flex justify-between">
              <ScanLine size={20} className="text-emerald-400" />
              <ScanLine size={20} className="text-emerald-400 rotate-90" />
            </div>
            <div
              className="h-0.5 bg-red-500 w-full shadow-[0_0_10px_red]"
              style={{ top: `${scanLine}%`, position: "relative" }}
            ></div>
            <div className="flex justify-between">
              <ScanLine size={20} className="text-emerald-400 -rotate-90" />
              <ScanLine size={20} className="text-emerald-400 rotate-180" />
            </div>
          </div>

          {/* SUCCESS OVERLAY */}
          <div
            style={{
              transform: `scale(${successScale})`,
              opacity: successScale,
            }}
            className="absolute inset-0 bg-emerald-600/90 z-50 flex flex-col items-center justify-center text-white"
          >
            <div className="bg-white rounded-full p-4 mb-4 shadow-xl">
              <CheckCircle size={64} className="text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold">Allowed</h2>
            <p className="text-emerald-100 mt-2">Simulated Guest</p>
            <div className="mt-8 px-4 py-1 bg-black/20 rounded-full font-mono text-sm">
              Code: 894-221
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
