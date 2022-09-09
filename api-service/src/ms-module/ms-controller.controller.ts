import {Controller, Get, Logger, Request} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {MsServiceService} from "./ms-service.service";

@ApiTags('MS Controller')
@Controller('ms-controller')
export class MsControllerController {
  private readonly logger = new Logger(MsControllerController.name);
  constructor(private readonly msService: MsServiceService) {}

  @Get('trigger-ms-messages')
  simpleGet(@Request() req): any {
    this.logger.log(`api requested by ${req.user.name}`)
    return this.msService.simpleGet();
  }
}
