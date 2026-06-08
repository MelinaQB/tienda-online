import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('categoria')
export class Categoria {
  @PrimaryGeneratedColumn({ name: 'idcategoria' })
  idCategoria: number;

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @CreateDateColumn({ name: 'creadoen' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizadoen' })
  actualizadoEn: Date;

  @DeleteDateColumn({ name: 'eliminadoen' })
  eliminadoEn: Date;

  // Una categoría puede tener muchos productos
  @OneToMany(() => Producto, (producto) => producto.categoria)
  productos: Producto[];
}