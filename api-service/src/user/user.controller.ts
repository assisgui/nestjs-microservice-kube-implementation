import {Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards} from '@nestjs/common';
import { UserService } from "./user.service";
import {ApiBearerAuth, ApiBody, ApiParam, ApiTags} from "@nestjs/swagger";
import {AuthDTO, StoreUserDTO, UpdateUserDTO} from "./user-dto";
import {JwtGuard, Public} from "../config/jwt/jwt.guard";
import {MyLogger} from "../config/myLogger";
import {Permissions, ShiroPermsGuard} from "../config/shiro-perms.guard";

@ApiTags('User')
@Controller('user')
@UseGuards(JwtGuard, ShiroPermsGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private logger: MyLogger
  ) {
    this.logger.setContext(UserController.name)
  }

  @Public()
  @Post('/auth')
  @ApiBody({ type: AuthDTO, required: true })
  auth(@Body() auth: AuthDTO) {
    return this.userService.auth(auth.id)
  }

  @Get('')
  @Permissions('users:view')
  getUsers(@Request() req) {
    this.logger.log(`api requested by ${req.user.name}`)
    return this.userService.findAll();
  }

  @Get('/:id')
  @Permissions('users:view', 'users:view:id')
  @ApiParam({ name: 'id' })
  getUserById(@Request() req, @Param('id') id) {
    this.logger.log(`api requested by ${req.user.name}`)
    return this.userService.findOne(id)
  }

  @Post('')
  @Permissions('users:create')
  @ApiBody({ type: StoreUserDTO, required: true })
  createUser(@Request() req, @Body() user: StoreUserDTO) {
    this.logger.log(`api requested by ${req.user.name}`)
    return this.userService.create(user)
  }

  @Patch('/:id')
  @Permissions('users:edit', 'users:edit:id')
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateUserDTO, required: true })
  patchUser(@Request() req, @Param('id') id, @Body() user: UpdateUserDTO) {
    this.logger.log(`api requested by ${req.user.name}`)
    return this.userService.update(id, user)
  }

  @Delete('/:id')
  @Permissions('users:delete')
  @ApiParam({ name: 'id' })
  @Permissions('users:delete')
  deleteUsers(@Request() req,  @Param('id') id) {
    this.logger.log(`api requested by ${req.user.name}`)
    return this.userService.deleteOne(id);
  }
}
