const BASE_URL = "http://localhost:8000";

export async function getRecoveryStatus() {
  const res = await fetch(`${BASE_URL}/recovery-status`);
  return await res.json();
}
