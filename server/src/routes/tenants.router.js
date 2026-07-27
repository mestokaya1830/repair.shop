import express from 'express'
import { index, updateTenantProfile } from '../controllers/tenants.controller.js'
import validate from '../middleware/validate.js'
import { tenantsSchema } from '../validations/tenants.schema.js'
import auth  from '../middleware/auth.js'

const router = express.Router()


router.get('/', auth, index)
router.put('/update', validate(tenantsSchema), updateTenantProfile)



export default router