import mongoose from 'mongoose'
import {env} from '../config/env.js'
import logger from '../logger/logger.js';

const connectMongo = async () => {
  try {
    await mongoose.connect(env.MONGO, {
        serverSelectionTimeoutMS: 5000
    })
    console.log('Mongo COnnected') //fur developer
    logger.info('Mongo Connected')
  } catch (error) {
    console.error(error) //fur developer
    logger.error(error.message)
  }
}

export default connectMongo