import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { OrdenProducto } from '../../orden-producto/entities/orden-producto.entity';

@Entity('orden')
export class Orden {
  @PrimaryGeneratedColumn({ name: 'idorden' })
  idOrden: number;

  @Column({ default: 'PENDIENTE' })
  estado: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @CreateDateColumn({ name: 'creadoen' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizadoen' })
  actualizadoEn: Date;

  @DeleteDateColumn({ name: 'eliminadoen' })
  eliminadoEn: Date;

  @ManyToOne(() => Cliente, (cliente) => cliente.ordenes, { nullable: false })
  @JoinColumn({ name: 'idcliente' })
  cliente: Cliente;

  @OneToMany(() => OrdenProducto, (ordenProducto) => ordenProducto.orden, { cascade: true })
  detalles: OrdenProducto[];
}
