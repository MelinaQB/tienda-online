import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenProducto } from './entities/orden-producto.entity';
import { Orden } from '../ordenes/entities/orden.entity';
import { Producto } from '../productos/entities/producto.entity';
import { CreateOrdenProductoDto } from './dto/create-orden-producto.dto';
import { UpdateOrdenProductoDto } from './dto/update-orden-producto.dto';

@Injectable()
export class OrdenProductoService {
  constructor(
    @InjectRepository(OrdenProducto)
    private readonly ordenProductoRepository: Repository<OrdenProducto>,

    @InjectRepository(Orden)
    private readonly ordenRepository: Repository<Orden>,

    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  // 1. GET /orden_producto -> Listar todas
  async findAll(): Promise<OrdenProducto[]> {
    return await this.ordenProductoRepository.find({
      relations: { orden: true, producto: true },
    });
  }

  // 2. GET /orden_producto/:id -> Obtener una por ID
  async findOne(id: number): Promise<OrdenProducto> {
    const registro = await this.ordenProductoRepository.findOne({
      where: { idOrdenProducto: id },
      relations: { orden: true, producto: true },
    });
    if (!registro) {
      throw new NotFoundException(`Registro orden_producto con ID ${id} no encontrado`);
    }
    return registro;
  }

  // 3. POST /orden_producto -> Crear/Agregar un ítem a una orden existente
  async create(createOrdenProductoDto: CreateOrdenProductoDto): Promise<OrdenProducto> {
    const { idOrden, idProducto, cantidad } = createOrdenProductoDto;

    const orden = await this.ordenRepository.findOne({ where: { idOrden } });
    if (!orden) throw new NotFoundException(`La orden con ID ${idOrden} no existe.`);

    // 🔒 CANDADO: Si la orden ya no está PENDIENTE, se bloquean las adiciones
    if (orden.estado !== 'PENDIENTE') {
      throw new BadRequestException(`No se pueden añadir productos a una orden con estado: ${orden.estado}`);
    }

    const producto = await this.productoRepository.findOne({ where: { idProducto } });
    if (!producto) throw new NotFoundException(`El producto con ID ${idProducto} no existe.`);

    if (producto.stock < cantidad) {
      throw new BadRequestException(`Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}`);
    }

    const precioUnitario = Number(producto.precio);
    const subtotal = precioUnitario * cantidad;

    producto.stock -= cantidad;
    orden.total = Number(orden.total) + subtotal;

    const nuevoDetalle = this.ordenProductoRepository.create({
      cantidad,
      precioUnitario,
      orden,
      producto,
    });

    await this.ordenProductoRepository.manager.transaction(async (em) => {
      await em.save(producto);
      await em.save(orden);
      await em.save(nuevoDetalle);
    });

    return nuevoDetalle;
  }

  // 4. PATCH /orden_producto/:id -> Actualizar cantidad o precio
  async update(id: number, updateOrdenProductoDto: UpdateOrdenProductoDto): Promise<OrdenProducto> {
    const registro = await this.findOne(id);
    const orden = registro.orden;
    const producto = registro.producto;

    // 🔒 CANDADO: Si la orden ya está cerrada o cancelada, se bloquea la edición
    if (orden.estado !== 'PENDIENTE') {
      throw new BadRequestException(`No se pueden modificar los productos de una orden con estado: ${orden.estado}`);
    }

    const viejoSubtotal = Number(registro.precioUnitario) * registro.cantidad;
    let nuevoSubtotal = viejoSubtotal;

    if (updateOrdenProductoDto.cantidad !== undefined) {
      const diferenciaCantidad = updateOrdenProductoDto.cantidad - registro.cantidad;

      if (diferenciaCantidad > 0 && producto.stock < diferenciaCantidad) {
        throw new BadRequestException(`Stock insuficiente para aumentar la cantidad. Disponible: ${producto.stock}`);
      }

      producto.stock -= diferenciaCantidad;
      registro.cantidad = updateOrdenProductoDto.cantidad;
    }

    if (updateOrdenProductoDto.precioUnitario !== undefined) {
      registro.precioUnitario = updateOrdenProductoDto.precioUnitario;
    }

    nuevoSubtotal = Number(registro.precioUnitario) * registro.cantidad;
    orden.total = Number(orden.total) - viejoSubtotal + nuevoSubtotal;

    await this.ordenProductoRepository.manager.transaction(async (em) => {
      await em.save(producto);
      await em.save(orden);
      await em.save(registro);
    });

    return registro;
  }

  // 5. DELETE /orden_producto/:idOrden/productos/:productId -> Quitar un producto de la orden
  async removeProductFromOrder(orderId: number, productId: number): Promise<{ message: string }> {
    const registro = await this.ordenProductoRepository.findOne({
      where: {
        orden: { idOrden: orderId },
        producto: { idProducto: productId },
      },
      relations: { orden: true, producto: true },
    });

    if (!registro) {
      throw new NotFoundException(`No se encontró el producto ${productId} dentro de la orden ${orderId}`);
    }

    const ordenAsociada = registro.orden;
    const productoAsociado = registro.producto;
    
    // 🔒 CANDADO: Si la orden ya se completó o canceló, no puedes alterar sus ítems históricos
    if (ordenAsociada.estado !== 'PENDIENTE') {
      throw new BadRequestException(`No se pueden eliminar productos de una orden con estado: ${ordenAsociada.estado}`);
    }

    const descuento = Number(registro.precioUnitario) * registro.cantidad;
    ordenAsociada.total = Number(ordenAsociada.total) - descuento;
    productoAsociado.stock = Number(productoAsociado.stock) + registro.cantidad;

    await this.ordenProductoRepository.manager.transaction(async (em) => {
      await em.save(ordenAsociada);
      await em.save(productoAsociado);
      await em.remove(registro);
    });
    
    return { 
      message: `Producto ${productId} removido de la orden ${orderId} exitosamente.`
    };
  }
}