import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { Cliente } from './entities/cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente])], // Registra la entidad aquí
  controllers: [ClientesController],
  providers: [ClientesService],
  exports: [TypeOrmModule], // Lo exportamos por si el módulo de Órdenes lo necesita más adelante
})
export class ClientesModule {}
