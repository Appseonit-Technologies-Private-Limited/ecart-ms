import ImageKit from "imagekit";

const imageKit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_ENDPOINT,
});

export const cloud_uploads = (file, fileName, folder) => {
    return new Promise((resolve, reject) => {
    
        // Perform the upload
        imageKit.upload({
            file, // Send the file as binary data
            fileName, // Name of the uploaded file
            folder // Optional folder to upload into
        }, (error, result) => {
            if (error) {
                console.error('Image upload failed to ImageKit: ', error);
                reject(new Error(`Image upload failed to ImageKit: ${error.message}`));
            } else {
                console.log('Image uploaded to ImageKit successfully! : ', fileName);
                resolve({ url: result.url, public_id: result.fileId });
            }
        });
    });
};

export const cloud_delete = async (publicIds) => {
   try {
        publicIds.map(publid_id => imageKit.deleteFile(publid_id));
        console.log('Image deleted successfully!');
   } catch (error) {
        throw new Error('Image delete failed to ImageKit:', error);
   }
}