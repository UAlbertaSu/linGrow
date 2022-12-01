const puppeteer = require('puppeteer');
const expect = require('chai').expect;
var randomEmail = require('random-email');




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

            await page.waitForSelector('#manageUsers'); //Manage User button
            await page.click('#manageUsers');
            await new Promise(r => setTimeout(r, 500));

            const url1 = await page.evaluate(() => document.location.href); //Check if the page is redirected to the correct page
            expect(url1).is.equal('http://localhost:3000/usermanager');

            await page.waitForSelector('#create'); //Add user button
            await page.click('#create');
            await new Promise(r => setTimeout(r, 800));

            const url2 = await page.evaluate(() => document.location.href); //Check if the page is redirected to the correct page
            expect(url2).is.equal('http://localhost:3000/adminadduser');
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    });
});