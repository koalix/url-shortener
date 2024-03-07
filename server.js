const express = require('express');
const bodyParser = require('body-parser');
const { createShortUrl, redirectShortUrl } = require('./shortener');
const serverlessHttp = require('serverless-http');

const app = express();
process.startTime = Date.now(); // Guarda o momento em que o servidor foi iniciado

app.use(bodyParser.json());

// Endpoint de Health Check
app.get('/healthcheck', (req, res) => {
  const currentTime = new Date().toISOString();
  const uptime = (Date.now() - process.startTime) / 1000; // Calcula o uptime em segundos

  res.json({
    projectName: "URL Shortener",
    currentTime: currentTime,
    uptimeSeconds: uptime
  });
});

// Endpoint para criar um link encurtado
app.post('/shorten', createShortUrl);

// Endpoint para redirecionar a partir de um link encurtado
app.get('/:code', redirectShortUrl);

// Lambda handler, caso você esteja usando o AWS Lambda
const lambdaHandler = serverlessHttp(app);

exports.handler = async (event, context) => {
  return await lambdaHandler(event, context);
};

// Inicia o servidor apenas se não estiver executando no AWS Lambda
if (!process.env.LAMBDA_TASK_ROOT) {
  const PORT = process.env.PORT || 50000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
