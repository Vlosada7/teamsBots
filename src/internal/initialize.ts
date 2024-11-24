import { HelloWorldCommandHandler } from "../helloworldCommandHandler";
import { GenericCommandHandler } from "../genericCommandHandler";
import { EmailCommandHandler } from "../emailCommandHandler";
import { EmailLoginCommandHandler } from "../emailLoginCommandHandler";
import { BotBuilderCloudAdapter } from "@microsoft/teamsfx";
import ConversationBot = BotBuilderCloudAdapter.ConversationBot;
import config from "./config";

export const commandApp = new ConversationBot({
  adapterConfig: config,
  command: {
    enabled: true,
    commands: [
      new HelloWorldCommandHandler(),
      new EmailCommandHandler(),
      new EmailLoginCommandHandler(),
      new GenericCommandHandler(),
    ],
  },
});
