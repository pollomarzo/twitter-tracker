import tweepy
import config #configuration file
from tinydb import TinyDB, Query
import sys
import os

db_path = config.db_path
# if (os.path.isfile(db_path)):
#     print("db already exists")
#     sys.exit(1)

try:
    db = TinyDB(db_path)
except:
    print("can't open {}".format(db_path))
    sys.exit(1)

class MyStreamListener(tweepy.StreamListener):
    def on_status(self, status):
        if("place" in status._json.keys()):
            try:
                if(status._json["place"]["country_code"] == "IT"):
                    print(status._json["text"])
                    db.insert(status._json)
            except Exception as e:
                print(e)
    
    def on_error(self, status_code):
        print(status_code)
        print("try to reconnect")
        return True


print(config.consumer_key, config.consumer_secret, config.access_token, config.access_token_secret)

auth = tweepy.OAuthHandler(config.consumer_key, config.consumer_secret)
auth.set_access_token(config.access_token, config.access_token_secret)

api = tweepy.API(auth)

if(not api):
    print("Authentication failed")
    sys.exit(1)

MyStream = MyStreamListener()

MyStream = tweepy.Stream(auth=api.auth, listener=MyStream)
MyStream.filter(locations=config.coordinates)

