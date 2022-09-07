import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from "@nestjs/config";
import {Logger} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {MyLogger} from "./config/myLogger";

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: new MyLogger(),
  });
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('API Gateway')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('PORT'));
}

bootstrap()
  .then(() => logger.log('Application is running'))
  .catch((err) => logger.error(err));
