import express from 'express'
import { index, create, edit, details, updateUser, profile, updateProfile } from '../controllers/users.controller.js'
import auth from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import {usersSchema, usersUpdateSchema} from '../validations/users.schema.js'


const router = express.Router()


router.get('/', auth, index)
router.post('/create', auth, validate(usersSchema), create)
router.get('/profile', auth, profile)
router.patch('/profile/update', auth, updateProfile)

router.get('/:id/details', auth, details)
router.get('/:id/edit', auth, edit)
router.patch('/:id/update', auth, validate(usersUpdateSchema), updateUser)



export default router