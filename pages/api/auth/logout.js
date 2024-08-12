import connectDB from '../../../utils/connectDB'
import Tokens from '../../../models/tokenModel'
import { COM1, COM2, CONTACT_ADMIN_ERR_MSG } from '../../../utils/constants'
import { verifyToken } from '../../../middleware/VerifyToken'
import { JWTExpired } from 'jose/errors'
import { serialize } from 'cookie';
import { generateCookie } from '../../../utils/CookieHelper'

connectDB()

/*
    POST - protected
*/

export default async (req, res) => {
    switch (req.method) {
        case "PUT":
            await logout(req, res)
            break;
    }
}

const logout = async (req, res) => {
    try {
        //await auth(req, res); // removed because session timeout issue occur.
        const refreshTokenId = await blacklistRefreshToken(req.cookies.com2, res);
        if (refreshTokenId) await Tokens.updateMany({ refreshTokenId }, { $set: { isBlackListed: true } });
        
        //  // Remove access token cookie
        // const accessTokenCookie = serialize(COM1, '', {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     maxAge: -1, // Expire the cookie immediately
        //     path: '/',
        // });

        // // Remove refresh token cookie
        // const refreshTokenCookie = serialize(COM2, '', {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     maxAge: -1, // Expire the cookie immediately
        //     path: '/',
        // });

        const accessTokenCookie = generateCookie(COM1, '', '/', -1);
        const refreshTokenCookie = generateCookie(COM2, '',  'api/auth/accessToken', -1);
      
        // Set the cookies with expired timestamps to delete them
        res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
        
        res.status(200).json({ msg: 'Logged out successfully!' });
    } catch (err) {
        console.error('Error occurred while logout: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const blacklistRefreshToken = async (refreshToken, res) => {
    try {
        if (!refreshToken) return res.status(401).json({ err: PLEASE_LOG_IN })
            const result = await verifyToken(refreshToken, process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET);
        return result.refreshTokenId;
    } catch (err) {
        console.error('Error occurred while blacklistRefreshToken: ' + err);
        if (err instanceof JWTExpired) return;
        return res.status(401).json({ err: PLEASE_LOG_IN });
    }
}