import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import bcrypt from 'bcrypt'
import { createAccessToken, createRefreshToken } from '../../../utils/generateToken'
import { ACCEPT_COOKIE_CONSENT_MSG, COM1, COM1_MAXAGE, COM2, COM2_EXPIRES_IN, COM2_MAXAGE, CONTACT_ADMIN_ERR_MSG, INVALID_LOGIN } from '../../../utils/constants'
import { generateCookie } from '../../../utils/CookieHelper'

connectDB()

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await login(req, res)
            break;
    }
}

const login = async (req, res) => {
    try {
        const { userName: email, password , cookieConsent} = req.body;
        // Check for cookie consent
        console.log('Cookie Consent : ', cookieConsent);
        const consent = cookieConsent === 'true';
        if (!consent) {
            return res.status(400).json({ err: ACCEPT_COOKIE_CONSENT_MSG });
        }
        let user = await Users.findOne({ email })
        if (!user) user = await Users.findOne({ name: email })
        if (!user) return res.status(401).json({ err: INVALID_LOGIN })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(401).json({ err: INVALID_LOGIN })
      
        //Generating Access Token = com1(ExpiresIn= 15 mins) & Refresh Token = com2(ExpiresIn=7 days)
        const access_token = await createAccessToken({ id: user._id });
        const refresh_token = await createRefreshToken({ id: user._id}, COM2_EXPIRES_IN);

        const accessTokenCookie = generateCookie(COM1, access_token, '/', COM1_MAXAGE);
        const refreshTokenCookie = generateCookie(COM2, refresh_token,  'api/auth/accessToken', COM2_MAXAGE);
      
        // Set both cookies in the response header
        res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

        res.json({
            msg: `Welcome back, ${user.name}`,
            refresh_token,
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
        console.error('Error occurred while login: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}