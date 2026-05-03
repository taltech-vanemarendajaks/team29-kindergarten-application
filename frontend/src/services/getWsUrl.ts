export function getWsUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL;

  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  return base
    .replace("http://", "ws://")
    .replace("https://", "wss://") + "/ws";
}