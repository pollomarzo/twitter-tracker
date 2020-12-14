const sgmail = require('@sendgrid/mail');
const credentials = require('./twitter/.credentials');
sgmail.setApiKey(credentials.sendGrid.api_key);

module.exports = sgmail;