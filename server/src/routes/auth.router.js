import express from 'express'
import { loginController } from '../controllers/auth.controller.js'
import validate from '../middleware/validate.js'
import { loginSchema } from '../validators/schemas.js'


const router = express.Router()


router.post('/login', validate(loginSchema), loginController)



export default router