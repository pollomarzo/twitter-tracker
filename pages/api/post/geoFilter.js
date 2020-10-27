const path = require("path");
const { v4: uuidv4 } = require("uuid");

const dirPath = path.join(process.cwd(), "/twitterAPI");
const uuid_child_table = {};

export default function handler(req, res) {
  if (req.method == "POST") {
    var cp = require("child_process");
    var child = cp.fork(dirPath + "/geoStream.js", {
      stdio: "inherit",
    });

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");

    var coordinates = "";
    var data = req.body;
    coordinates = coordinates.concat(
      data.longitudeStart +
        "," +
        data.latitudeStart +
        "," +
        data.longitudeEnd +
        "," +
        data.latitudeEnd
    );

    console.log(child.pid);

    // child.on("message", (m) => {
    //   if (m === "OK") {
    //     child.send(coordinates);

    //     var uuid = uuidv4();
    //     uuid_child_table["1"] = child;
    //   } else if (m === "streamError") {
    //     res.send("error in creating the stream");
    //   } else if (m === "streamStart") {
    //     res.send("1");
    //   }
    // });

    child.send(coordinates);
    var uuid = uuidv4();
    uuid_child_table[uuid] = child;
    res.send(uuid);
  } else if (req.method == "DELETE") {
    var uuid = req.query.id;
    var child = uuid_child_table[uuid];
    if (child) {
      child.kill("SIGINT");
      child.on("message", (m) => {
        res.send(m);
      });
    } else {
      console.log("child not found");
      res.end();
    }
  }
}
