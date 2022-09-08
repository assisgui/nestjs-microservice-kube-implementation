import {Controller} from '@nestjs/common';
import {Ctx, EventPattern, Payload, RmqContext} from "@nestjs/microservices";
import {MyLogger} from "../config/myLogger";
import {EventConsumerService} from "./event-consumer/event-consumer.service";
import {ConfigService} from "@nestjs/config";

@Controller('consumer')
export class ConsumerController {
  constructor(
    private logger: MyLogger,
    private customEventConsumer: EventConsumerService,
    private configService: ConfigService
  ) {
    this.logger.setContext(ConsumerController.name)
  }

  async onApplicationBootstrap() {
    await this.createEventBroadcasterConsumer()
  }

  @EventPattern('simpleEventGet')
  simpleEventGet2(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.debug('listen 2')
    this.logger.log(`Pattern: ${context.getPattern()}`, data);
  }

  async createEventBroadcasterConsumer() {
    await this.customEventConsumer.setupExchange({
      exchange: this.configService.get('RABBIT_MQ_EXCHANGE_SERVICE'),
      consumerCallback: async (message) => {
        this.logger.log('message from broadcast', message.content.toString());
      }
    })
  }
}
