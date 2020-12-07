const sgmail = require('@sendgrid/mail');
const credentials = require('./twitter/.credentials');
sgmail.setApiKey(credentials.sendGrid.api_key);

var email = {
  from: '***REMOVED***',
  to: '***REMOVED***',
  subject: 'Hello',
  text: 'test',
  html: '<b>Hello world</b>',
};

sgmail
  .send(email)
  .then(() => {
    console.log('sent');
  })
  .catch((error) => {
    console.log(error);
  });
