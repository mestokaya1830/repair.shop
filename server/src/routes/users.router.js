import express from 'express'
import { index, edit, details, updateUser, profile, updateProfile, create } from '../controllers/users.controller.js'
import auth from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import {usersSChema, usersUpdateSchema} from '../validators/schemas.js'


const router = express.Router()


router.get('/', auth, index)
router.get('/profile', auth, profile)
router.patch('/profile/update', auth, updateProfile)
router.post('/create', auth, validate(usersSChema), create)

router.get('/:id/details', auth, details)
router.get('/:id/edit', auth, edit)
router.patch('/:id/update', auth, validate(usersUpdateSchema), updateUser)



export default router