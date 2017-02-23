// sleep time expects milliseconds
const _ = require('lodash');
/*

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

Usage!
sleep(2000).then(() => {
    // Do something after the sleep!
    console.log('cool')
});


function foobar(el) {
    setTimeout(function () { foobar_cont(el); }, 5000);
}

foobar(1);

function foobar_cont(el) {
    console.log(el)
}
*/

function sendRequest() {
    console.log('send request!!')
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}


function Loop() {
    // for (var i = 0; i < 10; i++) {

    // setTimeout(function () {
    //     console.log('###')
    //     console.log(i)
    //     console.log('###')
    // }, 2000)

    setInterval(function () {
        sendRequest();
    }, 1000)

    // }
}

Loop()