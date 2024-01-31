import { Router, json, urlencoded } from 'express'
import { usersRouter } from './users.router.js'
import { metodosPersonalizados } from '../../middlewares/metodosPersonalizados.js'
import { sessionsRouter } from './sessions.router.js'
import { errorHandler } from '../../middlewares/errorHandler.js'
import { cartsRouter } from './carts.router.js'
import {productosRouter} from './productos.router.js'
import { chatRouter } from './chat.router.js'


export const apiRouter = Router()

apiRouter.use(json())
apiRouter.use(urlencoded({ extended:true}))

apiRouter.use(metodosPersonalizados)

apiRouter.use('/users', usersRouter)
apiRouter.use('/sessions', sessionsRouter)
apiRouter.use('/productos', productosRouter)
apiRouter.use('/carts', cartsRouter)
apiRouter.use('/chat', chatRouter)




apiRouter.use(errorHandler)