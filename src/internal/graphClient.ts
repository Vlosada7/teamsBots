import { Client } from "@microsoft/microsoft-graph-client";
import { ConfidentialClientApplication } from "@azure/msal-node";

const msalConfig = {
  auth: {
    clientId: process.env.MICROSOFT_GRAPH_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_GRAPH_TENANT_ID}`,
    clientSecret: process.env.MICROSOFT_GRAPH_CLIENT_SECRET,
  },
};

export const cca = new ConfidentialClientApplication(msalConfig);

async function getAccessToken() {
  try {
    const result = await cca.acquireTokenByClientCredential({
      scopes: ["https://graph.microsoft.com/.default"],
    });
    console.log("Access token acquired successfully");
    return result.accessToken;
  } catch (error) {
    console.error("Error acquiring access token:", error);
    throw error;
  }
}

export async function getGraphClient() {
  const token = await getAccessToken();
  return Client.init({
    authProvider: (done) => {
      done(null, token);
    },
  });
}
