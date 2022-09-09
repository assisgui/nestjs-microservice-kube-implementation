import { ApiProperty, PartialType } from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";
import { User } from "../entities/user";

export class StoreUserDTO implements Omit<User, 'id'> {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNumber()
  role: number
}

export class UpdateUserDTO extends PartialType(StoreUserDTO) {}

export class AuthDTO {
  @ApiProperty()
  @IsNumber()
  id: number
}
