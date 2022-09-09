import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./user";
import { Permissions } from "./permissions";

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => Permissions)
  @JoinColumn()
  permission: Permissions | number
}
