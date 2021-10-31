let express = require('express');
let googlehome = require('./google-home-notifier');
let app = express();
let os = require('os');
const serverPort = 8091;

const deviceName = 'Google-Home-Mini';
// const googleHomeIp = '192.168.1.12';
const language = 'ja';
// const language = 'en';
const endpointPath = '/google-home-notifier';

app.use(express.json())
/**
 * POST API
 */
app.post(endpointPath, function (req, res) {

  console.log(req.body);
  if (!req.body) return res.sendStatus(400)
  if (!req.body.text) return res.sendStatus(400)

  if (req.body.language) {
    language = req.body.language;
  }

  // googlehome.ip(googleHomeIp, language);
  googlehome.device(deviceName, language);

  let text = req.body.text;
  if (text) {
    try {
      if (text.startsWith('http')) {
        googlehome.play(text, function (notifyRes) {
          console.log(notifyRes);
          res.json({ 'message': deviceName + ' will play sound from url: ' + text });
        });
      } else {
        googlehome.notify(text, function (notifyRes) {
          console.log(notifyRes);
          res.json({ 'message': deviceName + ' will say: ' + text });
        });
      }
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
      res.send(err);
    }
  } else {
    res.json({ 'message': 'Please GET "text=Hello Google Home"' });
  }
})

/**
 * GET API
 */
app.get(endpointPath, function (req, res) {

  console.log(req.query);
  var text = req.query.text;
  if (req.query.language) {
    language;
  }
  // googlehome.ip(googleHomeIp, language);
  googlehome.device(deviceName, language);

  if (text) {
    try {
      if (text.startsWith('http')) {
        var mp3_url = text;
        googlehome.play(mp3_url, function (notifyRes) {
          console.log(notifyRes);
          res.send(deviceName + ' will play sound from url: ' + mp3_url + '\n');
        });
      } else {
        googlehome.notify(text, function (notifyRes) {
          console.log(notifyRes);
          res.send(deviceName + ' will say: ' + text + '\n');
        });
      }
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
      res.send(err);
    }
  } else {
    res.send('Please GET "text=Hello+Google+Home"');
  }
})

app.listen(serverPort, function () {
  const url = 'http://' + getLocalIP() + ':' + serverPort;
  console.log('Endpoints:');
  console.log('    ' + url + endpointPath);
  console.log('GET example:');
  console.log('curl -X GET ' + url + endpointPath + '?text=Hello+Google+Home');
  console.log('POST example:');
  console.log('curl -X POST -H "Content-Type:application/json" -d \'{"text":"Google Home"}\'' + url + endpointPath);
})

function getLocalIP() {
  var ifaces = os.networkInterfaces();
  let localIp
  Object.keys(ifaces).forEach(function (ifname) {
    ifaces[ifname].forEach(function (iface) {
      if (iface.family == 'IPv4' &&
        iface.internal == false &&
        iface.address.startsWith('192')) {
        console.log(ifname, iface.address);
        localIp = iface.address;
      }
    });
  });
  return localIp;
}