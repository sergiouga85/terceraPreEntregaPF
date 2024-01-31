import { cartDao } from '../dao/index.js';
import {CartService} from '../services/cart.service.js';
import { TicketService } from '../services/ticket.service.js';
import { productDao } from '../dao/index.js';
import { v4 as uuidv4 } from 'uuid';


// Obtener todos los carritos


export const obtenerCarritos = async (req, res) => {
    try {
        const carritos = await cartDao.obtenerCarritos();
        res.json(carritos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un carrito por ID
export const obtenerCarritoPorId = async (req, res) => {
    try {
        const carritoPorId = await cartDao.obtenerCarritoPorId(req.params.cid);
        res.json(carritoPorId);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo carrito
export const crearCarrito = async (req, res) => {
    try {
        const newCarrito = await cartDao.crearCarrito(req.body);
        res.status(201).json(newCarrito);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

// Actualizar la cantidad de un producto en el carrito
export const actualizarCantidadProductoEnCarrito = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { nuevaCantidad } = req.body;

        // Validar que la nueva cantidad sea un número válido y no sea negativa
        const cantidadNumerica = parseInt(nuevaCantidad);
        if (isNaN(cantidadNumerica) || cantidadNumerica < 0) {
            return res.status(400).json({ message: 'La nueva cantidad debe ser un número válido y no puede ser negativa.' });
        }

        // Llamar al servicio para actualizar la cantidad
        const productoActualizado = await CartService.actualizarCantidadProductoEnCarrito(cid, pid, cantidadNumerica);
        res.status(201).json({ message: 'Producto Actualizado en el Carrito', info: productoActualizado });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Añadir un producto al carrito o incrementar la cantidad si ya existe
export const agregarProductoAlCarrito = async (req, res) => {
    try {
        const producto = await cartDao.agregarProductoAlCarrito(req.params.cid, req.params.pid);
        res.status(201).json({ message: 'Producto Agregado', info: producto });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un carrito por ID
export const eliminarCarrito = async (req, res) => {
    try {
        const delCarrito = await cartDao.eliminarCarrito(req.params.cid);
        res.status(201).json({ message: 'Carrito Eliminado', info: delCarrito });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const eliminarProductoDelCarrito = async (req, res) => {
    try {
        const delProdInCarrito = await cartDao.eliminarProductoDelCarrito(req.params.cid, req.params.pid);
        res.status(201).json({ message: 'Producto Eliminado del carrito', info: delProdInCarrito });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const purchaseCart = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await cartDao.obtenerCarritoPorId(cartId);
  
      const failedProductIds = [];
  
      const ticket = await createTicket(cart);
  
      await processProducts(cart, failedProductIds);
  
      await updateCartAfterPurchase(cart, failedProductIds);
  
      res.status(200).json({ ticket, failedProductIds });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};
  
  async function createTicket(cart) {
    const ticketData = {
      code: generateUniqueCode(),
      purchase_datetime: new Date(),
      amount: cart.totalAmount,
      purchaser: cart.user,
    };
  
    const ticket = await TicketService.generateTicket(
      ticketData.code,
      ticketData.purchase_datetime,
      ticketData.amount,
      ticketData.purchaser
    );
  
    return ticket;
  }
  
  async function processProducts(cart, failedProductIds) {
    for (const cartProduct of cart.carrito) {
      const success = await updateProductStock(
        cartProduct.productID,
        cartProduct.cant,
        failedProductIds
      );
  
      if (!success) {
        continue;
      }
    }
  }
  
  async function updateProductStock(productId, quantity, failedProductIds) {
    const product = await productDao.obtenerProductoPorId(productId);
  
    if (product.stock >= quantity) {
      product.stock -= quantity;
      await product.save();
      return true;
    } else {
      failedProductIds.push(productId);
      return false;
    }
  }
  
  async function updateCartAfterPurchase(cart, failedProductIds) {
    const failedProducts = cart.carrito.filter((cartProduct) =>
      failedProductIds.includes(cartProduct.productID)
    );
  
    cart.carrito = failedProducts;
    await cartDao.saveCart(cart);
  }
  
  function generateUniqueCode() {
    return uuidv4();
  }