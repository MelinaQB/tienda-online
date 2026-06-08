import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orden } from './entities/orden.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Producto } from '../productos/entities/producto.entity';
import { OrdenProducto } from '../orden-producto/entities/orden-producto.entity';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { UpdateOrdenDto } from './dto/update-orden.dto';

@Injectable()
export class OrdenesService {
  constructor(
    @InjectRepository(Orden)
    private readonly ordenRepository: Repository<Orden>,

    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,

    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,

    @InjectRepository(OrdenProducto)
    private readonly ordenProductoRepository: Repository<OrdenProducto>,
  ) {}

  async create(createOrdenDto: CreateOrdenDto): Promise<Orden> {
    const { idCliente, productos } = createOrdenDto;

    // 1. Validar que el cliente exista
    const cliente = await this.clienteRepository.findOne({ where: { idCliente } });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${idCliente} no encontrado. No se puede crear la orden.`);
    }

    // 2. Crear la instancia inicial de la orden
    const nuevaOrden = this.ordenRepository.create({
      cliente,
      total: 0,
      detalles: [],
    });

    let acumularTotal = 0;
    const detallesAGuardar: OrdenProducto[] = [];

    // 3. Procesar cada producto de la orden
    for (const item of productos) {
      const producto = await this.productoRepository.findOne({ where: { idProducto: item.idProducto } });
      if (!producto) {
        throw new NotFoundException(`Producto con ID ${item.idProducto} no encontrado.`);
      }

      // Validar si hay stock suficiente antes de la venta
      if (producto.stock < item.cantidad) {
        throw new BadRequestException(`Stock insuficiente para el producto "${producto.nombre}". Disponible: ${producto.stock}, Solicitado: ${item.cantidad}`);
      }

      // Restar el stock del producto
      producto.stock -= item.cantidad;
      await this.productoRepository.save(producto);

      // Calcular subtotal de este ítem
      const precioUnitario = Number(producto.precio);
      acumularTotal += precioUnitario * item.cantidad;

      // Crear el registro de la tabla intermedia (Incluye)
      const detalle = this.ordenProductoRepository.create({
        cantidad: item.cantidad,
        precioUnitario: precioUnitario,
        producto: producto,
      });

      detallesAGuardar.push(detalle);
    }

    nuevaOrden.total = acumularTotal;
    nuevaOrden.detalles = detallesAGuardar;

    // 4. Guardar la orden (TypeORM insertará la orden y sus detalles por el "cascade: true")
    return await this.ordenRepository.save(nuevaOrden);
  }

  async findAll(): Promise<Orden[]> {
    return await this.ordenRepository.find({
      relations: {
        cliente: true,
        detalles: {
          producto: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<Orden> {
    const orden = await this.ordenRepository.findOne({
      where: { idOrden: id },
      relations: {
        cliente: true,
        detalles: {
          producto: true,
        },
      },
    });
    if (!orden) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }
    return orden;
  }

  async update(id: number, updateOrdenDto: UpdateOrdenDto): Promise<Orden> {
    const orden = await this.findOne(id);
    orden.estado = updateOrdenDto.estado;
    return await this.ordenRepository.save(orden);
  }

  async remove(id: number): Promise<{ message: string }> {
    const orden = await this.findOne(id);
    await this.ordenRepository.softRemove(orden);
    return { message: `Orden con ID ${id} eliminada correctamente (Soft Delete)` };
  }
}
