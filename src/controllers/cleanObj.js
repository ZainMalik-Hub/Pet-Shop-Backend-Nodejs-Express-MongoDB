function CleanObj(data) {
  let cleanObj = {};
  Object.keys(data).forEach((val) => {
    const newVal = data[val];
    cleanObj = newVal ? { ...cleanObj, [val]: newVal } : cleanObj;
  });
  return cleanObj;
}
module.exports = CleanObj;
