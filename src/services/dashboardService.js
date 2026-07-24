const BASE_URL = "http://localhost:8000";

export async function getDashboard() {
  const response = await fetch(`${BASE_URL}/dashboard`);

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard");
  }

  return response.json();
}