const mailClient = require('@sendgrid/mail');
const credentials = require('./twitter/.credentials');

const SENDER = '***REMOVED***';
const SUBJECT = '[Notification] Your selected treshold has been surpassed';

mailClient.setApiKey(credentials.sendGrid.api_key);

const sendNotification = async ({ email, tweetCount }) => {
  try {
    await mailClient.send({
      from: SENDER,
      to: email,
      subject: SUBJECT,
      text: `Currently we got ${tweetCount} tweets that fullfill your paramaters. See your results at [link accessibile dovunque]`,
    });
    console.log('Email sent');
  } catch (err) {
    console.error(`Unable to send email due to: ${err.message}`);
  }
};

module.exports = { sendNotification };
