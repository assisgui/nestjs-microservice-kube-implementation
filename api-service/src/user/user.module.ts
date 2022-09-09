import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../entities/user";
import { MyLogger } from 'src/config/myLogger';
import {Roles} from "../entities/roles";
import {Permissions} from "../entities/permissions";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Roles, Permissions])
  ],
  controllers: [UserController],
  providers: [
    UserService,
    MyLogger
  ]
})
export class UserModule {}
