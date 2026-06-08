import { Controller, Get, Post, Patch, Param, Delete, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrdenProductoService } from './orden-producto.service';
import { CreateOrdenProductoDto } from './dto/create-orden-producto.dto';
import { UpdateOrdenProductoDto } from './dto/update-orden-producto.dto';

@ApiTags('Orden-Producto')
@Controller('orden-producto')
export class OrdenProductoController {
  constructor(private readonly ordenProductoService: OrdenProductoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las orden_producto' })
  findAll() {
    return this.ordenProductoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una orden_producto por id con todos sus productos' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordenProductoService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una orden_producto (incluye idOrden)' })
  @ApiResponse({ status: 201, description: 'Producto añadido a la orden correctamente.' })
  create(@Body() createOrdenProductoDto: CreateOrdenProductoDto) {
    return this.ordenProductoService.create(createOrdenProductoDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar el estado de la orden_producto (cantidad o precio)' })
  @ApiResponse({ status: 200, description: 'Registro actualizado y montos recalculados.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrdenProductoDto: UpdateOrdenProductoDto
  ) {
    return this.ordenProductoService.update(id, updateOrdenProductoDto);
  }

  @Delete(':idOrden/productos/:idProducto')
  @ApiOperation({ summary: 'Quitar un producto de la orden' })
  removeProductFromOrder(
    @Param('idOrden', ParseIntPipe) idOrden: number,
    @Param('idProducto', ParseIntPipe) idProducto: number,
  ) {
    return this.ordenProductoService.removeProductFromOrder(idOrden, idProducto);
  }
}