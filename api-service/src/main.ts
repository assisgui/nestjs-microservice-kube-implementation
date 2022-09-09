import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from "@nestjs/config";
import {BadRequestException, ValidationError, ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {HttpFilter} from "./config/http.filter";
import {Logger} from "nestjs-pino";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true
  });
  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);

  app.useGlobalFilters(new HttpFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        throw new BadRequestException(
          errors.map(value => Object.values(value.constraints)[0]).join(', '),
        );
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(+configService.get('PORT'));
}

bootstrap()
  .then(() => console.log('Application is running'))
  .catch((err) => console.error(err));
