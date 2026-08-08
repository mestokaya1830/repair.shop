import mongoose from 'mongoose'
import {env} from '../config/env.js'
import logger from '../utils/logger.js';

const connectMongo = async () => {
  try {
    await mongoose.connect(env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log('Connected to MongoDB') //fur developer
    logger.info('Connected to MongoDB')
  } catch (error) {
    console.error(error) //fur developer
    logger.error(error.message)
  }
}

export default connectMongo
