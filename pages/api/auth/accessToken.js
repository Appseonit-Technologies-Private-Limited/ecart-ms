import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import Tokens from '../../../models/tokenModel'
import { createAccessToken } from '../../../utils/generateToken'
import { COM1, COM1_MAXAGE, CONTACT_ADMIN_ERR_MSG, PLEASE_LOG_IN } from '../../../utils/constants'
import { verifyToken } from '../../../middleware/VerifyToken'
import { generateCookie } from '../../../utils/CookieHelper'

connectDB()

export default async (req, res) => {
    try {
        const {com1: accessToken, com2: refreshToken} = req.cookies;
        //console.log('accessToken : ',accessToken);
        //console.log('refreshToken : ',refreshToken);

        var verifiedToken;
        var isAccessTokenActive = false;

        if(accessToken){
            verifiedToken = await verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
            isAccessTokenActive = true;
        }else{
            if (!refreshToken) return res.status(401).json({ err: PLEASE_LOG_IN });

            verifiedToken = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            //console.log('Validating Refresh Token : ',verifiedToken);  
        }

        if (!verifiedToken) return res.status(401).json({ err: PLEASE_LOG_IN });

        if(verifiedToken.refreshTokenId){
            const isBlackListed = await checkIsBlacklistedToken(verifiedToken.refreshTokenId, res);
            if(isBlackListed) return res.status(401).json({ err: `You are not authorized to access the application right now, ${CONTACT_ADMIN_ERR_MSG}` })
        }

        const user = await Users.findById(verifiedToken.id);
        if (!user) return res.status(403).json({ err: 'User does not exist.' });

        var access_token;
        if(isAccessTokenActive){
            access_token = accessToken;
            console.log('Retrieveing existing Access Token ['+ access_token+']');
        }else{
            access_token = await createAccessToken({ id: user._id });
            console.log('New Access Token ['+access_token+'] generated successfully!');

            const accessTokenCookie = generateCookie(COM1, access_token, '/', COM1_MAXAGE);

            // Set both cookies in the response header
            res.setHeader('Set-Cookie', accessTokenCookie);
        }
        //console.log('ACCESS TOKEN : ', access_token);
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
        console.error('Error occurred while accessToken: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const checkIsBlacklistedToken = async (refreshTokenId, res) => {
    const token = await Tokens.findOne({ refreshTokenId, isBlackListed: true});
    if (token) {
        console.error('WARNING: Blacklisted user accessing the system, refreshTokenId: ', refreshTokenId);
        return true;
    }
}
