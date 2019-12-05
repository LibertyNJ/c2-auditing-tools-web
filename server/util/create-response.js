module.exports = function createResponse(type, status, body) {
  return {
    body,
    head: {
      status,
      type,
    },
  };
};
