import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Orden } from '../../ordenes/entities/orden.entity'; 

@Entity('cliente')
export class Cliente {
  @PrimaryGeneratedColumn({ name: 'idcliente' })
  idCliente: number;

  @Column()
  nombres: string;

  @Column()
  paterno: string;

  @Column()
  materno: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn({ name: 'creadoen' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizadoen' })
  actualizadoEn: Date;

  @DeleteDateColumn({ name: 'eliminadoen' })
  eliminadoEn: Date;

  @OneToMany(() => Orden, (orden) => orden.cliente)
  ordenes: Orden[];
}
