import {authService}  from '../../src/utils/auth-service.js';
import { Given, When, Then } from '@cucumber/cucumber';
import {scenarioContext} from "../../src/utils/scenario-context.js";
import dotenv from 'dotenv';
dotenv.config();

let username, password;


Given('I have a username {string} and password {string}', function (user, pass) {
    username = user;
    password = pass;
});
When('I submit a login request', async function (){
    let response = await authService.forceLogin(username, password);
    scenarioContext.setData('responseData', response);
});
export async function loggedIn() {
    let response = await authService.authenticate(`${process.env.TEST_USERNAME}`, `${process.env.TEST_PASSWORD}`);
    scenarioContext.setData('responseData', response);
}
Given('I logged into the inventory management with a valid user', loggedIn);

//Todo
//after tests - log out?