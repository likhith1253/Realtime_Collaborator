import { config } from './src/config';
import dotenv from 'dotenv';
dotenv.config();

console.log('LOADING TEST');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('Config Port:', config.port);
