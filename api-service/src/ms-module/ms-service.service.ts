import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { MyLogger } from "../config/myLogger";
import { EventConsumerService } from "./event-consumer/event-consumer.service";

@Injectable()
export class MsServiceService {
  constructor(
    @Inject('queue_service') private queueClient: ClientProxy,
    @Inject('event_service') private eventClient: ClientProxy,
    private configService: ConfigService,
    private customEventConsumer: EventConsumerService,
    private logger: MyLogger
  ) {
    this.logger.setContext(MsServiceService.name)
  }

  /** Hook to connect on microservice when app start */
  async onApplicationBootstrap() {
    await this.queueClient.connect();
    await this.eventClient.connect();
    this.logger.debug('microservice connected')
  }

  async simpleGet(): Promise<any> {
    this.queueClient.send<any>('simpleSendGet', {
      text: 'sending simpleSendGet'
    })
      .subscribe({
        next: (data) => this.logger.log(`Data returned: ${data}`),
        error: () => this.logger.error,
        complete: () => this.logger.debug
      })

    this.eventClient.emit<any>('simpleEventGet', {
      text: 'emitting simpleEventGet'
    })

    await this.customEventConsumer.broadcastMessage({
      exchange: this.configService.get('RABBIT_MQ_EXCHANGE_SERVICE'),
      message: {test: 'message same service'}
    })
  }
}
