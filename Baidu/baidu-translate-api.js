'use strict';
const http = require('http');
const request = require('superagent');
const fs = require('fs');

const md5 = require('md5');
const async = require('async');
const _ = require('lodash');


const GOOGLE_GEOCODE_API = "https://maps.googleapis.com/maps/api/geocode/json";
const GOOGLE_KEY = require('../Google/google.key');
const BAIDU_TRANSLATE_API = "https://fanyi-api.baidu.com/api/trans/vip/translate";
const BAIDU_KEY = require('./baidu.key');

//Csv output file path
const outputCsv = `./${Date.now()}-output.csv`;

//Initial uniersities data
const uniersities = require('./university.js');

let interval = null;
let STARTINDEX = 0;
let count = 0;
let processed = 0;
let PER_SECONDS = 1000;
//Divide to BATCH_SIZE chunk
let BATCH_SIZE = 20;

translateUniversity(STARTINDEX, PER_SECONDS, BATCH_SIZE);
function translateUniversity(start, perSeconds, batchSize) {

  interval = setInterval(() => {
    let requestChunk = _.slice(uniersities, start, start + batchSize)
    _.each(requestChunk, (doc) => {
      callGoogleAPI(doc, uniersities.length)
    });

    start += batchSize;
  }, perSeconds)

}

function callGoogleAPI(data, totalNumber) {
  request
    .get(GOOGLE_GEOCODE_API)
    .query({
      address: data.name,
      language: 'en',
      key: GOOGLE_KEY
    })
    .end(function(err, res) {
      let apiRes = JSON.parse(res.text).results[0];
      //administrative_area_level_1  => state
      //country  => country

      count++;
      if (count == totalNumber) {
        clearInterval(interval)
      }

      let name = data.name.trim();
      let state = getNameByType(apiRes.address_components, 'administrative_area_level_1');
      let stateName = state.name.trim();
      let stateCode = state.code;
      let latitude = apiRes.geometry.location.lat;
      let longitude = apiRes.geometry.location.lng;
      let zhName = data.name;
      let zhStateName = state.name;
      let zhCountryName = getNameByType(apiRes.address_components, 'country').name;

      async.parallel({
        cnName: function(callback) {
          translateWord(data.name).then((data) => {
            callback(err, data.body)
          })
        },
        cnState: function(callback) {
          translateWord(state.name).then((data) => {
            callback(err, data.body)
          })
        },
        cnCountryName: function(callback) {
          translateWord(zhCountryName).then((data) => {
            callback(null, data.body)
          })
        }
      }, (err, results) => {
        zhName = results.cnName.trans_result[0].dst;
        zhStateName = results.cnState.trans_result[0].dst;
        zhStateName = addStateToTheEnd(zhStateName);
        zhCountryName = results.cnCountryName.trans_result[0].dst;

        fs.appendFile(outputCsv, `${name},${stateName},${stateCode},${latitude},${longitude},${zhName},${zhStateName},${zhCountryName}\n`, function(err) {
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
      });

    })

}

function getNameByType(addressList, type) {
  let name = '';
  let code = '';
  addressList.forEach(function(item) {
    item.types.forEach(function(addressType) {
      if (addressType == type) {
        name = item.long_name;
        code = item.short_name;
      }
    })
  });

  return {
    name,
    code
  }
}


function translateWord(word) {

  let sign = md5(BAIDU_KEY.APPID + word + BAIDU_KEY.SALT + BAIDU_KEY.KEY);
  return request
    .get(BAIDU_TRANSLATE_API)
    .query({
      q: word,
      from: 'auto',
      to: 'zh',
      appid: BAIDU_KEY.APPID,
      salt: BAIDU_KEY.SALT,
      sign: sign
    });

  //return a Promise
}


function addStateToTheEnd(stateName) {
  if (stateName[stateName.length - 1] != '州') {
    return stateName + '州';
  }
  return stateName;
}