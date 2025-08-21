import crypto from "crypto";

// ⚠️ Defina sua chave secreta como variável de ambiente
const SECRET_KEY = "cXTF7YKNZs7UX|k54?4g!ThP+c5]x{c7"
// process.env.SECRET_KEY || ":~ct6N|Y38@5C,?D"; 
const IV = Buffer.alloc(16, 0); // vetor de inicialização (pode randomizar também)

// Função para cifrar
function cifrar(texto) {
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(SECRET_KEY), IV);
  let encrypted = cipher.update(texto, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// Função para decifrar
function decifrar(textoCifrado) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(SECRET_KEY), IV);
  let decrypted = decipher.update(textoCifrado, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Exemplo de uso:
const senhaOriginal = "minhaSenha123";
const senhaCifrada = cifrar(senhaOriginal);

console.log("Senha Cifrada:", senhaCifrada);

// Quando o bot precisar logar
const senhaDecifrada = decifrar(senhaCifrada);
console.log("Senha Decifrada:", senhaDecifrada);
