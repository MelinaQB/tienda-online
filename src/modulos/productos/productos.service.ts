import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,

    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const { idCategoria, ...datosProducto } = createProductoDto;
    
    // Validar que la categoría exista antes de proceder
    const categoria = await this.categoriaRepository.findOne({ where: { idCategoria } });
    if (!categoria) {
      throw new NotFoundException(`La categoría con ID ${idCategoria} no existe. No se puede crear el producto.`);
    }

    const nuevoProducto = this.productoRepository.create({
      ...datosProducto,
      categoria,
    });
    
    return await this.productoRepository.save(nuevoProducto);
  }
  async findAll(): Promise<Producto[]> {
    return await this.productoRepository.find({ 
      relations: {
        categoria: true,
      },
    });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { idProducto: id },
      relations: {
        categoria: true,
      },
    });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);
    const { idCategoria, ...datosProducto } = updateProductoDto;

    if (idCategoria) {
      const categoria = await this.categoriaRepository.findOne({ where: { idCategoria } });
      if (!categoria) {
        throw new NotFoundException(`La categoría con ID ${idCategoria} no existe.`);
      }
      producto.categoria = categoria;
    }

    this.productoRepository.merge(producto, datosProducto);
    return await this.productoRepository.save(producto);
  }

  async remove(id: number): Promise<{ message: string }> {
    const producto = await this.findOne(id);
    await this.productoRepository.softRemove(producto);
    return { message: `Producto con ID ${id} eliminado correctamente` };
  }
}