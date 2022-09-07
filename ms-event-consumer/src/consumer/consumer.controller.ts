import { Controller } from '@nestjs/common';
import {Ctx, EventPattern, Payload, RmqContext} from "@nestjs/microservices";
import {MyLogger} from "../config/myLogger";

@Controller('consumer')
export class ConsumerController {
  constructor(private logger: MyLogger) {
    this.logger.setContext(ConsumerController.name)
  }

  @EventPattern('simpleEventGet')
  simpleEventGet(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log(`Pattern: ${context.getPattern()}`, data);
  }
}
