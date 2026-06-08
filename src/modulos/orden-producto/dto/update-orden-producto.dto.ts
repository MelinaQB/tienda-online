import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrdenProductoDto {
  @ApiProperty({ description: 'Nueva cantidad de unidades', example: 3, required: false })
  @IsNumber()
  @Min(1, { message: 'La cantidad mínima debe ser 1' })
  @IsOptional()
  cantidad?: number;

  @ApiProperty({ description: 'Nuevo precio unitario histórico', example: 15.50, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  precioUnitario?: number;
}