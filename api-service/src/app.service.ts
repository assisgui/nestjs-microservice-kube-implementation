import {Inject, Injectable} from '@nestjs/common';
import { ClientProxy } from "@nestjs/microservices";
import {MyLogger} from "./config/myLogger";

@Injectable()
export class AppService {
  constructor(
    @Inject('queue_service') private queueClient: ClientProxy,
    @Inject('event_service') private eventClient: ClientProxy,
    private logger: MyLogger
  ) {
    this.logger.setContext(AppService.name)
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
      text: 'emitting simpleGet'
    })
  }
}
