# Dev instructions

Twitter Tracker is a web application with a React.js based frontend and a Node.js backend.
For developing the app you need to:

1. Run `npm install` or `yarn install` both inside `frontend` and `backend`
2. Run `npm start` or `yarn start` both inside `frontend` and `backend` to serve the frontend locally at http://localhost:3000 and the backend at http://localhost:4000

## Login and authentication

Unfortunately, not all application features works with this setup. Specifically, login related features cannot be used because for the login to work properly the app needs to be available through a public URL.
So here's a possible way to make login (and related stuff) work:

- make an account and download [ngrok](https://ngrok.com/)
- follow instructions to activate account and create conf file
- open conf file, and under your key paste

```yml
tunnels:
  tcp_backend:
    proto: http
    addr: 4000
  tcp_frontend:
    proto: http
    addr: 3000
```

- start up ngrok with `./ngrok start -all --config ~/.ngrok2/ngrok.yml --region=eu`
- you'll see your terminal gets taken over and mapping are displayed. copy the public URL for the frontend (port 3000)
- append `/auth` to your link, so that it looks something like `http://pippo.eu.ngrok.com/auth`
- paste it in `credentials`, as the value for `auth_url`
- paste the link in the accepted callbacks inside twitter dev admin panel
- DON'T stop the ngrok process or you'll have to do it again
- use the app normally. Remember, authentication data is not persistent through reloads

## Email notification

Email are sent using sendgrid's API through nodeMailer. If you want email notifications to work, you'll need to create a sendgrid account and include relevant information in `/backend/api/twitter/.credentials.json`
