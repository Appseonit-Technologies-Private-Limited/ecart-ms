import nextConnect from 'next-connect';
import { cloud_uploads, cloud_delete } from './cloudinary';
import { upload } from "./multer";

const apiRoute = nextConnect({
  onError(error, req, res) {
    console.log('Error occurred while image upload: ' + error);
    res.status(501).json({ error: `Image upload Error: ${error}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.array('file'), async (req, res) => {
  switch (req.method) {
    case 'POST': uploadImage(req, res);
      break;
    case 'DELETE':
      deleteImage(req, res);
      break;
    default:
      res.status(405).json({ err: `${req.method} method not allowed` })
  }
});

const uploadImage = async (req, res) => {
  const files = req.files;
  var urls = [];
  const uploader = async (path) => await cloud_uploads(path, req.query.to);
  for (const file of files) {
    const { path } = file;
    const newPath = await uploader(path)
    urls.push({ url: newPath })
  }
  res.status(200).json({
    message: 'images uploaded successfully',
    data: urls
  })
}

const deleteImage = (req, res) => {
  const imageDelete = cloud_delete(req.query.public_id);
  console.log('imageDelete : ',imageDelete);
  res.status(200).json({ message: 'Image(s) deleted successfully!' });
}

apiRoute.post((req, res) => {
  res.status(200).json({ data: 'success' });
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default apiRoute;