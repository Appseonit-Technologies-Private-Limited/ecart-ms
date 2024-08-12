import { jwtVerify } from 'jose';

export const verifyToken = async (token, secret) =>{
   try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
        return payload;
   } catch (err) {
        console.log('Error while verifyToken : ',err);
   } 
}