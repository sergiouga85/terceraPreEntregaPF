import { Schema, model } from 'mongoose'
import { randomUUID } from 'crypto'
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new Schema ({
    _id: { type: String, default: randomUUID},
    title: { type: String, require: true },
    description: { type: String, require: true },
    code: { type: String, require: true },
    price: { type: Number, require: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, require: true },
    category: { type: String, require: true },
    thumbnail: { type: String, default: '' }
}, {
    strict: 'throw',
    versionKey: false,
})

productSchema.plugin(mongoosePaginate)

export const Producto = model('products', productSchema )


//------------------------------------------------------------------------------------------


export class ProductDao {

    async getProducts(){
        try {
            const products= await Producto.find();
            return products   
        } catch (error) {
            throw new Error(`Error al obtener los productos  ${error.message}`);
        }
    }

    // Obtener todos los productos paginados
    async paginado(filtro, opciones){
        try {
            const paginado= await Producto.paginate(filtro, opciones);
            return paginado   
        } catch (error) {
            throw new Error(`Error al obtener los productos paginados: ${error.message}`);
        }
    };

    // Obtener todas las categorías de productos
    async obtenerCategorias(){
        try {
            const categoriasProductos = await Producto.aggregate([
                { $group: { _id: "$category" } }
            ]);

            return categoriasProductos;
        } catch (error) {
            throw new Error(`Error al obtener las categorías de productos: ${error.message}`);
        }
    };

    // Obtener un producto por ID
    async obtenerProductoPorId(productoId)  {
        try {
            const productoPorId = await Producto.findById(productoId);

            if (!productoPorId) {
                throw new Error('El producto buscado no existe en la base de datos');
            }

            return productoPorId;
        } catch (error) {
            throw new Error(`Error al obtener el producto por ID: ${error.message}`);
        }
    };

    // Crear un nuevo producto
    async crearProducto(nuevoProductoData){
        try {
            const nuevoProducto = await Producto.create(nuevoProductoData);
            return nuevoProducto;
        } catch (error) {
            throw new Error(`Error al crear un nuevo producto: ${error.message}`);
        }
    };

    // Actualizar un producto por ID
    async actualizarProducto(productoId, newData){
        try {
            if (newData.code) {
                throw new Error('No se puede modificar el código del producto');
            }

            const updProducto = await Producto.findByIdAndUpdate(
                productoId,
                { $set: newData },
                { new: true }
            );

            if (!updProducto) {
                throw new Error(`El producto con id ${productoId} no se encontró`);
            }

            return updProducto;
        } catch (error) {
            throw new Error(`Error al actualizar el producto por ID: ${error.message}`);
        }
    };

    // Eliminar un producto por ID
    async  eliminarProducto(productoId){
        try {
            const delProducto = await Producto.findByIdAndDelete(productoId);

            if (!delProducto) {
                throw new Error(`El producto con id ${productoId} no se encontró`);
            }

            return delProducto;
        } catch (error) {
            throw new Error(`Error al eliminar el producto por ID: ${error.message}`);
        }
    };

}