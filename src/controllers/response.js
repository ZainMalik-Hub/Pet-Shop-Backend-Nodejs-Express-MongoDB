function Response(res, error, message, status, data) {
  let results = null;
  if (Array.isArray(data)) {
    results = { count: data.length, data };
  } else {
    results = data;
  }
  return res.status(status).json({
    error: error ? true : false,
    message: message,
    status: status,
    results: results && results,
  });
}

module.exports = Response;
