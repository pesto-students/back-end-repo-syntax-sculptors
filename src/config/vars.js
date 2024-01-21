const path = require('path');

// Import .env variables
require('dotenv').config({
  path: path.join(__dirname, '../../.env'),
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIPRATION_MINUTES,
  mongo: {
    uri:
      process.env.NODE_ENV === 'test '
        ? process.env.MONGODB_URI_TESTS
        : process.env.MONGODB_URI,
    dbName: process.env.DB_NAME,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};
