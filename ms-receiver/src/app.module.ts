import { Module } from '@nestjs/common';
import { ReceiverController } from './receiver/receiver.controller';
import {ConfigModule} from "@nestjs/config";
import {MyLogger} from "./config/myLogger";

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ReceiverController],
  providers: [MyLogger],
})
export class AppModule {}
