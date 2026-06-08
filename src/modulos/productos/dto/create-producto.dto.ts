import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty({ description: 'Nombre del producto' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  nombre: string;

  @ApiProperty({ description: 'Descripción del producto', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ description: 'Precio del producto' })
  @IsNumber()
  @Min(0, { message: 'El precio no puede ser negativo' })
  precio: number;

  @ApiProperty({ description: 'Stock disponible en tienda' })
  @IsNumber()
  @Min(0, { message: 'El stock no puede ser menor a cero' })
  stock: number;

  @ApiProperty({ description: 'ID de la categoría asignada' })
  @IsNumber()
  @IsNotEmpty({ message: 'Debe especificar el ID de una categoría' })
  idCategoria: number;
}