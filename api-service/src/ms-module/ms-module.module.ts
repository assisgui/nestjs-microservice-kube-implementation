import { Module } from '@nestjs/common';
import { MsControllerController } from './ms-controller.controller';
import { MsServiceService } from './ms-service.service';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {EventConsumerService} from "./event-consumer/event-consumer.service";
import { MyLogger } from '../config/myLogger';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule.forRoot()],
        name: 'queue_service',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            queue: configService.get('RABBIT_MQ_QUEUE_SERVICE'),
            urls: [{
              protocol: configService.get('RABBIT_MQ_PROTOCOL'),
              hostname: configService.get('RABBIT_MQ_HOSTNAME'),
              port: +configService.get('RABBIT_MQ_PORT'),
              username: configService.get('RABBIT_MQ_USERNAME'),
              password: configService.get('RABBIT_MQ_PASSWORD')
            }],
            queueOptions: {
              durable: false
            }
          }
        }),
        inject: [ConfigService]
      },
      {
        imports: [ConfigModule.forRoot()],
        name: 'event_service',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            queue: configService.get('RABBIT_MQ_EVENT_SERVICE'),
            urls: [{
              protocol: configService.get('RABBIT_MQ_PROTOCOL'),
              hostname: configService.get('RABBIT_MQ_HOSTNAME'),
              port: +configService.get('RABBIT_MQ_PORT'),
              username: configService.get('RABBIT_MQ_USERNAME'),
              password: configService.get('RABBIT_MQ_PASSWORD')
            }],
            queueOptions: {
              durable: false
            }
          }
        }),
        inject: [ConfigService]
      }
    ]),
  ],
  controllers: [MsControllerController],
  providers: [
    MsServiceService,
    EventConsumerService,
    ConfigService,
    MyLogger
  ]
})
export class MsModuleModule {}
