import express from 'express'
import { getUserController, detailUserController, editUserController, updateUserController, getProfileController, updateProfileController, createUserController } from '../controllers/user.controller.js'
import auth from '../middleware/auth.js'


const router = express.Router()


router.get('/', auth, getUserController)
router.get('/profile', auth, getProfileController)
router.patch('/profile/update', auth, updateProfileController)
router.get('/:id/detail', auth, detailUserController)
router.get('/:id/edit', auth, editUserController)
router.patch('/:id/update', auth, updateUserController)
router.post('/create', auth, createUserController)



export default router