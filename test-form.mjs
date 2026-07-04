import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1280, height: 800 });

  console.log("Navigating to sign in...");
  await page.goto('https://sabbir3001.naimulhassan.me/sign-in', { waitUntil: 'networkidle2' });

  console.log("Filling out login form...");
  await page.type('input[name="email"]', 'democlub1@gmail.com');
  await page.type('input[type="password"]', '123123123');
  await page.click('button[type="submit"]');

  console.log("Waiting for navigation to dashboard...");
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  console.log("Navigating to edit-clubs...");
  await page.goto('https://sabbir3001.naimulhassan.me/edit-clubs', { waitUntil: 'networkidle2' });

  console.log("Waiting for form to load...");
  await page.waitForSelector('input[name="stats.yardage"]', { timeout: 10000 });

  console.log("Filling out stats.yardage and signatureHole.number...");
  await page.type('input[name="stats.yardage"]', '1234');
  await page.type('input[name="stats.par"]', '72');
  await page.type('input[name="signatureHole.number"]', '17');

  console.log("Intercepting requests...");
  await page.setRequestInterception(true);
  
  let capturedPayload = null;

  page.on('request', request => {
    if (request.url().includes('/courses/mine') && request.method() === 'PATCH') {
      console.log("Intercepted PATCH request!");
      capturedPayload = request.postData();
    }
    request.continue();
  });

  console.log("Clicking Publish Updates...");
  // The button has text "Publish Updates"
  const button = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent.includes('Publish Updates'));
  });
  
  if (button) {
    await button.click();
  } else {
    console.log("Could not find Publish Updates button!");
  }

  // Wait a bit for the request to fire
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log("CAPTURED PAYLOAD:");
  if (capturedPayload) {
    console.log(JSON.stringify(JSON.parse(capturedPayload), null, 2));
  } else {
    console.log("No payload captured.");
  }

  await browser.close();
})();
