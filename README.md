# Twitter Tracker

A simple analysis tool for tweets, focused on geo-location.
We made this for the 2020-2021 Course of Software Engineering of the University of Bologna. If you wish to test this yourself, read `dev-instructions.md`.
Because of hosting costs, we cannot keep a public instance for you to play around with. Here are some screenshots, though.
![interface3](https://user-images.githubusercontent.com/37805933/107536746-665b0280-6bc2-11eb-910d-de7b96befa35.png)
![interface2](https://user-images.githubusercontent.com/37805933/107536750-678c2f80-6bc2-11eb-8a41-d620e54a53e2.png)
![interface1](https://user-images.githubusercontent.com/37805933/107536751-6824c600-6bc2-11eb-8163-7f03b2b19e9e.png)

Because of technical limitations with Twitter Developer API, requests are rate limited to 15 every 10 minutes. So remember that if you play with it too much you'll have to wait a while until twitter chooses to give you access again.

## Development Process

Due to the nature of the course, a special emphasis was put on the development process. We used various tools, documented in the `docs` folder. The Final Report contains A LOT of information, so we suggest using the "Document Structure" shortcuts to your advantage.

## Final Product

In this repository, you'll find the `client` and `server` directories. I'm sure you can guess what they were used for. The DBCreator folder contains a script we used to create a tweet database of geolocalized tweets in Italy.

## Considerations

Because of the difference in features, setup is not exactly simple. Still, follow `dev-instructions` to run your own instance. You'll need twitter developer API credentials, ngrok, yarn, node, a sendgrid account and a tiny bit of patience. Good luck have fun!

## Contributors

Mattia Guazzaloca, Enea Guidi, Lorenzo Liso, Matteo Lorenzoni, Paolo Marzolo.
