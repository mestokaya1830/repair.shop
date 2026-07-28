import express from 'express'
import { login, resetPassword } from '../controllers/auth.controller.js'
import validate from '../middleware/validate.js'
import { loginSchema, resetPasswordSchema } from '../validations/auth.schema.js'


const router = express.Router()


router.post('/login', validate(loginSchema), login)
router.post('/reset-password', validate(resetPasswordSchema), resetPassword)



export default router