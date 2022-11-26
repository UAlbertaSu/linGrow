const puppeteer = require('puppeteer');
const expect = require('chai').expect;
var randomEmail = require('random-email');

// function callRegisterApi() {
//     const option= {
//         method: 'POST',
//         uri: "http://127.0.0.1:8000/api/user/register/",
//         header: {
//             'Content-Type': 'application/json',
//         },
//         body: {"email": "frontend@test.com", "password":'Aa1234567!',
//         "password2": "Aa1234567!", "first_name": "frontend",
//         "last_name": "test", "user_type": 4
//         },
//         json: true
//     };
//     rp(options).then (function (parseBody) {
//         console.log(parseBody)
//     }).catch(function(error){console.log("call api error" + error)})
// }



describe ('Group Management', async () => {
    it ('Create a new group', async () => {
        let browser = await puppeteer.launch({
            headless: false
        });
        try {
            //callRegisterApi();
            let page = await browser.newPage(); 
            await page.goto('http://localhost:3000/login');
            page.evaluate(() => {
                sessionStorage.setItem('token', 'frontend_test_token');
            })  
            await page.goto('http://localhost:3000/login', {waitUntil: 'networkidle0',});

            const textbox = await page.$('#email'); //email input
            await textbox.type('frontend@test.com');
            const textbox2 = await page.$('#password'); //pswd input
            await textbox2.type('A1234567!');
            await new Promise(r => setTimeout(r, 500));
            await page.waitForSelector('#login'); //Create New Group button
            await page.click('#login');

            await page.waitForSelector('#groups'); //Create New Group button
            await page.click('#groups');

            const url1 = await page.evaluate(() => document.location.href); //Check if the page is redirected to the correct page
            expect(url1).is.equal('http://localhost:3000/groupmanager');

            await page.waitForSelector('#create'); //Create New Group button
            await page.click('#create');
            await new Promise(r => setTimeout(r, 800));

            const url2 = await page.evaluate(() => document.location.href); //Check if the page is redirected to the correct page
            expect(url2).is.equal('http://localhost:3000/groupcreator');

            const textbox3 = await page.$('#group_name'); //group name input
            await textbox3.type('testgroupxx');
            value = await (await testbox3.getProperty("value")).jsonValue();
            expect(value).to.equal('testgroupxx');

            const textbox4 = await page.$('#group_id'); //group name input
            await textbox4.type('6');
            value = await (await testbox4.getProperty("value")).jsonValue();
            expect(value).to.equal('6');
            await new Promise(r => setTimeout(r, 500));

            // await page.waitForSelector('#user_list');//first user in the user list
            // await page.click('#user_list', '0');

            // await page.waitForSelector('#submit'); //Create Group button
            // await page.click('#submit');
            // await new Promise(r => setTimeout(r, 500));

            const url3 = await page.evaluate(() => document.location.href); //Check if the page is redirected to the correct page
            expect(url3).is.equal('http://localhost:3000/groupmanager');
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    }, 20000);

});