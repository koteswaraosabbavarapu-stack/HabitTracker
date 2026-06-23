const validateEnv = () => {
  const required = [
    'PORT',
    'MONGO_URI',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'NODE_ENV',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CALLBACK_URL'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error(`Missing environment variables: ${missing.join(', ')}`);
    process.exit(1); // stop server immediately
  }

  console.log('✅ All environment variables loaded');
};

module.exports = validateEnv;
