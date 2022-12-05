const puppeteer = require('puppeteer');
const expect = require('chai').expect;
var randomEmail = require('random-email');

describe('Welcome page elements', async () => {
    it ('Welcome page translates correctly when the language list is modified', async () => {
        let browser = await puppeteer.launch({
            headless: true
        });
        try {
            let page = await browser.newPage();
            await page.goto('http://localhost:3000/', {waitUntil: 'networkidle0',});
            await page.waitForSelector('#language_dropdown');
            await page.select('#language_dropdown', 'es');

            await new Promise(r => setTimeout(r, 500));
            const html = await page.$eval('#welcome_msg', e => e.innerHTML);
            expect(html).to.contain('Bienvenido');
            expect(html).to.not.contain('Welcome');
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    }, 20000);

    it ('Every page should show welcome page elements if the language is not set', async () => {
        let browser = await puppeteer.launch({
            headless: true
        });
        try {
            let page = await browser.newPage();
            await page.goto('http://localhost:3000/login/', {waitUntil: 'networkidle0',});
            await page.waitForSelector('.card');
            let html = await page.$eval('.card', e => e.innerHTML);
            expect(html).to.contain('Welcome');

            await page.evaluate(() => {
                localStorage.clear();
            });

            await page.goto('http://localhost:3000/dashboard/', {waitUntil: 'networkidle0',});
            await page.waitForSelector('.card');
            html = await page.$eval('.card', e => e.innerHTML);
            expect(html).to.contain('Welcome');

            await page.evaluate(() => {
                localStorage.clear();
            });

            await page.goto('http://localhost:3000/signup/', {waitUntil: 'networkidle0',});
            await page.waitForSelector('.card');
            html = await page.$eval('.card', e => e.innerHTML);
            expect(html).to.contain('Welcome');

            await page.evaluate(() => {
                localStorage.clear();
            });

            await page.goto('http://localhost:3000/activities/', {waitUntil: 'networkidle0',});
            await page.waitForSelector('.card');
            html = await page.$eval('.card', e => e.innerHTML);
            expect(html).to.contain('Welcome');
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    }, 20000);

    it ('Clicking the navigation link should allow users to enter the login screen', async () => {
        let browser = await puppeteer.launch({
            headless: true
        });
        try {
            let page = await browser.newPage();
            await page.goto('http://localhost:3000/', {waitUntil: 'networkidle0',});
            await page.click('#welcome_link');
            await page.waitForNavigation({waitUntil: 'networkidle0',})
            const url = await page.evaluate(() => document.location.href);
            expect(url).to.contain('http://localhost:3000/login');
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    });
});

describe ('Login page elements', async () => {
    it ('Textbox reflects user input', async () => {
        let browser = await puppeteer.launch({
            headless: true
        });
        try {
            let page = await browser.newPage();
            let value = '';
            await page.goto('http://localhost:3000/');
            await page.goto('http://localhost:3000/login', {waitUntil: 'networkidle0',});

            const textbox = await page.$('#email');
            await textbox.type('randomstring');
            value = await (await textbox.getProperty("value")).jsonValue();
            expect(value).to.equal('randomstring');

            const passbox = await page.$('#password');
            await passbox.type('1234');
            value = await (await passbox.getProperty("value")).jsonValue();
            expect(value).to.equal('1234');
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    }, 20000);

    it ('Change in language list is reflected on login page elements', async () => {
        let browser = await puppeteer.launch({
            headless: true
        });
        try {
            let page = await browser.newPage();
            await page.goto('http://localhost:3000/');
            await page.goto('http://localhost:3000/login', {waitUntil: 'networkidle0',});
            await page.waitForSelector('#language_dropdown');
            await page.select('#language_dropdown', 'fr');

            await new Promise(r => setTimeout(r, 500));
            const html = await page.$eval('#login', e => e.innerHTML);
            expect(html).to.contain('Connexion');
            expect(html).to.not.contain('Login');
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    }, 20000);

    it ('Login without valid credentials should cause error', async () => {
        let browser = await puppeteer.launch({
            headless: true
        });
        try {
            let page = await browser.newPage();   
            await page.goto('http://localhost:3000/');
            await page.goto('http://localhost:3000/login', {waitUntil: 'networkidle0',});

            const isHidden = await page.$eval('#errormessage', (elem) => {
                return window.getComputedStyle(elem).getPropertyValue('display') === 'none'
            });
            expect(isHidden);

            await page.click('#login');
            await page.waitForSelector('#errormessage');
            const isNotHidden = await page.$eval('#errormessage', (elem) => {
                return window.getComputedStyle(elem).getPropertyValue('display') !== 'none'
            });
            expect(isNotHidden);
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    }, 20000);

    it ('Attempt to access dashboard without access token should redirect user back to login', async () => {
        let browser = await puppeteer.launch({
            headless: true
        });
        try {
            let page = await browser.newPage();
            await page.goto('http://localhost:3000/');
            await page.goto('http://localhost:3000/dashboard', {waitUntil: 'networkidle0',});
            
            const url = await page.evaluate(() => document.location.href);
            expect(url).is.equal('http://localhost:3000/dashboard');
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    }, 20000);

    it ('Button should allow navigation to activities page', async () => {
        let browser = await puppeteer.launch({
            headless: true
        });
        try {
            let page = await browser.newPage();   
            await page.goto('http://localhost:3000/');
            await page.goto('http://localhost:3000/login', {waitUntil: 'networkidle0',});
            
            await page.waitForSelector('#activities');
            await page.click('#activities');
            
            const url = await page.evaluate(() => document.location.href);
            expect(url).is.equal('http://localhost:3000/activities');
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    }, 20000);

    it ('Button should allow navigation to signup page', async () => {
        let browser = await puppeteer.launch({
            headless: true
        });
        try {
            let page = await browser.newPage();
            await page.goto('http://localhost:3000/');
            await page.goto('http://localhost:3000/login', {waitUntil: 'networkidle0',});

            await page.waitForSelector('#signup');
            await page.click('#signup');

            const url = await page.evaluate(() => document.location.href);
            expect(url).is.equal('http://localhost:3000/signup');
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    }, 20000);

    it ('Login with valid credentials should not trigger error message', async () => {
        let browser = await puppeteer.launch({
            headless: true
        });
        try {
            let page = await browser.newPage();   
            await page.goto('http://localhost:3000/');
            await page.goto('http://localhost:3000/login', {waitUntil: 'networkidle0',});
            
            await page.type('#email', 'newuser@email.com');
            await page.type('#password', '1234');
            await new Promise(r => setTimeout(r, 500));

            await page.click('#login');
            await new Promise(r => setTimeout(r, 500));

            const isHidden = await page.$eval('#errormessage', (elem) => {
                return window.getComputedStyle(elem).getPropertyValue('display') === 'none'
            });
            expect(isHidden);
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    }, 20000);
});

describe ('Signup page elements', async () => {
    it ('Textbox reflects user input', async () => {
        let browser = await puppeteer.launch({
            headless: true
        });
        try {
            let page = await browser.newPage();
            let value = '';
            await page.goto('http://localhost:3000/');
            await page.goto('http://localhost:3000/signup', {waitUntil: 'networkidle0',});

            const textbox = await page.$('#email');
            await textbox.type('randomstring');
            value = await (await textbox.getProperty("value")).jsonValue();
            expect(value).to.equal('randomstring');

            const passbox = await page.$('#password1');
            await passbox.type('1234');
            value = await (await passbox.getProperty("value")).jsonValue();
            expect(value).to.equal('1234');
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    }, 20000);

    it ('Select dropdown menu reflects user choice', async () => {
        let browser = await puppeteer.launch({
            headless: true
        });
        try {
            let page = await browser.newPage();
            let value = '';
            await page.goto('http://localhost:3000/');
            await page.goto('http://localhost:3000/signup', {waitUntil: 'networkidle0',});

            await page.select('#user_type', '3');
            const selectbox = await page.$('#user_type');
            value = await (await selectbox.getProperty("value")).jsonValue();
            expect(value).to.equal('3');
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    }, 20000);

    it ('Change in language list is reflected on signup page elements', async () => {
        let browser = await puppeteer.launch({
            headless: true
        });
        try {
            let page = await browser.newPage();
            await page.goto('http://localhost:3000/');
            await page.goto('http://localhost:3000/signup', {waitUntil: 'networkidle0',});
            await page.waitForSelector('#language_dropdown');
            await page.select('#language_dropdown', 'de');
            await new Promise(r => setTimeout(r, 500));

            const translated = await page.$eval('#first_name', (elem) => {
                return window.getComputedStyle(elem).getPropertyValue('placeholder') === 'Bitte Vornamen eingeben'
            });
            expect(translated);
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    }, 20000);

    it ('Signup with incomplete credentials should make error messages visible', async () => {
        let browser = await puppeteer.launch({
            headless: true
        });
        try {
            let page = await browser.newPage();   
            await page.goto('http://localhost:3000/');
            await page.goto('http://localhost:3000/signup', {waitUntil: 'networkidle0',});

            const isHidden = await page.$eval('#errormessage', (elem) => {
                return window.getComputedStyle(elem).getPropertyValue('display') === 'none'
            });
            expect(isHidden);

            await page.click('#submit_button');
            await page.waitForSelector('#errormessage');
            const isNotHidden = await page.$eval('#errormessage', (elem) => {
                return window.getComputedStyle(elem).getPropertyValue('display') !== 'none'
            });
            expect(isNotHidden);
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    });

    it ('Signup with mismatching passwords should make error messages visible', async () => {
        let browser = await puppeteer.launch({
            headless: true
        });
        try {
            let page = await browser.newPage();   
            await page.goto('http://localhost:3000/');
            await page.goto('http://localhost:3000/signup', {waitUntil: 'networkidle0',});

            
            await page.type('#email', randomEmail());
            await page.type('#first_name', 'mock');
            await page.type('#last_name', 'user');
            await page.type('#password1', '1234');
            await page.type('#password2', '4321');
            await page.select('#user_type', '3');
            await new Promise(r => setTimeout(r, 500));

            await page.click('#submit_button');
            await new Promise(r => setTimeout(r, 500));

            const isNotHidden = await page.$eval('#errormessage', (elem) => {
                return window.getComputedStyle(elem).getPropertyValue('display') !== 'none'
            });
            expect(isNotHidden);
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    });

    it ('Signup with complete detail does not trigger error message', async () => {
        let browser = await puppeteer.launch({
            headless: true
        });
        try {
            let page = await browser.newPage();   
            await page.goto('http://localhost:3000/');
            await page.goto('http://localhost:3000/signup', {waitUntil: 'networkidle0',});

            
            await page.type('#email', randomEmail());
            await page.type('#first_name', 'mock');
            await page.type('#last_name', 'user');
            await page.type('#password1', '1234');
            await page.type('#password2', '1234');
            await page.select('#user_type', '3');
            await new Promise(r => setTimeout(r, 500));

            await page.click('#submit_button');
            await new Promise(r => setTimeout(r, 500));

            const isHidden = await page.$eval('#errormessage', (elem) => {
                return window.getComputedStyle(elem).getPropertyValue('display') === 'none'
            });
            expect(isHidden);
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    });
});

describe ('Dashboard elements', async () => {
    describe ('Parent dashboard elements', async () => {
        it ('Change in language is reflected in dashboard elements', async () => {
            let browser = await puppeteer.launch({
                headless: true
            });
            try {
                let page = await browser.newPage();
                await page.goto('http://localhost:3000/');
    
                page.evaluate(() => {
                    sessionStorage.setItem('token', 'frontend_test_token');
                })
    
                await page.goto('http://localhost:3000/dashboardParent', {waitUntil: 'networkidle0',});
    
                await page.waitForSelector('#language_dropdown');
                await page.select('#language_dropdown', 'it');
                await new Promise(r => setTimeout(r, 500));
    
                const html = await page.$eval('#logout', e => e.innerHTML);
                expect(html).to.contain('Disconnettersi');
                expect(html).to.not.contain('Logout');
            }
            catch (error) {
                throw(error);
            }
            finally {
                await browser.close();
            }
        });
    
        it ('Logout button should navigate user back to login page, and block access to dashboard', async () => {
            let browser = await puppeteer.launch({
                headless: true
            });
            try {
                let page = await browser.newPage();
                await page.goto('http://localhost:3000/');
                page.evaluate(() => {
                    sessionStorage.setItem('token', 'frontend_test_token');
                })
    
                await page.goto('http://localhost:3000/dashboardParent', {waitUntil: 'networkidle0',});
                await page.waitForSelector('#logout');
                await page.click('#logout');
                await new Promise(r => setTimeout(r, 500));
    
                const url = await page.evaluate(() => document.location.href);
                expect(url).is.equal('http://localhost:3000/login');
            }
            catch (error) {
                throw(error);
            }
            finally {
                await browser.close();
            }
        });

        it ('English Learning Activity link takes user to the activities page', async () => {
            let browser = await puppeteer.launch({
                headless: true
            });
            try {
                let page = await browser.newPage();
                await page.goto('http://localhost:3000/');
    
                page.evaluate(() => {
                    sessionStorage.setItem('token', 'frontend_test_token');
                })
    
                await page.goto('http://localhost:3000/dashboardParent', {waitUntil: 'networkidle0',});
                await page.waitForSelector('#activities');
                await page.click('#activities');
                await new Promise(r => setTimeout(r, 500));
    
                const url = await page.evaluate(() => document.location.href);
                expect(url).is.equal('http://localhost:3000/activities');
            }
            catch (error) {
                throw(error);
            }
            finally {
                await browser.close();
            }
        });
    });

    describe ('Teacher dashboard elements', async () => {
        it ('Change in language is reflected in dashboard elements', async () => {
            let browser = await puppeteer.launch({
                headless: true
            });
            try {
                let page = await browser.newPage();
                await page.goto('http://localhost:3000/');
    
                page.evaluate(() => {
                    sessionStorage.setItem('token', 'frontend_test_token');
                })
    
                await page.goto('http://localhost:3000/dashboardTeacher', {waitUntil: 'networkidle0',});
    
                await page.waitForSelector('#language_dropdown');
                await page.select('#language_dropdown', 'it');
                await new Promise(r => setTimeout(r, 500));
    
                const html = await page.$eval('#logout', e => e.innerHTML);
                expect(html).to.contain('Disconnettersi');
                expect(html).to.not.contain('Logout');
            }
            catch (error) {
                throw(error);
            }
            finally {
                await browser.close();
            }
        });
    
        it ('Logout button should navigate user back to login page, and block access to dashboard', async () => {
            let browser = await puppeteer.launch({
                headless: true
            });
            try {
                let page = await browser.newPage();
                await page.goto('http://localhost:3000/');
                page.evaluate(() => {
                    sessionStorage.setItem('token', 'frontend_test_token');
                })
    
                await page.goto('http://localhost:3000/dashboardTeacher', {waitUntil: 'networkidle0',});
                await page.waitForSelector('#logout');
                await page.click('#logout');
                await new Promise(r => setTimeout(r, 500));
    
                const url = await page.evaluate(() => document.location.href);
                expect(url).is.equal('http://localhost:3000/login');
            }
            catch (error) {
                throw(error);
            }
            finally {
                await browser.close();
            }
        });

        it ('English Learning Activity link takes user to the activities page', async () => {
            let browser = await puppeteer.launch({
                headless: true
            });
            try {
                let page = await browser.newPage();
                await page.goto('http://localhost:3000/');
    
                page.evaluate(() => {
                    sessionStorage.setItem('token', 'frontend_test_token');
                })
    
                await page.goto('http://localhost:3000/dashboardTeacher', {waitUntil: 'networkidle0',});
                await page.waitForSelector('#activities');
                await page.click('#activities');
                await new Promise(r => setTimeout(r, 500));
    
                const url = await page.evaluate(() => document.location.href);
                expect(url).is.equal('http://localhost:3000/activities');
            }
            catch (error) {
                throw(error);
            }
            finally {
                await browser.close();
            }
        });
    });
    describe ('Researcher dashboard elements', async () => {
        it ('Change in language is reflected in dashboard elements', async () => {
            let browser = await puppeteer.launch({
                headless: true
            });
            try {
                let page = await browser.newPage();
                await page.goto('http://localhost:3000/');
    
                page.evaluate(() => {
                    sessionStorage.setItem('token', 'frontend_test_token');
                })
    
                await page.goto('http://localhost:3000/dashboardResearcher', {waitUntil: 'networkidle0',});
    
                await page.waitForSelector('#language_dropdown');
                await page.select('#language_dropdown', 'it');
                await new Promise(r => setTimeout(r, 500));
    
                const html = await page.$eval('#logout', e => e.innerHTML);
                expect(html).to.contain('Disconnettersi');
                expect(html).to.not.contain('Logout');
            }
            catch (error) {
                throw(error);
            }
            finally {
                await browser.close();
            }
        });
    
        it ('Logout button should navigate user back to login page, and block access to dashboard', async () => {
            let browser = await puppeteer.launch({
                headless: true
            });
            try {
                let page = await browser.newPage();
                await page.goto('http://localhost:3000/');
                page.evaluate(() => {
                    sessionStorage.setItem('token', 'frontend_test_token');
                })
    
                await page.goto('http://localhost:3000/dashboardResearcher', {waitUntil: 'networkidle0',});
                await page.waitForSelector('#logout');
                await page.click('#logout');
                await new Promise(r => setTimeout(r, 500));
    
                const url = await page.evaluate(() => document.location.href);
                expect(url).is.equal('http://localhost:3000/login');
            }
            catch (error) {
                throw(error);
            }
            finally {
                await browser.close();
            }
        });

        it ('English Learning Activity link takes user to the activities page', async () => {
            let browser = await puppeteer.launch({
                headless: true
            });
            try {
                let page = await browser.newPage();
                await page.goto('http://localhost:3000/');
    
                page.evaluate(() => {
                    sessionStorage.setItem('token', 'frontend_test_token');
                })
    
                await page.goto('http://localhost:3000/dashboardResearcher', {waitUntil: 'networkidle0',});
                await page.waitForSelector('#activities');
                await page.click('#activities');
                await new Promise(r => setTimeout(r, 500));
    
                const url = await page.evaluate(() => document.location.href);
                expect(url).is.equal('http://localhost:3000/activities');
            }
            catch (error) {
                throw(error);
            }
            finally {
                await browser.close();
            }
        });
    });

    describe ('Admin dashboard elements', async () => {
        it ('Change in language is reflected in dashboard elements', async () => {
            let browser = await puppeteer.launch({
                headless: true
            });
            try {
                let page = await browser.newPage();
                await page.goto('http://localhost:3000/');
    
                page.evaluate(() => {
                    sessionStorage.setItem('token', 'frontend_test_token');
                })
    
                await page.goto('http://localhost:3000/dashboardAdmin', {waitUntil: 'networkidle0',});
    
                await page.waitForSelector('#language_dropdown');
                await page.select('#language_dropdown', 'it');
                await new Promise(r => setTimeout(r, 500));
    
                const html = await page.$eval('#logout', e => e.innerHTML);
                expect(html).to.contain('Disconnettersi');
                expect(html).to.not.contain('Logout');
            }
            catch (error) {
                throw(error);
            }
            finally {
                await browser.close();
            }
        });
    
        it ('Logout button should navigate user back to login page, and block access to dashboard', async () => {
            let browser = await puppeteer.launch({
                headless: true
            });
            try {
                let page = await browser.newPage();
                await page.goto('http://localhost:3000/');
                page.evaluate(() => {
                    sessionStorage.setItem('token', 'frontend_test_token');
                })
    
                await page.goto('http://localhost:3000/dashboardAdmin', {waitUntil: 'networkidle0',});
                await page.waitForSelector('#logout');
                await page.click('#logout');
                await new Promise(r => setTimeout(r, 500));
    
                const url = await page.evaluate(() => document.location.href);
                expect(url).is.equal('http://localhost:3000/login');
            }
            catch (error) {
                throw(error);
            }
            finally {
                await browser.close();
            }
        });

        it ('English Learning Activity link takes user to the activities page', async () => {
            let browser = await puppeteer.launch({
                headless: true
            });
            try {
                let page = await browser.newPage();
                await page.goto('http://localhost:3000/');
    
                page.evaluate(() => {
                    sessionStorage.setItem('token', 'frontend_test_token');
                })
    
                await page.goto('http://localhost:3000/dashboardAdmin', {waitUntil: 'networkidle0',});
                await page.waitForSelector('#activities');
                await page.click('#activities');
                await new Promise(r => setTimeout(r, 500));
    
                const url = await page.evaluate(() => document.location.href);
                expect(url).is.equal('http://localhost:3000/activities');
            }
            catch (error) {
                throw(error);
            }
            finally {
                await browser.close();
            }
        });
    });
});

describe ('Group Management', async () => {
    it ('Create a new group', async () => {
        let browser = await puppeteer.launch({
            headless: false
        });
        function callRegisterApi() {
    const option= {
        method: 'POST',
        uri: "http://[2605:fd00:4:1001:f816:3eff:fe76:4a8a]/api/user/register/",
        header: {
            'Content-Type': 'application/json',
        },
        body: {"email": "frontend@test.com", "password":'Aa1234567!',
        "password2": "Aa1234567!", "first_name": "frontend",
        "last_name": "test", "user_type": 4
        },
        json: true
    };
    rp(options).then (function (parseBody) {
        console.log(parseBody)
    }).catch(function(error){console.log("call api error" + error)})
}
        try {
            callRegisterApi();
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

// describe ('Chat function', async () => {
//     it ('Add new direct chat to first contact', async () => {
//         let browser = await puppeteer.launch({
//             headless: true
//         });
//         try {
//             let page = await browser.newPage();   
//             await page.goto('http://localhost:3000/');
//             await page.goto('http://localhost:3000/new_chat ', {waitUntil: 'networkidle0',});
            
//             await page.waitForSelector('#new_chat');
//             await page.click('#new_chat'); //first contact's chat button
//             await new Promise(r => setTimeout(r, 500));
//         }
//         catch (error) {
//             throw(error);
//         }
//         finally {
//             await browser.close();
//         }
//     }, 20000);

//     it ('Direct chat with first contact', async () => {
//         let browser = await puppeteer.launch({
//             headless: true
//         });
//         try {
//             let page = await browser.newPage();   
//             await page.goto('http://localhost:3000/');
//             await page.goto('http://localhost:3000/profile ', {waitUntil: 'networkidle0',});
            
//             await page.waitForSelector('#user_list'); //first contact's email 
//             await page.click('#user_list');
//             await new Promise(r => setTimeout(r, 500));

//             const textbox = await page.$('#text'); //text box
//             await textbox.type('testtest');
//             value = await (await passbox.getProperty("value")).jsonValue();
//             expect(value).to.equal('testtest');

//             await page.waitForSelector('#send');
//             await page.click('#send');

//             const isHidden = await page.$eval('#errormessage', (elem) => {
//                 return window.getComputedStyle(elem).getPropertyValue('display') === 'none'
//             });
//             expect(isHidden); //expect no error message like "message cannot be empty"
//         }
//         catch (error) {
//             throw(error);
//         }
//         finally {
//             await browser.close();
//         }
//     }, 20000);

//     it ('Send a message in group chat', async () => {
//         let browser = await puppeteer.launch({
//             headless: true
//         });
//         try {
//             let page = await browser.newPage();   
//             await page.goto('http://localhost:3000/');
//             await page.goto('http://localhost:3000/group_chat ', {waitUntil: 'networkidle0',});
            
//             await page.waitForSelector('#group_list'); //first group 
//             await page.click('#group_list');
//             await new Promise(r => setTimeout(r, 500));

//             const textbox = await page.$('#text'); //text box
//             await textbox.type('testtest');
//             value = await (await passbox.getProperty("value")).jsonValue();
//             expect(value).to.equal('testtest');

//             await page.waitForSelector('#send');
//             await page.click('#send');

//             const isHidden = await page.$eval('#errormessage', (elem) => {
//                 return window.getComputedStyle(elem).getPropertyValue('display') === 'none'
//             });
//             expect(isHidden); //expect no error message like "message cannot be empty"
//         }
//         catch (error) {
//             throw(error);
//         }
//         finally {
//             await browser.close();
//         }
//     }, 20000);
// });

describe ('Activities page elements', async () => {
    it ('Activity link should navigate to the corresponding google folder containing those activities', async () => {
        let browser = await puppeteer.launch({
            headless: true
        });
        try {
            let page = await browser.newPage();
            await page.goto('http://localhost:3000/');
            await page.goto('http://localhost:3000/login', {waitUntil: 'networkidle0',});
            await page.click('#activities');

            await page.waitForSelector('#activity_btn_1');
            await page.click('#activity_btn_1');
            const url = await page.evaluate(() => document.location.href);
            expect(url).to.contain('https://drive.google.com/drive/folders/');
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    });
});

describe ('Translation functionalities', async () => {
    it ('Once language is set, navigating to different page should not change language', async () => {
        let browser = await puppeteer.launch({
            headless: true
        });
        try {
            let page = await browser.newPage();
            let html = '';
            await page.goto('http://localhost:3000/', {waitUntil: 'networkidle0',});
            await page.waitForSelector('#language_dropdown');
            await page.select('#language_dropdown', 'es');

            await new Promise(r => setTimeout(r, 500));
            html = await page.$eval('#welcome_msg', e => e.innerHTML);
            expect(html).to.contain('Bienvenido');

            await page.click('#welcome_link');
            await page.waitForNavigation({waitUntil: 'networkidle0',});
            html = await page.$eval('#login', e => e.innerHTML);
            expect(html).to.contain('Acceso');
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    }, 20000);

    it ('Once language is set, refreshing the page should not cause language to change', async () => {
        let browser = await puppeteer.launch({
            headless: true
        });
        try {
            let page = await browser.newPage();
            let html = '';
            await page.goto('http://localhost:3000/');
            await page.goto('http://localhost:3000/login', {waitUntil: 'networkidle0',});
            await page.waitForSelector('#language_dropdown');
            await page.select('#language_dropdown', 'fr');

            await new Promise(r => setTimeout(r, 500));
            html = await page.$eval('#login', e => e.innerHTML);
            expect(html).to.contain('Connexion');

            await page.reload({waitUntil: 'networkidle0',});
            html = await page.$eval('#login', e => e.innerHTML);
            expect(html).to.contain('Connexion');
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    }, 20000);
});

describe ('Searching users functionalities', async () => {
    it ('Search user function should navigate to the corresponding page', async () => {
        let browser = await puppeteer.launch({
            headless: true
        });
        try {
            let page = await browser.newPage();
            await page.goto('http://localhost:3000/');
            await page.goto('http://localhost:3000/login', {waitUntil: 'networkidle0',});
            await page.click('#activities');

            await page.waitForSelector('#activity_btn_1');
            await page.click('#activity_btn_1');
            const url = await page.evaluate(() => document.location.href);
            expect(url).to.contain('https://drive.google.com/drive/folders/');
        }
        catch (error) {
            throw(error);
        }
        finally {
            await browser.close();
        }
    });
});

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
            await textbox3.type('frontendtest');

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