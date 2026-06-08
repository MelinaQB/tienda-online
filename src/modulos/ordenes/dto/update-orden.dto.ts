import { IsIn, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrdenDto {
  @ApiProperty({ description: 'Nuevo estado de la orden', example: 'COMPLETADO' })
  @IsString()
  @IsIn(['PENDIENTE', 'COMPLETADO', 'CANCELADO'])
  estado: string;
}
