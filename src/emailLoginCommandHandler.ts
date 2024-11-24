import { Activity, TurnContext } from "botbuilder";
import { CommandMessage, TeamsFxBotCommandHandler, TriggerPatterns } from "@microsoft/teamsfx";

export class EmailLoginCommandHandler implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = /^loginEmail$/i;

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    const loginUrl = `https://login.microsoftonline.com/${process.env.MICROSOFT_GRAPH_TENANT_ID}/oauth2/v2.0/authorize?client_id=${process.env.MICROSOFT_GRAPH_CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}&response_mode=query&scope=Mail.Read User.Read&state=12345`;

    return `Please log in using the following link: [Login](${loginUrl})`;
  }
}
