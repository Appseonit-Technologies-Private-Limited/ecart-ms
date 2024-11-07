import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import Tokens from '../../../models/tokenModel'
import { createAccessToken } from '../../../utils/generateToken'
import { COM1, COM1_MAXAGE, CONTACT_ADMIN_ERR_MSG, PLEASE_LOG_IN } from '../../../utils/constants'
import { verifyToken } from '../../../middleware/VerifyToken'
import { generateCookie } from '../../../utils/CookieHelper'
import { log_error, log_info } from '../../../middleware/log'

connectDB()

export default async (req, res) => {
    try {
        const {com1: accessToken, com2: refreshToken} = req.cookies;
        //log_info('accessToken : ',accessToken);
        //log_info('refreshToken : ',refreshToken);

        var verifiedToken;
        var isAccessTokenActive = false;

        if(accessToken){
            log_info('Verifying access token...');
            verifiedToken = await verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
            isAccessTokenActive = true;
        }
        log_info('verifiedToken : '+verifiedToken+' , refreshToken : '+refreshToken);
        if (!verifiedToken && refreshToken){
            log_info('Verifying refresh token...');
            verifiedToken = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        }  
        
        if (!verifiedToken) return res.status(401).json({ err: PLEASE_LOG_IN });
        log_info('________Token verification successful________________');
        
        if(verifiedToken.refreshTokenId){
            const isBlackListed = await checkIsBlacklistedToken(verifiedToken.refreshTokenId, res);
            if(isBlackListed) return res.status(401).json({ err: `You are not authorized to access the application right now, ${CONTACT_ADMIN_ERR_MSG}` })
        }

        const user = await Users.findById(verifiedToken.id);
        if (!user) return res.status(403).json({ err: 'User does not exist.' });

        var access_token;
        if(isAccessTokenActive){
            access_token = accessToken;
            log_info('Retrieveing existing Access Token...');
        }else{
            access_token = await createAccessToken({ id: user._id });
            log_info('New Access Token ['+access_token+'] generated successfully!');

            const accessTokenCookie = generateCookie(COM1, access_token, '/', COM1_MAXAGE);

            // Set both cookies in the response header
            res.setHeader('Set-Cookie', accessTokenCookie);
        }
        //log_info('ACCESS TOKEN : ', access_token);
        res.json({
            access_token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                root: user.root,
                activated: user.activated
            }
        })
    } catch (err) {
        log_error('Error occurred while accessToken: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const checkIsBlacklistedToken = async (refreshTokenId, res) => {
    const token = await Tokens.findOne({ refreshTokenId, isBlackListed: true});
    if (token) {
        log_error('WARNING: Blacklisted user accessing the system, refreshTokenId: ', refreshTokenId);
        return true;
    }
}
