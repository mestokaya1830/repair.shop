import express from 'express'
import {repairController, repairTrackController} from '../controllers/repair.controller.js'
import {repairSchema} from '../validators/repair.schema.js'
import validate from '../middleware/validate.js';
import upload from '../middleware/upload.images.js';
import createRepairNumber from '../middleware/reapir.number..middleware.js';
const router = express.Router()

router.post('/repair', createRepairNumber, upload.array('images', 5), repairController)
router.get('/repair/track/:repairNumber', repairTrackController);


export default router