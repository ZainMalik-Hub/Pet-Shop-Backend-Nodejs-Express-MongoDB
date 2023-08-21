const Response = require("./response");

function Validate(attribute, res, message, status, data) {
  if (!attribute) {
    Response(res, true, `${message} is Required`, status, data);
  }
  return true;
}
module.exports = Validate;
