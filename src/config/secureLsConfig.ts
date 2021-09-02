const secureLsConfig = {
  isCompression: false,
  encodingType: 'aes',
  encryptionSecret: process.env.VUE_APP_LS_ENCRYPTION_SECRET,
};

export { secureLsConfig };
