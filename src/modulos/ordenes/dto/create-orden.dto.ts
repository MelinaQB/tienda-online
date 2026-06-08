import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class DetalleOrdenDto {
  @ApiProperty({ description: 'ID del producto' })
  @IsNumber()
  @IsNotEmpty()
  idProducto: number;

  @ApiProperty({ description: 'Cantidad a comprar' })
  @IsNumber()
  @IsNotEmpty()
  cantidad: number;
}

export class CreateOrdenDto {
  @ApiProperty({ description: 'ID del cliente que hace la compra' })
  @IsNumber()
  @IsNotEmpty()
  idCliente: number;

  @ApiProperty({ description: 'Listado de productos incluidos en la orden', type: [DetalleOrdenDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleOrdenDto)
  productos: DetalleOrdenDto[];
}
