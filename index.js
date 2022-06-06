require('dotenv').config()
const request = require('request');

let fs = require('fs');
let file = fs.readFileSync('./resourses/2.jpg');
let encodedImg = Buffer.from(file).toString('base64');

let objSend = {
  "folderId": process.env.FOLDERID,
  "analyze_specs": [{
    "content": encodedImg,
    "features": [{
      "type": "TEXT_DETECTION",
      "text_detection_config": {
        "language_codes": ["*"]
      }
    }]
  }]
}

function recognizeImg(dataImg) {
  let clientServerOptions = {
    url: 'https://vision.api.cloud.yandex.net/vision/v1/batchAnalyze',
    body: JSON.stringify(dataImg),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Api-Key ${process.env.TOKEN}`
    }
  }
  request(clientServerOptions, function (error, response) {
    let objResp = JSON.parse(response.body);

    let recognizedText = [];
    //documentation https://cloud.yandex.ru/docs/vision/api-ref/Vision/batchAnalyze
    let blocks = objResp.results[0].results[0].textDetection.pages[0].blocks;
    for (let block of blocks) {
      for (let line of block.lines) {
        for (let word of line.words) {
          if (word.hasOwnProperty('text')) {
            recognizedText.push(word.text)
          }
        }
      }
    }
    console.log(error, recognizedText.join(' '));
    return;
  });
}

recognizeImg(objSend)
