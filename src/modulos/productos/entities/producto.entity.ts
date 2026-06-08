import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';

@Entity('producto')
export class Producto {
  @PrimaryGeneratedColumn({ name: 'idproducto' })
  idProducto: number;

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'integer' })
  stock: number;

  @CreateDateColumn({ name: 'creadoen' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizadoen' })
  actualizadoEn: Date;

  @DeleteDateColumn({ name: 'eliminadoen' })
  eliminadoEn: Date;

  // Muchas productos pertenecen a una sola categoría
  @ManyToOne(() => Categoria, (categoria) => categoria.productos, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idcategoria' })
  categoria: Categoria;
}
