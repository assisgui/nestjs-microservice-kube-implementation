import {Controller, Get, UseGuards, Request} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {MsServiceService} from "./ms-service.service";
import {JwtGuard} from "../config/jwt/jwt.guard";
import {MyLogger} from "../config/myLogger";

@ApiTags('MS Controller')
@Controller('ms-controller')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class MsControllerController {
  constructor(
    private readonly msService: MsServiceService,
    private logger: MyLogger
  ) {
    this.logger.setContext(MsControllerController.name)
  }

  @Get('trigger-ms-messages')
  simpleGet(@Request() req): any {
    this.logger.log(`api requested by ${req.user.name}`)
    return this.msService.simpleGet();
  }
}
