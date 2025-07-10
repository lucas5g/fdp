import crypto, { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const secretKey = crypto.createHash('sha256').update('secret').digest()
const algorithm = 'aes-256-cbc'

function encrypt(text:string){
  const iv = randomBytes(16)
  const cipher = createCipheriv(algorithm, secretKey, iv)
  const encrypted = cipher.update(text, 'utf8', 'hex')

  const cipherEncoded = encrypted + cipher.final('hex')

  return `${iv.toString('hex')}.${cipherEncoded}`
}

function decrypt(text:string){
  const [iv, encrypted] = text.split('.')
  const decipher = createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'))
  const decrypted = decipher.update(encrypted, 'hex', 'utf8')
  return decrypted + decipher.final('utf8')
}

const encrypted = encrypt('teste-123') 
const decrypted = decrypt(encrypted)  

console.log({
  encrypted,
  decrypted
})