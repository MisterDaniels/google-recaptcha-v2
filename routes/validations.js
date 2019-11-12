var express = require('express');
var router = express.Router();
const { stringify } = require('querystring');
const fetch = require('node-fetch');

const decriptation = require('../src/decriptation');
const crypto = require('crypto');

// faz requisição através de post
router.post('/', async function(req, res, next) {
  
  // Verifica se o Captcha foi preenchido
  if (!req.body.captcha) {
    return res.json({ success: false, msg: 'Por favor, valide o Captcha' });
  }
  
  // Faz a criptografia do email
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  var dataEncrypted = decriptation.encrypt(req.body.email, key, iv);
  console.log(dataEncrypted);
  console.log(decriptation.decrypt(dataEncrypted, key));

  // Chave privada da API do ReCaptcha
  const secretKey = '6LeAMMIUAAAAAOxxOry9jwqhX63--vDOsENycbFE';
  
  // Constroi a URL para verificar com o ReCaptcha do Google
  const query = stringify({
    secret: secretKey,
    response: req.body.captcha,
    remoteip: req.connection.remoteAddress
  });
  const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;
  
  // Faz a requisição para veirificar a URL, se é do dono do projeto e se o catpcha está certo
  const body = await fetch(verifyURL).then(res => res.json());

  // Se não der certo
  if (body.success !== undefined && !body.success)
    return res.json({ success: false, msg: 'Falhou ao validar o Captcha' });

  // Se der certo
  return res.json({ success: true, msg: 'Testes do Captcha passaram'});
});

module.exports = router;

