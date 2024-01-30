import {cartDao} from '../dao/index.js';

export class CartService{

    async actualizarCantidadProductoEnCarrito(carritoId, productoId, nuevaCantidad){
        try {
            // Verificar que la nueva cantidad sea un número válido y no sea negativa
            const cantidadNumerica = parseInt(nuevaCantidad);
            if (isNaN(cantidadNumerica) || cantidadNumerica < 0) {
                throw new Error('La nueva cantidad debe ser un número válido y no puede ser negativa.');
            }

            // Verificar que el producto exista en el carrito antes de actualizar la cantidad
            const carrito = await cartDao.obtenerCarritoPorId(carritoId);
            const productoEnCarrito = carrito.carrito.find(item => item._id.toString() === productoId);
            if (!productoEnCarrito) {
                throw new Error('El producto no existe en el carrito.');
            }

            // Actualizar la cantidad usando el DAO
            return await cartDao.actualizarCantidadProductoEnCarrito(carritoId, productoId, cantidadNumerica);
        } catch (error) {
            throw new Error(`Error en el servicio de carritos: ${error.message}`);
        }
    };

    async purchaseCart(cartId) {
        try {
          const cart = await cartDao.getCartById(cartId);
    
          if (!cart) {
            return { status: 404, response: { error: 'Carrito no encontrado' } };
          }
    
          const failedProductIds = [];
    
          for (const cartProduct of cart.products) {
            const productId = cartProduct.product._id;
            const requestedQuantity = cartProduct.quantity;
    
            const product = await cartDao.getProductById(productId);
    
            if (!product) {
              failedProductIds.push(productId);
            } else if (product.stock >= requestedQuantity) {
              // Restar la cantidad del stock del producto
              product.stock -= requestedQuantity;
              await cartDao.updateProduct(product);
            } else {
              failedProductIds.push(productId);
            }
          }
    
          // Generar un ticket con los datos de la compra
          const ticketResponse = await TicketService.generateTicket(cart);
    
          // Limpiar el carrito después de la compra
          cart.products = cart.products.filter((cartProduct) =>
            failedProductIds.includes(cartProduct.product.toString())
          );
    
          await cartDao.updateCart(cart);
    
          if (failedProductIds.length > 0) {
            return {
              status: 400,
              response: {
                message: 'Algunos productos no pudieron ser procesados en la compra.',
                failedProductIds,
              },
            };
          } else {
            return { status: 200, response: { message: 'Compra realizada con éxito', ticket: ticketResponse } };
          }
        } catch (error) {
          console.error(error);
          return { status: 500, response: { error: 'Error interno del servidor' } };
        }
      }
}