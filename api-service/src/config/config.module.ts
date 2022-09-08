import {Global, Module} from '@nestjs/common';
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "./jwt/jwt-strategy";

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET_JWT,
    })
  ],
  providers: [
    JwtStrategy
  ],
  exports: [
    PassportModule,
    JwtStrategy,
    JwtModule.register({
      secret: process.env.SECRET_JWT,
    })
  ]
})
export class ConfigModule {}
