import express from 'express'
import { index, edit, details, update, create, remove, customerDevices } from '../controllers/devices.controller.js'
import auth from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { devicesSchema, deviceUpdateSchema } from '../validators/schemas.js'

const router = express.Router()


router.get("/customer/:customerId", auth, customerDevices);
router.get('/', auth, index)
router.post('/create', auth, validate(devicesSchema), create)

router.get('/:id/details', auth, details)
router.get('/:id/edit', auth, edit)
router.patch('/:id/update', auth, validate(deviceUpdateSchema), update)
router.delete('/:id/remove', auth, remove)



export default router