import { useState } from 'react';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'secret';

const useEncryption = () => {
  const [data, setData] = useState<string>('');

  const encryptData = (data: string) => {
    const encryptedData = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
    return encryptedData;
  };
  
  const decryptData = (encryptedData: string) => {
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    return decryptedData;
  };

  return { data, setData, encryptData, decryptData };
};

export default useEncryption;
