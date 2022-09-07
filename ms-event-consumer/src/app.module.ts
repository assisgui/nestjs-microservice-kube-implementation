import { Module } from '@nestjs/common';
import { ConsumerController } from './consumer/consumer.controller';
import {ConfigModule} from "@nestjs/config";
import {MyLogger} from "./config/myLogger";

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ConsumerController],
  providers: [MyLogger],
})
export class AppModule {}
