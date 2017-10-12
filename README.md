nodemailer-unione-transport
============================

## Что это?
nodemailer - это самый популярный node.js модуль для рассылки Email.
А это transport-плагин, который позволят nodemailer'у отправлять письма через сервис почтовых рассылок [UniOne](http://www.unisender.com/?a=opencart).
Сервис позволит вам не только осуществлять массовую рассылку без риска попасть в черный список SMTP, но и отслеживать доставку ваших писем.

## Пример использования

```javascript
var nodemailer = require('nodemailer');
var unione = require('unione-transport');

var options = {
    auth: {
        api_key: 'Уникальный API-ключ пользователя UniOne',
        username: 'Логин пользователя в системе'
    }
}

var nodemailerUnione = unione.createTransport(options);

nodemailerUnione.sendMail({
    from_email: 'myemail@example.com',  //Обратные адреса нужно зарегистрировать и подтвердить в Личном кабинете, или через API
    from_name: 'John Dow',              //Необязательный параметр
    recipients: [                       //До 500 адрессатов
        {
            "email": "some_email@domain.com"
            "substitutions":            //Необязательный параметр
            {
              "userName": "Ivan",
              "to_name": "Ivan Petrov"
            }
        },
        {
            "email": "other_email@domain.com"
            "substitutions": 
            {
              "userName": "Nina",
              "to_name": "Nina Pavlova"
            }
        }
    ],
    subject: '{{userName}}, you are awesome!',  //Всесто {{userName}} подставится строка из substitutions
    body:
        {
          "html": "<b>Hello, {{userName}}</b>", //Должен присутствовать хотя бы один из параметров
          "plaintext": "Hello, {{userName}}"
        },
    metadata:                                   //Необязательный параметр
        {
            "mailId" : "3423452345234234"       //Эти параметры будут переданы в Webhook
        }
}, function (err, info) {
    if (err) {
        console.log('Error: ' + err);
    }
    else {
        console.log('Response: ' + info);
    }
});
```
