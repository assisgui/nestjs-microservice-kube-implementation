import { Module } from '@nestjs/common';
import { MsModuleModule } from './ms-module/ms-module.module';
import { UserModule } from './user/user.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user";
import {ConfigModule} from "./config/config.module";

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [User],
      synchronize: true,
    }),
    MsModuleModule,
    UserModule,
  ]
})
export class AppModule {}
