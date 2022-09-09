import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import {DeleteResult, Repository} from "typeorm";
import { User } from "../entities/user";
import {StoreUserDTO, UpdateUserDTO} from "./user-dto";
import {JwtService} from "@nestjs/jwt";
import * as permissions from "../entities/permissions.json"
import * as roles from "../entities/roles.json"
import * as users from "../entities/user.json"
import { Roles } from 'src/entities/roles';
import {Permissions} from "../entities/permissions";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Permissions) private permissionsRepository: Repository<Permissions>,
    @InjectRepository(Roles) private rolesRepository: Repository<Roles>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  // To test purpose, adding users
  async onApplicationBootstrap() {
    for (const permission of permissions) {
      await this.permissionsRepository.save({
        id: permission.id,
        permission: permission.permission
      })
    }
    for (const role of roles) {
      await this.rolesRepository.save({
        id: role.id,
        name: role.name,
        permission: role.permission as unknown as Permissions
      })
    }
    for (const user of users) {
      await this.usersRepository.save({
        id: user.id,
        name: user.name,
        role: user.role as unknown as Roles
      })
    }
  }

  async auth(id: number) {
    const { role, ...user } = await this.findOne(id)
    const permission = ((role as Roles).permission as Permissions).permission
    return {
      token: this.jwtService.sign({
        ...user,
        permission
      })
    };
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['role', 'role.permission']
    });
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['role', 'role.permission']
    });
  }

  create(user: StoreUserDTO): Promise<User> {
    return this.usersRepository.save(user)
  }

  async update(id: number, user: UpdateUserDTO): Promise<User> {
    await this.usersRepository.update(id, user)
    return this.findOne(id)
  }

  deleteOne(id: number): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }
}
