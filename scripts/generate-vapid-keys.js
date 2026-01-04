// Script para gerar chaves VAPID para Web Push Notifications
// Execute: node scripts/generate-vapid-keys.js

const webpush = require("web-push")

console.log("Gerando chaves VAPID...\n")

const vapidKeys = webpush.generateVAPIDKeys()

console.log("✅ Chaves VAPID geradas com sucesso!\n")

console.log("Adicione estas variáveis ao seu arquivo .env:\n")

console.log("VAPID_PUBLIC_KEY=" + vapidKeys.publicKey)
console.log("VAPID_PRIVATE_KEY=" + vapidKeys.privateKey)
console.log("VAPID_SUBJECT=mailto:contato@portoseguroingressos.com\n")

console.log("⚠️  IMPORTANTE: Mantenha a chave privada segura e nunca a compartilhe!")

