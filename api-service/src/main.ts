import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from "@nestjs/config";
import {BadRequestException, Logger, ValidationError, ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {MyLogger} from "./config/myLogger";
import {HttpFilter} from "./config/http.filter";

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: new MyLogger(),
  });
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
    .setTitle('API Gateway')
    .setDescription('API Gateway')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(+configService.get('PORT'));
}

bootstrap()
  .then(() => logger.log('Application is running'))
  .catch((err) => logger.error(err));
