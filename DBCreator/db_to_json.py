from tinydb import TinyDB
import config
import json
import sys

try:
    db = TinyDB(config.db_path)
except:
    print("error opening{}".format(config.db_path))
    sys.exit(1)

db_path = config.db_path.split(".")[0:-1]
db_path = ".".join(str(el) for el in db_path)

try:
    with open(db_path, "w") as outfile:
        json.dump(db.all(), outfile)
except:
    print("error serializing")
    sys.exit(1)

print("OK JSON CREATED IN {}".format(db_path))