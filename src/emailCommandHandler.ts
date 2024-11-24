import { Activity, TurnContext } from "botbuilder";
import { CommandMessage, TeamsFxBotCommandHandler, TriggerPatterns } from "@microsoft/teamsfx";
import { getEmailsForAuthenticatedUser } from "./emailHandler";

export class EmailCommandHandler implements TeamsFxBotCommandHandler {
    triggerPatterns: TriggerPatterns = /^download\siso$/i;
  
    async handleCommandReceived(
      context: TurnContext,
      message: CommandMessage
    ): Promise<string | Partial<Activity> | void> {
      console.log(`Triggered EmailCommandHandler with message: ${message.text}`);
  
      const subjects = ["Start Of Day", "End Of Day"];
      try {
        const emails = await getEmailsForAuthenticatedUser(subjects);
  
        if (emails.length === 0) {
          return `No emails found with subjects: ${subjects.join(", ")}`;
        }
  
        let response = "Emails found:\n";
        emails.forEach((email) => {
          response += `\nFrom: ${email.from?.emailAddress?.name}\nSubject: ${email.subject}\n\n`;
        });
  
        return response;
      } catch (error) {
        console.error("Error fetching emails:", error);
        return "An error occurred while fetching emails. Please ensure you are logged in.";
      }
    }
  }
