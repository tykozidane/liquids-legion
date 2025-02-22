import crypto from 'crypto';  

  // Encrypt function
  async function encrypt (text:string) {
    const cipher = crypto.createCipheriv('aes-256-cbc', process.env.SECRET_KEY as string, process.env.SECRET_VECTOR as string);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  };

  // Decrypt function
  async function decrypt(encryptedText:string) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', process.env.SECRET_KEY as string, process.env.SECRET_VECTOR as string);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  };

export {
    encrypt,
    decrypt
}