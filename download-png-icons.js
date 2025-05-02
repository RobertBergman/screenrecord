import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const iconDir = path.join(__dirname, 'src', 'assets', 'icons');
const pngDir = path.join(__dirname, 'src', 'assets', 'icons', 'png');

// Create PNG directory if it doesn't exist
if (!fs.existsSync(pngDir)) {
  fs.mkdirSync(pngDir, { recursive: true });
}

(async () => {
  // Launch browser
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate to the icon generator page
  const htmlPath = path.join(iconDir, 'icon-generator.html');
  const htmlUrl = `file://${htmlPath}`;
  
  console.log(`Navigating to ${htmlUrl}`);
  await page.goto(htmlUrl, { waitUntil: 'networkidle0' });
  
  // Click the generate button
  console.log('Generating icons...');
  await page.click('#generateBtn');
  
  // Use setTimeout instead of page.waitForTimeout
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('Downloading icons...');
  
  // Function to download an icon
  const downloadIcon = async (selector, filename) => {
    try {
      // Get the canvas data
      const base64 = await page.evaluate((sel) => {
        const link = document.querySelector(sel);
        if (!link) return null;
        return link.href;
      }, selector);
      
      if (!base64) {
        console.error(`Element not found for selector: ${selector}`);
        return;
      }
      
      // Remove the data URL prefix
      const data = base64.replace(/^data:image\/png;base64,/, '');
      const buf = Buffer.from(data, 'base64');
      
      // Save the file
      const filePath = path.join(pngDir, filename);
      fs.writeFileSync(filePath, buf);
      console.log(`Downloaded ${filePath}`);
    } catch (err) {
      console.error(`Error downloading ${filename}: ${err.message}`);
    }
  };
  
  // Download all icons
  const iconNames = [
    { prefix: 'app-logo-16', selector: 'a[download="app-logo-16.png"]' },
    { prefix: 'app-logo-32', selector: 'a[download="app-logo-32.png"]' },
    { prefix: 'app-logo-48', selector: 'a[download="app-logo-48.png"]' },
    { prefix: 'app-logo-64', selector: 'a[download="app-logo-64.png"]' },
    { prefix: 'app-logo-128', selector: 'a[download="app-logo-128.png"]' },
    { prefix: 'app-logo-256', selector: 'a[download="app-logo-256.png"]' },
    { prefix: 'app-logo', selector: 'a[download="app-logo.png"]' },
    { prefix: 'record-icon', selector: 'a[download="record-icon.png"]' },
    { prefix: 'stop-icon', selector: 'a[download="stop-icon.png"]' },
    { prefix: 'pause-icon', selector: 'a[download="pause-icon.png"]' },
    { prefix: 'screen-icon', selector: 'a[download="screen-icon.png"]' },
    { prefix: 'webcam-icon', selector: 'a[download="webcam-icon.png"]' },
    { prefix: 'microphone-icon', selector: 'a[download="microphone-icon.png"]' },
    { prefix: 'settings-icon', selector: 'a[download="settings-icon.png"]' },
    { prefix: 'slides-icon', selector: 'a[download="slides-icon.png"]' }
  ];
  
  // Download each icon
  for (const { prefix, selector } of iconNames) {
    await downloadIcon(selector, `${prefix}.png`);
  }
  
  console.log('All icons downloaded successfully!');
  await browser.close();
  
  // Copy app-logo.png to public directory for favicon
  const faviconSource = path.join(pngDir, 'app-logo-32.png');
  const faviconDest = path.join(__dirname, 'public', 'favicon.png');
  
  if (fs.existsSync(faviconSource)) {
    fs.copyFileSync(faviconSource, faviconDest);
    console.log(`Copied favicon to ${faviconDest}`);
  }
  
  // Update index.html to include the favicon
  const indexHtmlPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    
    // Check if favicon is already set
    if (!indexHtml.includes('<link rel="icon"')) {
      // Add favicon link after the title tag
      indexHtml = indexHtml.replace(
        '</title>',
        '</title>\n    <link rel="icon" type="image/png" href="/favicon.png" />'
      );
      
      fs.writeFileSync(indexHtmlPath, indexHtml);
      console.log(`Updated ${indexHtmlPath} with favicon link`);
    }
  }
  
  console.log('Icon generation complete!');
})()
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
