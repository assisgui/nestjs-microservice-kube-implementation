import { Injectable } from '@nestjs/common';
import {ServerRMQ} from "@nestjs/microservices";
import {ConfigService} from "@nestjs/config";
import {CONNECT_EVENT} from "@nestjs/microservices/constants";
import { isNil } from "@nestjs/common/utils/shared.utils";

@Injectable()
export class EventConsumerService extends ServerRMQ {
  constructor(private configService: ConfigService) {
    super({
      urls: [
        {
          protocol: configService.get('RABBIT_MQ_PROTOCOL'),
          hostname: configService.get('RABBIT_MQ_HOSTNAME'),
          port: configService.get('RABBIT_MQ_PORT'),
          username: configService.get('RABBIT_MQ_USERNAME'),
          password: configService.get('RABBIT_MQ_PASSWORD')
        }
      ],
      queueOptions: {
        durable: false
      }
    });
  }

  async setupCallback({
    exchange,
    queue,
    consumerCallback
  }: {
    exchange: string
    queue?: string
    consumerCallback?: (message: Record<string, any>, channel) => any
  }) {
    let newQueue = queue
    await this.channel.assertExchange(exchange, 'fanout', { durable: false })
    if (isNil(newQueue)) {
      const { queue: queueCreated } = await this.channel.assertQueue('', { exclusive: true })
      newQueue = queueCreated
    }
    await this.channel.bindQueue(newQueue, exchange, '')

    await this.channel.consume(
      newQueue,
      (message: Record<string, any>) => consumerCallback(message, this.channel),
      { noAck: true }
    );
  }

  async setupExchange({
    exchange,
    queue,
    consumerCallback
  }: {
    exchange: string
    queue?: string
    consumerCallback?: (message: Record<string, any>, channel) => any
  }) {
    this.server = this.createClient();
    this.server.on(CONNECT_EVENT, async () => {
      try {
        this.channel = await this.server.createChannel({
          json: false,
          setup: async (channel: any) =>
            this.setupChannel(channel, () => this.setupCallback({
              exchange,
              queue,
              consumerCallback
            }))
        });
      } catch (e) {
        this.logger.error(e)
      }
    });
  }

  async broadcastMessageCallback({
    exchange,
    message
  }: {
    exchange: string
    message: any
  }) {
    await this.channel.assertExchange(exchange, 'fanout', { durable: false })
    this.channel.publish(exchange, '', Buffer.from(JSON.stringify(message)))
  }

  async broadcastMessage({
    exchange,
    message
  }: {
    exchange: string
    message: any
  }) {
    this.server = this.createClient();
    this.server.on(CONNECT_EVENT, async () => {
      try {
        this.channel = await this.server.createChannel({
          json: false,
          setup: async (channel: any) =>
            this.setupChannel(channel, () => this.broadcastMessageCallback({
              exchange,
              message,
            }))
        });
      } catch (e) {
        this.logger.error(e)
      }
    });
  }
}
