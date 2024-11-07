import { jwtVerify } from 'jose';
import { log_error } from './log';

export const verifyToken = async (token, secret) =>{
   try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
        return payload;
   } catch (err) {
        log_error('Error while verifyToken : ',err);
        return {err};
   } 
}