const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    allowed_formats: ['jpg', 'png', 'jpeg'],
    params: {
        folder: 'Shop-app',
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
