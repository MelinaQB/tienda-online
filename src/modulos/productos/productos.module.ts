import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity';
import { CategoriasModule } from '../categorias/categorias.module'; // Importante para validar idCategoria

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto]),
    CategoriasModule, // Permite usar el repositorio de categorías aquí
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
