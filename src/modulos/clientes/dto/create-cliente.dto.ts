import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClienteDto {
  @ApiProperty({ description: 'Nombres del cliente' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  nombres: string;

  @ApiProperty({ description: 'Apellido paterno' })
  @IsString()
  @IsNotEmpty({ message: 'El apellido paterno no puede estar vacío' })
  paterno: string;

  @ApiProperty({ description: 'Apellido materno' })
  @IsString()
  @IsNotEmpty({ message: 'El apellido materno no puede estar vacío' })
  materno: string;

  @ApiProperty({ description: 'Correo electrónico único del cliente' })
  @IsEmail({}, { message: 'El formato del correo no es válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;
}