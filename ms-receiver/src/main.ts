import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from "@nestjs/config";
import {MyLogger} from "./config/myLogger";

async function bootstrap() {
  const appContext = await NestFactory.create(AppModule);
  const configService = appContext.get(ConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
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
      },
    },
    logger: new MyLogger()
  });

  await app.listen();
}

bootstrap()
  .then(() => console.log(`Bootstrap is done`))
  .catch(console.error);
