import { Router } from 'express';
import { obtenerCarritos, obtenerCarritoPorId, crearCarrito, actualizarCantidadProductoEnCarrito,agregarProductoAlCarrito,eliminarCarrito,eliminarProductoDelCarrito,purchaseCart } from '../../controllers/carts.controllers.js'
import { usersOnly } from '../../middlewares/authorization.js';
import { passportAuth } from '../../middlewares/passport.js';

export const cartsRouter = Router();

cartsRouter.get('/', obtenerCarritos);
cartsRouter.get('/:cid', obtenerCarritoPorId);
cartsRouter.post('/', crearCarrito);
cartsRouter.put('/:cid/producto/:pid', actualizarCantidadProductoEnCarrito);
cartsRouter.put('/:cid/add/:pid',passportAuth,usersOnly,agregarProductoAlCarrito);
cartsRouter.delete('/:cid', eliminarCarrito);
cartsRouter.delete('/:cid/producto/:pid', eliminarProductoDelCarrito);
cartsRouter.post('/:cid/purchase', purchaseCart );
