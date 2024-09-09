import connectDB from '../../../../utils/connectDB'
import Users from '../../../../models/userModel'
import { CONTACT_ADMIN_ERR_MSG, ERROR_403, PLEASE_LOG_IN } from '../../../../utils/constants'
import { verifyToken } from '../../../../middleware/VerifyToken'
import auth from '../../../../middleware/auth'

connectDB()

/*
    PATCH    - Protected
    GET    - Protected
*/

export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await getAddresses(req, res)
            break;
    }
}

const getAddresses = async (req, res) => {
    try {

        const result = await auth(req, res);

        if (!result || result.role !== 'user') return res.status(401).json({ err: ERROR_403 })

        const userAddresses = await Users.findOne({ _id: result.id }, { addresses: 1 });

        if (userAddresses && userAddresses.addresses) return res.status(200).json({ addresses: userAddresses.addresses })
        else res.status(204).end();
    } catch (err) {
        console.error('Error occurred while getAddresses: ', err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}
