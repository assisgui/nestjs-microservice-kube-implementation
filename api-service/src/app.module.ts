import {Logger, Module} from '@nestjs/common';
import { MsModuleModule } from './ms-module/ms-module.module';
import { UserModule } from './user/user.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user";
import {ConfigModule} from "./config/config.module";
import {Roles} from "./entities/roles";
import {Permissions} from "./entities/permissions";
import {LoggerModule} from "nestjs-pino";

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [User, Roles, Permissions],
      synchronize: true,
    }),
    MsModuleModule,
    UserModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
        serializers: {
          req(req: any) {
            return { id: req.id, method: req.method, url: req.url };
          },
          res(res: any) {
            return { statusCode: res.statusCode };
          },
        },
      },
    }),
  ],
  providers: [Logger]
})
export class AppModule {}
