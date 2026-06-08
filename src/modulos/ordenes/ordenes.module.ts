import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenesService } from './ordenes.service';
import { OrdenesController } from './ordenes.controller';
import { Orden } from './entities/orden.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Producto } from '../productos/entities/producto.entity';
import { OrdenProducto } from '../orden-producto/entities/orden-producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orden, Cliente, Producto, OrdenProducto])],
  controllers: [OrdenesController],
  providers: [OrdenesService],
  exports: [TypeOrmModule],
})
export class OrdenesModule {}
