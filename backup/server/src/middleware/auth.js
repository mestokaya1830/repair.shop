import AppError from "../utils/app.error.js";
import {env} from '../config/env.js'
import jwt from 'jsonwebtoken'
import logger from '../utils/logger.js'


const auth = (req, res, next) => {
  try {
    const {authorization} = req.headers
    if(!authorization || !authorization.startsWith('Bearer ')){
      logger.warn('Unauhorized')
      return next(new AppError('Unauhorized', 401, 'UNAUHTORIZED'))
    }
    const token =  authorization.replace('Bearer ', '')
    req.user = jwt.verify(token, env.JWT_SECRET)
    next()
  } catch (error) {
     logger.warn('Invalid Token')
    return next(new AppError('Invalid Token', 401, 'INVALID_TOKEN'))
  }
}

export default auth