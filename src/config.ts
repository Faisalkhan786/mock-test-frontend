// ============================================================
//  BACKEND KA ADDRESS
// ============================================================
// Tunnel mode use kar rahe ho (ngrok), to niche NGROK_BACKEND_URL me
// apna ngrok wala https URL paste karo aur USE_TUNNEL = true rakho.
//
// Flow:
//   1. Backend chalao:            npm run dev        (mock-test-backend)
//   2. Backend tunnel chalao:     npm run tunnel     (ngrok http 4000)
//      -> "Forwarding  https://xxxx-xx.ngrok-free.app -> http://localhost:4000"
//   3. Wo https URL niche paste karo.
//   4. Expo tunnel se app chalao: npm run start:tunnel  (mock-test-frontend)
// ============================================================

const USE_TUNNEL = true;

// <-- yahan har baar naya ngrok URL paste karo (ngrok free me ye badalta rehta hai)
const NGROK_BACKEND_URL = "https://calorie-provided-bottling.ngrok-free.dev";

// Same Wi-Fi wala option (tunnel ke bina). Auto-detected LAN IP: 192.168.1.11
const LAN_BACKEND_URL = "http://192.168.1.11:4000";

export const API_BASE_URL = USE_TUNNEL ? NGROK_BACKEND_URL : LAN_BACKEND_URL;
