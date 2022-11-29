const puppeteer = require('puppeteer');
const expect = require('chai').expect;
var randomEmail = require('random-email');


describe ('Searching users functionalities', async () => {
    it ('Search user function should navigate to the corresponding page', async () => {
        let browser = await puppeteer.launch({
            headless: false
        });
        try {
            let page = await browser.newPage(); 
            await page.goto('http://localhost:3000/login');
            page.evaluate(() => {
                sessionStorage.setItem('token', 'frontend_test_token');
            })  
            await page.goto('http://localhost:3000/login', {waitUntil: 'networkidle0',});

            const textbox = await page.$('#email'); //email input
            await textbox.type('frontend@test.com');
            const textbox2 = await page.$('#password'); //pswd input
            await textbox2.type('Aa1234567!');
            await new Promise(r => setTimeout(r, 500));
            await page.waitForSelector('#login'); //login
            await page.click('#login');
            await new Promise(r => setTimeout(r, 500));

            await page.waitForSelector('#searchUsers'); //Search users button
            await page.click('#searchUsers');
            await new Promise(r => setTimeout(r, 500));

            const url1 = await page.evaluate(() => document.location.href); //Check if the page is redirected to the correct page
            expect(url1).is.equal('http://localhost:3000/searchuser');

            const textbox3 = await page.$('#searchUsername'); //Username input
            await textbox3.type('dd');

            await page.waitForSelector('#searchstart'); //start searching users button
            await page.click('#searchstart');
            await new Promise(r => setTimeout(r, 800));

            const url2 = await page.evaluate(() => document.location.href); //Check if the page is redirected to the correct page
            expect(url2).is.equal('http://localhost:3000/searchuser');
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    });
});

describe ('Adding user functionalities', async () => {
    it ('Adding user function should navigate to corrersponding page', async () => {
        let browser = await puppeteer.launch({
            headless: false
        });
        try {
            let page = await browser.newPage(); 
            await page.goto('http://localhost:3000/login');
            page.evaluate(() => {
                sessionStorage.setItem('token', 'frontend_test_token');
            })  
            await page.goto('http://localhost:3000/login', {waitUntil: 'networkidle0',});

            const textbox = await page.$('#email'); //email input
            await textbox.type('frontend@test.com');
            const textbox2 = await page.$('#password'); //pswd input
            await textbox2.type('Aa1234567!');
            await new Promise(r => setTimeout(r, 500));
            await page.waitForSelector('#login'); //login
            await page.click('#login');
            await new Promise(r => setTimeout(r, 500));

            await page.waitForSelector('#searchUsers'); //Search users button
            await page.click('#searchUsers');
            await new Promise(r => setTimeout(r, 500));

            const url1 = await page.evaluate(() => document.location.href); //Check if the page is redirected to the correct page
            expect(url1).is.equal('http://localhost:3000/searchuser');

            const textbox3 = await page.$('#searchUsername'); //Username input
            await textbox3.type('dd');

            await page.waitForSelector('#searchstart'); //start searching users button
            await page.click('#searchstart');
            await new Promise(r => setTimeout(r, 800));

            const url2 = await page.evaluate(() => document.location.href); //Check if the page is redirected to the correct page
            expect(url2).is.equal('http://localhost:3000/searchuser');
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    });
});