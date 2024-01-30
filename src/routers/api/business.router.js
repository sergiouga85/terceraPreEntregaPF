import { Router } from 'express'
import {handleGet, handlePost,} from '../../controllers/business.controllers.js'
  //handlePut,// handleDelete,} from '../../controllers/business.controllers.js'

export const businessRouter = Router()

businessRouter.get('/:id?', handleGet)
businessRouter.post('/', handlePost)
// businessRouter.put('/:id', handlePut)
// businessRouter.delete('/:id', handleDelete)