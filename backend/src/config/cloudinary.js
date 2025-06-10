const cloudinaryPackage = require('cloudinary');
const { cloudName, cloudApiKey, cloudApiSecret } = require('./env');

const cloudinary = cloudinaryPackage.v2;

cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudApiKey,
  api_secret: cloudApiSecret
});

module.exports = cloudinary;
