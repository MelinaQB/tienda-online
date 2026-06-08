import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientesModule } from './modulos/clientes/clientes.module';
import { CategoriasModule } from './modulos/categorias/categorias.module';
import { ProductosModule } from './modulos/productos/productos.module';
import { OrdenesModule } from './modulos/ordenes/ordenes.module';
import { OrdenProductoModule } from './modulos/orden-producto/orden-producto.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234567',
      database: 'tienda_online',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ClientesModule,
    CategoriasModule,
    ProductosModule,
    OrdenesModule,
    OrdenProductoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
