import express from 'express'
import {repairController} from '../controllers/repair.controller.js'
import {repairSchema} from '../validators/repair.schema.js'
import validate from '../middleware/validate.js';

const router = express.Router()

router.post('/repair', validate(repairSchema), repairController)



export default router