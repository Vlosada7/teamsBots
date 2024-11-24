let accessToken = "";

export function setAccessToken(token: string) {
  accessToken = token;
}

export function getAccessToken(): string {
  if (!accessToken) {
    throw new Error("Access token is not set. Please log in first.");
  }
  return accessToken;
}
