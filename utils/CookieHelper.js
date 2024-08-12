import { serialize } from 'cookie';

export const generateCookie = (name, value, path, maxAge) =>{
   return serialize(name, value, {
        path, // it will be available in every request.
        maxAge,
        secure: process.env.NEXT_PUBLIC_HOSTNAME !== 'localhost',
        httpOnly: true, //reading this cookie in clientside js.
        sameSite: 'Lax'
    })
}