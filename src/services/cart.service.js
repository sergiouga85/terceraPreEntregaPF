import { cartDao, usersDao } from '../dao/index.js'
import { TicketService } from './ticket.service.js'
import { emailService } from './email.service.js'
import { productDao } from '../dao/index.js'
import { v4 as uuidv4 } from 'uuid';



class CartService {

  async actualizarCantidadProductoEnCarrito(carritoId, productoId, nuevaCantidad) {
    try {
      const cantidadNumerica = parseInt(nuevaCantidad);
      if (isNaN(cantidadNumerica) || cantidadNumerica < 0) {
        throw new Error('La nueva cantidad debe ser un número válido y no puede ser negativa.');
      }

      const carrito = await cartDao.obtenerCarritoPorId(carritoId);
      const productoEnCarrito = carrito.carrito.find(item => item._id.toString() === productoId);
      if (!productoEnCarrito) {
        throw new Error('El producto no existe en el carrito.');
      }

      return await cartDao.actualizarCantidadProductoEnCarrito(carritoId, productoId, cantidadNumerica);
    } catch (error) {
      console.error(`Error en el servicio de carritos al actualizar la cantidad del producto: ${error.message}`);
      throw new Error('Error al actualizar la cantidad del producto en el carrito.');
    }
  }

  async purchaseCart(cartId) {
    try {
      const cart = await cartDao.obtenerCarritoPorId(cartId);
      const failedProductIds = [];
      const username = cart.user;

      const user = await usersDao.readOne({ username });
      const email = user.email;

      const ticket = await this.createTicket(cart);

      await this.processProducts(cart, failedProductIds);

      await this.updateCartAfterPurchase(cart, failedProductIds);

      await emailService.send(
        user.email,
        'Gracias por su compra',
        'Le informamos que ha sido realizada con éxito!',
        `Nro ticket: ${ticket.code}`
      );

      return { ticket, failedProductIds };
    } catch (error) {
      console.error(`Error en el servicio de carritos al realizar la compra: ${error.message}`);
      throw new Error('Error al realizar la compra del carrito.');
    }
  }

  async createTicket(cart) {
    const ticketData = {
      code: uuidv4(), // Asegúrate de que uuidv4 esté importado
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

  async processProducts(cart, failedProductIds) {
    for (const cartProduct of cart.carrito) {
      const success = await this.updateProductStock(
        cartProduct.productID,
        cartProduct.cant,
        failedProductIds
      );

      if (!success) {
        continue;
      }
    }
  }

  async updateProductStock(productId, quantity, failedProductIds) {
    try {
      const product = await productDao.obtenerProductoPorId(productId);

      if (product.stock >= quantity) {
        product.stock -= quantity;
        await product.save();
        return true;
      } else {
        failedProductIds.push(productId);
        return false;
      }
    } catch (error) {
      console.error(`Error en el servicio de carritos al actualizar el stock del producto: ${error.message}`);
      throw new Error('Error al actualizar el stock del producto.');
    }
  }

  async updateCartAfterPurchase(cart, failedProductIds) {
    try {
      const failedProducts = cart.carrito.filter((cartProduct) =>
        failedProductIds.includes(cartProduct.productID)
      );

      cart.carrito = failedProducts;
      await cartDao.saveCart(cart);
    } catch (error) {
      console.error(`Error en el servicio de carritos al actualizar el carrito después de la compra: ${error.message}`);
      throw new Error('Error al actualizar el carrito después de la compra.');
    }
  }
}

export const cartService= new CartService()