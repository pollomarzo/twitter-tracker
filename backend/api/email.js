const mailClient = require('@sendgrid/mail');
const credentials = require('./twitter/.credentials');

const SENDER = credentials.addr;
const SUBJECT = '[Notification] Your selected treshold has been surpassed';

mailClient.setApiKey(credentials.sendGrid.api_key);

const sendNotification = async ({ email, tweetCount }) => {
  await mailClient.send({
    from: SENDER,
    to: email,
    subject: SUBJECT,
    text: `Currently we got ${tweetCount} tweets that fullfill your paramaters. See your results at [link accessibile dovunque]`,
  });
};

module.exports = { sendNotification };
