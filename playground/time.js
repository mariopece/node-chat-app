var moment = reqiuire('moment');

//var date = moment();
//https://momentjs.com/docs/#/manipulating/
//date.add(1, 'years').substract(9, 'months');
//console.log(date.format('MMM Do, YYYY ');

//10:35 am
//padded for minutes 01
//unpadded for hours 1

//same as new Date().getTime();
var someTimestamp = moment().valueOf();
console.log(someTimestamp);

var createdAt = 1234
var date = moment(createdAt);
console.log(date.format('h:mm a');
