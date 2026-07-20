import winston from 'winston'
import 'winston-daily-rotate-file'
import {env} from '../config/env.js'

const {combine, errors, json, timestamp, printf, colorize} = winston.format

const logger = winston.createLogger({
  defaultMeta: {service: 'mesfor repair shop', env: env.NODE_ENV ?? 'development'},
  level: 'info',
  format: combine(
    timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    errors({stack: true}),
    json()
  ),

  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'log/combined/%DATE.log',
      maxFiles: '7d',
      maxSize: '20m',
      datePattern: 'YYYY-MM-DD'
    }),
    new winston.transports.DailyRotateFile({
      level: 'error',
      filename: 'log/error/%DATE.log',
      maxFiles: '7d',
      maxSize: '20m',
      datePattern: 'YYYY-MM-DD'
    })
  ],
  rejectionHandlers: [
    new winston.transports.DailyRotateFile({
      level: 'error',
      filename: 'log/rejection/%DATE.log',
      maxFiles: '7d',
      maxSize: '20m',
      datePattern: 'YYYY-MM-DD'
    })
  ],
  exceptionHandlers: [
    new winston.transports.DailyRotateFile({
      level: 'error',
      filename: 'log/exception/%DATE.log',
      maxFiles: '7d',
      maxSize: '20m',
      datePattern: 'YYYY-MM-DD'
    })
  ]
})

export default logger