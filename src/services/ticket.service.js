export class TicketService {
    async generateTicket(cart) {
        try {
          // Crear un nuevo ticket con los datos de la compra
          const nuevoTicket = new Ticket({
            code: generateUniqueCode(), // Debes implementar la lógica para generar un código único
            purchase_datetime: new Date(),
            amount: calculateTotalAmount(cart.products),
            purchaser: cart.userEmail, // Asumo que tienes el correo del usuario asociado al carrito
          });
    
          // Guardar el ticket en la base de datos
          const ticketGuardado = await nuevoTicket.save();
    
          return { status: 200, response: { message: 'Ticket generado con éxito', ticket: ticketGuardado } };
        } catch (error) {
          console.error(error);
          return { status: 500, response: { error: 'Error al generar el ticket' } };
        }
      }
  }
  
  // Función para generar un código único (puedes implementar la lógica que prefieras)
  function generateUniqueCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }
  
  // Función para calcular el total de la compra en base a los productos del carrito
  function calculateTotalAmount(products) {
    return products.reduce((total, cartProduct) => {
      const productPrice = cartProduct.product.price;
      const productQuantity = cartProduct.quantity;
      return total + productPrice * productQuantity;
    }, 0);
  }