import { Schema, model } from 'mongoose';
import { randomUUID } from 'crypto';
import { productDao } from './index.js';

const schemaCarrito = new Schema({
  _id: { type: String, default: randomUUID },
  status: { type: Boolean, default: true },
  carrito: [
    {
      productID: { type: String, ref: 'products' },
      cant: { type: Number },
    },
  ],
  user: { type: String, required: true }, // Agregamos un campo para almacenar el ID del usuario asociado al carrito
  totalAmount: { type: Number, default: 0 },
}, {
  strict: 'throw',
  versionKey: false,
  methods: {},
});

schemaCarrito.pre('find', function (next) {
  this.populate('carrito.$.productID');
  next();
});

export const Carrito = model('carrito', schemaCarrito);

//---------------------------------------------------


export class CartDao {


  // Obtener todos los carritos
  async obtenerCarritos() {
    try {
      const carritos = await Carrito.find().populate('carrito.productID');
      return carritos;
    } catch (error) {
      throw new Error(`Error al obtener los carritos: ${error.message}`);
    }
  };

  // Obtener un carrito por ID
  async obtenerCarritoPorId(carritoId) {
    try {
      const carritoPorId = await Carrito.findById(carritoId).populate('carrito.productID');
      if (!carritoPorId) {
        throw new Error('El carrito buscado no existe en la base de datos');
      }
      return carritoPorId;
    } catch (error) {
      throw new Error(`Error al obtener el carrito por ID: ${error.message}`);
    }
  };

  // Crear un nuevo carrito
  async crearCarrito(nuevoCarritoData) {
    try {
      const newCarrito = await Carrito.create({ user: nuevoCarritoData.user });
      return newCarrito;
    } catch (error) {
      throw new Error(`Error al crear un nuevo carrito: ${error.message}`);
    }
  };

  // Actualizar la cantidad de un producto en el carrito
  async actualizarCantidadProductoEnCarrito(carritoId, productoId, nuevaCantidad) {
    try {
      const producto = await Carrito.findByIdAndUpdate(
        carritoId,
        { $set: { "carrito.$[elem].cant": nuevaCantidad } },
        { arrayFilters: [{ "elem._id": productoId }] },
        { new: true }
      );
      return producto;
    } catch (error) {
      throw new Error(`Error al actualizar la cantidad del producto en el carrito: ${error.message}`);
    }
  };

  // Añadir un producto al carrito o incrementar la cantidad si ya existe
  async agregarProductoAlCarrito(carritoId, productoId) {
    try {
      // Obtener el producto que se va a agregar al carrito
      const producto = await productDao.obtenerProductoPorId(productoId);

      if (!producto) {
        throw new Error('Producto no encontrado');
      }

      // Verificar si el producto ya existe en el carrito
      const productExist = await Carrito.findOne({
        _id: carritoId,
        'carrito.productID': productoId
      });

      if (productExist) {
        // Producto ya existe en el carrito, incrementar cantidad y actualizar totalAmount
        const updProduct = await Carrito.findOneAndUpdate(
          {
            _id: carritoId,
            'carrito.productID': productoId
          },
          {
            $inc: { 'carrito.$.cant': 1 },
            $inc: { totalAmount: producto.price } // Incrementar el totalAmount basado en el precio del producto
          },
          { new: true }
        );
        return updProduct;
      } else {
        // Añadir nuevo producto al carrito y actualizar totalAmount
        const addProduct = await Carrito.findByIdAndUpdate(
          carritoId,
          {
            $push: { carrito: { productID: productoId, cant: 1 } },
            $inc: { totalAmount: producto.price } // Incrementar el totalAmount basado en el precio del producto
          },
          { new: true }
        );
        return addProduct;
      }
    } catch (error) {
      throw new Error(`Error al agregar el producto al carrito: ${error.message}`);
    }
  }

  // Eliminar un carrito por ID
  async eliminarCarrito(carritoId) {
    try {
      const delCarrito = await Carrito.findByIdAndDelete(carritoId, { new: true });
      if (!delCarrito) {
        throw new Error(`El carrito con ID ${carritoId} no existe`);
      }
      return delCarrito;
    } catch (error) {
      throw new Error(`Error al eliminar el carrito por ID: ${error.message}`);
    }
  };

  // Eliminar un producto del carrito por ID
  async eliminarProductoDelCarrito(carritoId, productoId) {
    try {
      const delProdInCarrito = await Carrito.findByIdAndUpdate(
        carritoId,
        { $pull: { carrito: { _id: productoId } } },
        { new: true }
      );
      if (!delProdInCarrito) {
        throw new Error(`El producto con ID ${productoId} no existe en el carrito ${carritoId}`);
      }
      return delProdInCarrito;
    } catch (error) {
      throw new Error(`Error al eliminar el producto del carrito por ID: ${error.message}`);
    }
  };

  async saveCart(cart) {
    try {
      await cart.save();
    } catch (error) {
      throw new Error('Error saving cart');
    }
  }

}

