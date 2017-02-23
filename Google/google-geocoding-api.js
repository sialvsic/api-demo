'use strict';

const http = require('http');
const request = require('superagent');
const fs = require('fs');
const _ = require('lodash');

const JSON_SOURCES_URL = "https://raw.githubusercontent.com/sialvsic/Api-demo/master/Google/country.json"
const GOOGLE_GEOCODE_API = "https://maps.googleapis.com/maps/api/geocode/json"
const GOOGLE_KEY = require('./google.key')


//Csv output file path
const outputCsv = `./${Date.now()}-output.csv`;

let interval = null;
let STARTINDEX = 0;
let count = 0;
let processed = 0;
let PER_SECONDS = 1000;
let BATCH_SIZE = 50;

// Run node google-geocoding-api.js
translateRows(STARTINDEX, PER_SECONDS, BATCH_SIZE);

function translateRows(start, perSeconds, batchSize) {
  request
    .get(JSON_SOURCES_URL)
    .end((err, res) => {
      let response = JSON.parse(res.text).response;
      interval = setInterval(() => {

        let requestChunk = _.slice(response.docs, start, start + batchSize)
        _.each(requestChunk, (doc) => {
          callGoogleAPI(doc, response.numFound)
        });

        start += batchSize;
      }, perSeconds)

    })
}

function callGoogleAPI(data, totalNumber) {
  request
    .get(GOOGLE_GEOCODE_API)
    .query({
      address: data.name,
      language: 'zh-CN',
      key: GOOGLE_KEY
    })
    .end((err, res) => {
      if (err) {
        console.log(err)
      }

      count++;
      if (count == totalNumber) {
        clearInterval(interval)
      }

      let text = data.name;
      if (res.body.status == 'OK') {
        text = res.body.results[0].address_components[0].long_name
      }

      fs.appendFile(outputCsv, `${data.id},${data.name},${text}\n`, function(err) {
        if (err) {
          console.log(err);
          return;
        } else {
          processed++;
          process.stdout.write(`Processed ${processed}/${totalNumber} records\r`);
          if (processed == totalNumber) {
            console.log('\nNo more documents to parse in response!')
          }
        }

      })
    })

}