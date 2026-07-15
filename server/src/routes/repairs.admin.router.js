import express from 'express'
import { index, edit, details, update, updateStatus, create, remove } from '../controllers/repairs.admin.controller.js'
import auth from '../middleware/auth.js'


const router = express.Router()


router.get('/', auth, index)
router.post('/create', auth, create)

router.get('/:id/details', auth, details)
router.get('/:id/edit', auth, edit)
router.patch("/:id/status", auth, updateStatus);
router.patch('/:id/update', auth, update)
router.delete('/:id/remove', auth, remove)



export default router