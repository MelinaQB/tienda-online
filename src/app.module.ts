import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesModule } from './modulos/clientes/clientes.module';
import { CategoriasModule } from './modulos/categorias/categorias.module';
import { ProductosModule } from './modulos/productos/productos.module';
import { OrdenesModule } from './modulos/ordenes/ordenes.module';
import { OrdenProductoModule } from './modulos/orden-producto/orden-producto.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity.{ts,js}'],
      synchronize: true, // Requerido para que TypeORM cree las tablas en Render automáticamente
      ssl: process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : false, // Clave para bases de datos en la nube
    }),
    ClientesModule,
    CategoriasModule,
    ProductosModule,
    OrdenesModule,
    OrdenProductoModule,
  ],
})
export class AppModule {}