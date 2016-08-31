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
