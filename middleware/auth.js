import Users from '../models/userModel'
import { verifyToken } from './VerifyToken';
import { PLEASE_LOG_IN } from '../utils/constants';

/*
Verify Token & share user details
*/
const auth = async (req, res) => {
    const token = req.headers.authorization;
    if(!token) return res.status(401).json({err: PLEASE_LOG_IN})
   
    const decoded = await verifyToken(token, process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET);
    if(!decoded) return res.status(401).json({err: PLEASE_LOG_IN})

    const user = await Users.findOne({_id: decoded.id})

    return {id: user._id, role: user.role, root: user.root};
}

export default auth