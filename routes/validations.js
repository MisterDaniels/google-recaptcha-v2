var express = require('express');
var router = express.Router();

router.post('/', function(req, rest, next) {
    if (
      req.body.captcha === undefined||
      req.body.captcha === '' ||
      req.body.captcha === null
    ) {
      return res.json({'success': false, 'msg': 'Está errado!'});
    }
  
    const secretKey = '6LeAMMIUAAAAAOxxOry9jwqhX63--vDOsENycbFE';
  
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;
  
    request(verifyUrl, (err, response, body) => {
      body = JSON.parse(body);
  
      if (body.success !== undefined && !body.success) {
        return res.json({'success': false, 'msg': 'Captcha falhou'});
      }
  
      return res.json({'success': true, 'msg': 'Captcha passou'});
    });
});

module.exports = router;

