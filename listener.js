const https = require("https");
const io = require("socket.io");
const fs = require("fs");
const config = require("config");

var certDir = config.get("certDir");
var dataDir = config.get("dataDir");
var serverPort = config.get("serverPort");
var token = config.get("token");

var options = {
  key: fs.readFileSync(certDir+"privkey.pem"),
  cert: fs.readFileSync(certDir+"fullchain.pem")
};

var https_server = https.createServer(options);
socket_listener = io.listen(https_server);
https_server.listen(serverPort);

console.log("Starting listener server on port " + serverPort);

socket_listener.sockets.on("connection", function(client) {
  console.log("user connected: " + client.request.connection.remoteAddress);
  client.on("beacon_speaker", (data) =>handleBeaconData(data))
});

function handleBeaconData(data)
{
  try
  {
    if (data.token == token)
      var dataFileName = data.file;
      var fileData = data.data;
	  console.log("Updating " + data.file + " : " + data.data);
      fs.writeFileSync(dataDir+"/"+dataFileName+".temp",JSON.stringify(fileData));
      fs.rename(dataDir+"/"+dataFileName+".temp",dataDir+"/"+dataFileName);
  }
  catch(e)
  {
    console.log(e.toString());
    console.log("Malformed beacon message.");
  }
}
