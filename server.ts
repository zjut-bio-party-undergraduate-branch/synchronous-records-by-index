import { BaseClient } from '@base-open/node-sdk';
import express from 'express'
import { synchronous } from './src/api/synchronous';
// import dotenv from 'dotenv';

// dotenv.config({ path: './.env.development'});

const APP_TOKEN: string = process.env["APP_TOKEN"] || "";
const PERSONAL_BASE_TOKEN: string = process.env["PERSONAL_BASE_TOKEN"] || "";
const PORT: number = 4000;

const client = new BaseClient({
  appToken: APP_TOKEN,
  personalBaseToken: PERSONAL_BASE_TOKEN,
});

const app = express()

app.set('host', 'localhost')

app.get('/synchronous', async (req, res) => {
  console.log(req.query)
  const { from, to, recordId, indexName, indexValue } = req.query;
  const config = {
    from: from as string,
    to: to as string,
    recordId: recordId as string,
    indexName: indexName as string,
    indexValue: indexValue as string,
  }
  await synchronous(client, config);
  res.send('success!!!')
})

app.get('/', async (req, res) => {
  res.send('hello world')
});

app.listen(PORT, () => {
  console.log('Listening on port: ' + PORT)
})

// const sever = app.listen(PORT, () => {
//   console.log('Listening on port: ' + PORT)
// })