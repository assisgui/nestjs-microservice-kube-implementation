import { Module } from '@nestjs/common';
import { ConsumerController } from './consumer/consumer.controller';
import { ConfigModule } from "@nestjs/config";
import { MyLogger } from "./config/myLogger";
import { EventConsumerService } from "./consumer/event-consumer/event-consumer.service";

@Module({
  imports: [
    ConfigModule.forRoot()
  ],
  controllers: [
    ConsumerController
  ],
  providers: [
    MyLogger,
    EventConsumerService
  ],
})
export class AppModule {}
