import { Client } from "@microsoft/microsoft-graph-client";
import { getAccessToken } from "./internal/tokenManager";

export async function getEmailsForAuthenticatedUser(subjects: string[]): Promise<any[]> {
  const accessToken = getAccessToken(); // Recupera o token armazenado

  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });

  const emails: any[] = [];
  for (const subject of subjects) {
    const response = await client.api("/me/messages").filter(`subject eq '${subject}'`).get();
    emails.push(...response.value);
  }

  return emails;
}
