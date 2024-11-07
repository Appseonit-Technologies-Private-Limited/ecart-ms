import mongoose from 'mongoose'
import { log_info } from '../middleware/log';

const connectDB = async () => {
    if(mongoose.connections[0].readyState){
        log_info('Already connected.')
        return;
    }
    await mongoose.connect(process.env.MONGODB_URL)
    .then((result) => {
        if(result.connections[0].readyState) log_info("Database Connected successfully!");
    })
    .catch(err => log_info("Connection to DB failed! reason : "+err));
}


export default connectDB