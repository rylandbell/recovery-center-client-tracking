//convert dates or date-times in ISO strings like '2016-06-18T15:51:31Z' to the format 'July 4, 1776'
module.exports.datePrettify = function (dateString) {
  var monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var year = dateString.substring(0, 4);
  var monthNumber = parseInt(dateString.substring(5, 7));
  var month = monthsList[monthNumber - 1];
  var day = dateString.substring(8, 10);

  var pretty = month + ' ' + day + ', ' + year;
  return pretty;
};

//converts YYYY-MM-DD to YYYY-MM-DDT07:00:00Z
module.exports.dateUglify = function (dateString) {
  if (dateString) {
    dateString += 'T07:00:00Z';
    return dateString;
  } else {
    return null;
  }

};

//convert a 10-digit string into a phone number like '(800)123-4567'
module.exports.phonePrettify = function (phoneString) {
  if (phoneString.length !== 10) {
    return phoneString;
  }

  var pieces = [
    '(',
    phoneString.substring(0, 3),
    ') ',
    phoneString.substring(3, 6),
    '-',
    phoneString.substring(6, 10)
  ];
  var pretty = pieces.join('');
  return pretty;
};

//convert (DDD) DDD-DDDD to a 10-digit string
module.exports.phoneUglify = function (phone) {
  var digits = [
    phone.slice(1, 4),
    phone.slice(6, 9),
    phone.slice(10, 14)
  ];
  var ugly = digits.join('');
  return ugly;
};
