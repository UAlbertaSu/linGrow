const puppeteer = require('puppeteer');
const expect = require('chai').expect;
var randomEmail = require('random-email');

describe ('Group Management', async () => {
    it ('Create a new group', async () => {
        let browser = await puppeteer.launch({
            headless: false
        });
        try {
            let page = await browser.newPage();   
            await page.goto('http://localhost:3000/');
            page.evaluate(() => {
                //sessionStorage.setItem('userType', '4');
                sessionStorage.setItem('token', 'jeff');
            });
            await page.goto('http://localhost:3000/groupmanager ', {waitUntil: 'networkidle0',});
            
            await page.waitForSelector('#create'); //Create New Group button
            await page.click('#createnewgroup');
            await new Promise(r => setTimeout(r, 500));

            const url = await page.evaluate(() => document.location.href); //Check if the page is redirected to the correct page
            expect(url).is.equal('http://localhost:3000/groupcreator');

            // const textbox = await page.$('#group_name'); //group name input
            // await textbox.type('testgroupxx');
            // value = await (await passbox.getProperty("value")).jsonValue();
            // expect(value).to.equal('testgroupxx');

            // await page.waitForSelector('#user_list');//first user in the user list
            // await page.click('#user_list', '1');

            // await page.waitForSelector('#submit'); //Create Group button
            // await page.click('#submit');
            // await new Promise(r => setTimeout(r, 500));

            // const url2 = await page.evaluate(() => document.location.href); //Check if the page is redirected to the correct page
            // expect(url2).is.equal('http://localhost:3000/groupmanager');
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    }, 20000);

});