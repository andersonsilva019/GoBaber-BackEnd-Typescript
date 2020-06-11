import express from 'express';

const app = express();

app.get('/', (request, response) => response.json({ message: 'ola' }));

app.listen(3333, () => {
  console.log('dgdfgdgdfg');
});
