import crypto from 'crypto'
import Tokens from '../models/tokenModel'
import moment from 'moment'
import { COM1_EXPIRES_IN } from './constants'
import { SignJWT } from 'jose';

export const createAccessToken = async (payload) => {
   return await createToken(payload, COM1_EXPIRES_IN, process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET);
}

export const createRefreshToken = async (payload, expiresIn) => {
    const refreshTokenId = crypto.randomBytes(16).toString('hex');
    const refresh_token = await createToken(payload, expiresIn, process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET);
    saveToken(refreshTokenId, payload.id, refresh_token);
    return refresh_token;
}

const saveToken = async (refreshTokenId, userId, refreshToken) =>{
    await new Tokens({
        userId,
        refreshTokenId,
        token: refreshToken,
        createdAt: Date.now(),
        expiresAt: moment().add(7, 'days')
    }).save();
}


const createToken = async(payload, expiryTime, secret)=>{

    try {
       return new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime(expiryTime)
            .sign(new TextEncoder().encode(secret));
    } catch (err) {
        console.log('Error while creating token:',err);
    }
}