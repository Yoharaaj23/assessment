import { authService } from '../../src/utils/auth-service.js';
import { Given, When } from '@cucumber/cucumber';
import { scenarioContext } from '../../src/utils/scenario-context.js';
import dotenv from 'dotenv';

dotenv.config();

let username, password;


Given('I have a username {string} and password {string}', function(user, pass) {
  username = user;
  password = pass;
});

Given('I have a valid username and password', function() {
  username = process.env.TEST_USERNAME;
  password = process.env.TEST_PASSWORD;
});

When('I submit a login request', async function() {
  const response = await authService.forceLogin(username, password);
  scenarioContext.setData('response', response);
});

export async function loggedIn() {
  const response = await authService.authenticate(`${process.env.TEST_USERNAME}`, `${process.env.TEST_PASSWORD}`);
  scenarioContext.setData('response', response);
}

Given('I logged into the inventory management with a valid user', loggedIn);
