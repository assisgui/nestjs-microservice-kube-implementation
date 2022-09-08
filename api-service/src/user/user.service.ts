import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { User } from "../entities/user";
import {StoreUserDTO, UpdateUserDTO} from "./user-dto";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  // To test purpose, adding users
  async onApplicationBootstrap() {
    let seedAmount = new Array(10).fill(0).map((_, i) => i)
    for await (const i of seedAmount) {
      await this.usersRepository.save({
        id: i +1,
        name: `test ${i}`,
        permissions: ''
      })
    }
  }

  async auth(id: number) {
    const user = await this.findOne(id)
    return { token: this.jwtService.sign({ ...user }) };
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  create(user: StoreUserDTO): Promise<User> {
    return this.usersRepository.save(user)
  }

  async update(id: number, user: UpdateUserDTO): Promise<User> {
    await this.usersRepository.update(id, user)
    return this.findOne(id)
  }
}
