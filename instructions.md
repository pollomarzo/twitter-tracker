### yo

Here's how you use this:

- make an account and download (ngrok)[https://ngrok.com/]
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
- paste it in `twitter-tracker/backend/api/twitter/index.js`, after `getRequestToken(`
- paste it also in MY CHAT, asking nicely if i can include your dumbass link in the accepted callbacks from twitter
- DON'T stop the ngrok process or you'll have to do it again
- use the app normally. Please, keep your console open and let us know if shit's not working
