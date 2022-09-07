import { Controller } from '@nestjs/common';
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {MyLogger} from "../config/myLogger";

@Controller('receiver')
export class ReceiverController {
  constructor(private logger: MyLogger) {
    this.logger.setContext(ReceiverController.name)
  }

  @MessagePattern('simpleSendGet')
  simpleSendGet(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log(`Pattern: ${context.getPattern()}`, data);

    return `Pattern: ${context.getPattern()} - ${data.text}`
  }
}
