import express from 'express'
import { index, edit, details, update, create, remove } from '../controllers/customers.controller.js'
import auth from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import {customerSchema, updateCustomerSchema} from '../validators/schemas.js'

const router = express.Router()


router.get('/', auth, index)
router.post('/create', auth, validate(customerSchema), create)

router.get('/:id/details', auth, details)
router.get('/:id/edit', auth, edit)
router.patch('/:id/update', auth, validate(updateCustomerSchema), update)
router.delete('/:id/remove', auth, remove)



export default router