import CryptoJS from 'crypto-js';

const SECRET_KEY = 'secret';

const encryptData = (data: string) => {
  const encryptedData = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  return encryptedData;
};

const decryptData = (encryptedData: string) => {
  const decryptedData = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY).toString(CryptoJS.enc.Utf8);
  return decryptedData;
};

export { encryptData, decryptData };