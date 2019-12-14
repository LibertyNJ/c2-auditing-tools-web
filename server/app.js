const express = require('express');

const { port } = require('./config');
const load = require('./loaders');

startServer();

async function startServer() {
  const app = express();
  await load(app);
  app.listen(port, handleListen);
}

function handleListen(error) {
  if (error) {
    handleError(error);
  } else {
    handleSuccess();
  }
}

function handleError(error) {
  console.error(`Server encountered an error: ${error.stack}`);
}

function handleSuccess() {
  console.log(`Server listening on port: ${port}.`);
}
