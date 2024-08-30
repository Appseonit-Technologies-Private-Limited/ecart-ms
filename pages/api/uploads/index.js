import {createRouter} from 'next-connect';
import {upload} from './multer';
import { cloud_uploads } from './uploadUtil';


const apiRoute = createRouter();

// Middleware for handling file uploads using multer
apiRoute.use(upload.array('files')); // Accepts multiple files with the key 'files'

// Handle file upload
apiRoute.post(async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Upload each file to ImageKit
    const uploadPromises = files.map(file => {
      const fileBufferBase64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${fileBufferBase64}`;
      return cloud_uploads(dataURI, file.originalname, req.query.folder || '/');
    });

    const uploadedImages = await Promise.all(uploadPromises);

    return res.status(200).json({ message: 'Images uploaded successfully', data: uploadedImages });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiRoute.handler();