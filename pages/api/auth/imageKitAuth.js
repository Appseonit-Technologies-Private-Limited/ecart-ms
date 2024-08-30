import auth from '../../../middleware/auth';
import { CONTACT_ADMIN_ERR_MSG, ERROR_403 } from '../../../utils/constants';
import ImageKit from "imagekit";

export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await authenticateImageKit(req, res)
            break;
    }
}

const authenticateImageKit = async (req, res) =>{    
    try {        
        const result = await auth(req, res)
        if (result && (result.role !== 'admin' && result.role !== 'user')) return res.status(403).json({ err: ERROR_403 })

        const imageKit = new ImageKit({
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.IMAGEKIT_ENDPOINT,
        });

    var authenticationParameters = imageKit.getAuthenticationParameters();
        return res.status(200).json(authenticationParameters);
    } catch (err) {
        console.error('Error occurred while ImageKit Autentication: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    } 
}
