import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Orden } from '../../ordenes/entities/orden.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('orden_producto')
export class OrdenProducto {
  @PrimaryGeneratedColumn({ name: 'idorden_producto' })
  idOrdenProducto: number;

  @Column({ type: 'integer' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioUnitario: number;

  @CreateDateColumn({ name: 'creadoen' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizadoen' })
  actualizadoEn: Date;

  @DeleteDateColumn({ name: 'eliminadoen' })
  eliminadoEn: Date;

  @ManyToOne(() => Orden, (orden) => orden.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idorden' })
  orden: Orden;

  @ManyToOne(() => Producto, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idproducto' })
  producto: Producto;
}
