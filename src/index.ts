console.log("DEBUG: Starting dotenv config");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: "C:/Users/VictorLosada/TeamsApps/TeamsBot/env/.env.local" });

import * as restify from "restify";
import { commandApp } from "./internal/initialize";
import { TeamsBot } from "./teamsBot";
import { cca } from "./internal/graphClient"; // Import MSAL configuration
import { setAccessToken } from "./internal/tokenManager"; // Import tokenManager


// Create a restify server
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\nApp Started, ${server.name} listening to ${server.url}`);
});

// Endpoint for handling bot messages
const teamsBot = new TeamsBot();
server.post("/api/messages", (req, res, next) => {
  commandApp
    .requestHandler(req, res, async (context) => {
      await teamsBot.run(context);
    })
    .then(() => next())
    .catch((err) => {
      console.error("Error handling bot message:", err);
      next(err);
    });
});

// Endpoint to start the authentication flow
server.get("/auth", (req, res, next) => {
  cca.getAuthCodeUrl({
    scopes: ["https://graph.microsoft.com/.default"],
    redirectUri: `${process.env.REDIRECT_URI}/auth/callback`,
  })
    .then((authUrl) => {
      console.log("Redirecting user to auth URL:", authUrl);
      res.redirect(authUrl, next);
    })
    .catch((error) => {
      console.error("Error generating auth URL:", error);
      res.send(500, "Failed to generate authentication URL.");
      next();
    });
});

server.get("/auth/callback", (req, res, next) => {
  const urlParams = new URLSearchParams(req.getQuery());
  const code = urlParams.get("code");

  if (!code) {
    console.error("Authorization code is missing.");
    res.send(400, "Authorization code missing.");
    return next();
  }

  cca.acquireTokenByCode({
    code: code,
    scopes: ["https://graph.microsoft.com/.default"],
    redirectUri: `${process.env.REDIRECT_URI}/auth/callback`,
  })
    .then((tokenResponse) => {
      console.log("Authentication successful:", tokenResponse);
      setAccessToken(tokenResponse.accessToken); // Use tokenManager to store the token
      res.send(200, "Authentication successful! You can close this window.");
      return next();
    })
    .catch((error) => {
      console.error("Error during authentication:", error);
      res.send(500, "Authentication failed.");
      return next();
    });
});



