import express from 'express'
import { addUserController, getUserController, detailUserController, editUserController, updateUserController } from '../controllers/user.controller.js'
import auth from '../middleware/auth.js'


const router = express.Router()


router.get('/', auth, getUserController)
router.get('/:id/detail', auth,  detailUserController)
router.get('/:id/edit', auth,  editUserController)
router.patch('/:id/update', auth,  updateUserController)
router.post('/create', auth,  addUserController)



export default router