import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrdenProductoDto {
  @ApiProperty({ description: 'ID de la orden existente', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  idOrden: number;

  @ApiProperty({ description: 'ID del producto a añadir', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  idProducto: number;

  @ApiProperty({ description: 'Cantidad de unidades', example: 5 })
  @IsNumber()
  @Min(1, { message: 'La cantidad mínima debe ser 1' })
  @IsNotEmpty()
  cantidad: number;
}