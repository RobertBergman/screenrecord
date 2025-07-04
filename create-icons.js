import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get current directory 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create icon directories if they don't exist
const iconDir = path.join(__dirname, 'src', 'assets', 'icons');
const pngDir = path.join(__dirname, 'src', 'assets', 'icons', 'png');

if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}
if (!fs.existsSync(pngDir)) {
  fs.mkdirSync(pngDir, { recursive: true });
}

// Define app logo and icon SVGs
const icons = {
  'app-logo': `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="512" height="512" rx="100" fill="#3A86FF"/>
  
  <!-- Screen outline -->
  <rect x="106" y="126" width="300" height="200" rx="20" stroke="white" stroke-width="20" fill="none"/>
  
  <!-- Record button -->
  <circle cx="256" cy="370" r="50" fill="#FF5757"/>
  <circle cx="256" cy="370" r="40" fill="#FF0000"/>
  
  <!-- Screen content design -->
  <rect x="136" y="156" width="240" height="140" rx="10" fill="#E0E7FF"/>
  
  <!-- Webcam indicator -->
  <rect x="156" y="176" width="80" height="60" rx="5" fill="#8BB8FF"/>
  
  <!-- Screen content lines -->
  <rect x="256" y="176" width="100" height="10" rx="5" fill="#8BB8FF"/>
  <rect x="256" y="196" width="80" height="10" rx="5" fill="#8BB8FF"/>
  <rect x="256" y="216" width="90" height="10" rx="5" fill="#8BB8FF"/>
  
  <!-- Recording indicator dot -->
  <circle cx="425" cy="85" r="25" fill="#FF0000"/>
</svg>`,

  'record-icon': `<?xml version="1.0" encoding="UTF-8"?>
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="10" fill="#FF0000"/>
</svg>`,

  'stop-icon': `<?xml version="1.0" encoding="UTF-8"?>
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="6" y="6" width="12" height="12" fill="#333333"/>
</svg>`,

  'pause-icon': `<?xml version="1.0" encoding="UTF-8"?>
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="6" y="6" width="4" height="12" fill="#333333"/>
  <rect x="14" y="6" width="4" height="12" fill="#333333"/>
</svg>`,

  'screen-icon': `<?xml version="1.0" encoding="UTF-8"?>
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="4" width="20" height="14" rx="2" stroke="#3A86FF" stroke-width="2" fill="none"/>
  <line x1="2" y1="8" x2="22" y2="8" stroke="#3A86FF" stroke-width="2"/>
  <line x1="12" y1="20" x2="12" y2="22" stroke="#3A86FF" stroke-width="2"/>
  <line x1="8" y1="22" x2="16" y2="22" stroke="#3A86FF" stroke-width="2"/>
</svg>`,

  'webcam-icon': `<?xml version="1.0" encoding="UTF-8"?>
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="6" width="14" height="12" rx="2" fill="#3A86FF"/>
  <path d="M17 8L22 5V19L17 16V8Z" fill="#3A86FF"/>
  <circle cx="10" cy="12" r="3" fill="white"/>
</svg>`,

  'microphone-icon': `<?xml version="1.0" encoding="UTF-8"?>
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="9" y="2" width="6" height="12" rx="3" fill="#3A86FF"/>
  <path d="M5 11C5 14.866 8.13401 18 12 18C15.866 18 19 14.866 19 11" stroke="#3A86FF" stroke-width="2" stroke-linecap="round"/>
  <line x1="12" y1="18" x2="12" y2="22" stroke="#3A86FF" stroke-width="2"/>
  <line x1="8" y1="22" x2="16" y2="22" stroke="#3A86FF" stroke-width="2"/>
</svg>`,

  'settings-icon': `<?xml version="1.0" encoding="UTF-8"?>
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="2" stroke="#3A86FF" stroke-width="2"/>
  <path d="M12 6C12 6 12 5 12 4C12 3 13 2 14 2H15C16 2 17 3 17 4C17 5 16 6 15.5 6.5C15 7 14 7 12 7C10 7 9 7 8.5 6.5C8 6 7 5 7 4C7 3 8 2 9 2H10C11 2 12 3 12 4C12 5 12 6 12 6Z" stroke="#3A86FF" stroke-width="2"/>
  <path d="M12 18C12 18 12 19 12 20C12 21 13 22 14 22H15C16 22 17 21 17 20C17 19 16 18 15.5 17.5C15 17 14 17 12 17C10 17 9 17 8.5 17.5C8 18 7 19 7 20C7 21 8 22 9 22H10C11 22 12 21 12 20C12 19 12 18 12 18Z" stroke="#3A86FF" stroke-width="2"/>
  <path d="M6 12C6 12 5 12 4 12C3 12 2 11 2 10V9C2 8 3 7 4 7C5 7 6 8 6.5 8.5C7 9 7 10 7 12C7 14 7 15 6.5 15.5C6 16 5 17 4 17C3 17 2 16 2 15V14C2 13 3 12 4 12C5 12 6 12 6 12Z" stroke="#3A86FF" stroke-width="2"/>
  <path d="M18 12C18 12 19 12 20 12C21 12 22 11 22 10V9C22 8 21 7 20 7C19 7 18 8 17.5 8.5C17 9 17 10 17 12C17 14 17 15 17.5 15.5C18 16 19 17 20 17C21 17 22 16 22 15V14C22 13 21 12 20 12C19 12 18 12 18 12Z" stroke="#3A86FF" stroke-width="2"/>
</svg>`,

  'slides-icon': `<?xml version="1.0" encoding="UTF-8"?>
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="4" width="18" height="14" rx="2" stroke="#3A86FF" stroke-width="2" fill="white"/>
  <rect x="6" y="8" width="12" height="2" rx="1" fill="#3A86FF"/>
  <rect x="6" y="12" width="8" height="2" rx="1" fill="#3A86FF"/>
  <line x1="12" y1="20" x2="12" y2="22" stroke="#3A86FF" stroke-width="2"/>
  <line x1="8" y1="22" x2="16" y2="22" stroke="#3A86FF" stroke-width="2"/>
</svg>`
};

// Create SVG files
console.log('Creating SVG files...');
Object.entries(icons).forEach(([name, content]) => {
  const filePath = path.join(iconDir, `${name}.svg`);
  fs.writeFileSync(filePath, content);
  console.log(`Created ${filePath}`);
});

// Check if we can generate PNGs with a simple HTML/Canvas solution
console.log('Creating HTML to generate PNGs...');
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Icon Generator</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    .icon-container { margin-bottom: 30px; }
    button { padding: 10px; margin-top: 20px; }
  </style>
</head>
<body>
  <h1>Screen Recorder Icon Generator</h1>
  <p>Click the button below to generate PNG icons:</p>
  <button id="generateBtn">Generate All PNG Icons</button>
  <div id="output"></div>

  <script>
    const icons = ${JSON.stringify(icons)};
    const outputDiv = document.getElementById('output');
    
    document.getElementById('generateBtn').addEventListener('click', generateIcons);
    
    async function generateIcons() {
      outputDiv.innerHTML = '<p>Generating icons...</p>';
      
      const results = [];
      for (const [name, svg] of Object.entries(icons)) {
        const sizes = name === 'app-logo' ? [16, 32, 48, 64, 128, 256, 512] : [24];
        
        for (const size of sizes) {
          const fileName = name === 'app-logo' && size !== 512 ? 
            \`\${name}-\${size}.png\` : \`\${name}.png\`;
          
          try {
            const pngData = await svgToPng(svg, size, size);
            const link = document.createElement('a');
            link.download = fileName;
            link.href = pngData;
            link.textContent = \`Download \${fileName}\`;
            
            const container = document.createElement('div');
            container.className = 'icon-container';
            
            const img = document.createElement('img');
            img.src = pngData;
            img.alt = fileName;
            img.style.border = '1px solid #ccc';
            img.style.margin = '10px';
            
            container.appendChild(img);
            container.appendChild(document.createElement('br'));
            container.appendChild(link);
            
            results.push(container);
          } catch (err) {
            console.error(\`Error generating \${fileName}:\`, err);
          }
        }
      }
      
      outputDiv.innerHTML = '<h2>Generated Icons:</h2>';
      results.forEach(container => outputDiv.appendChild(container));
    }
    
    async function svgToPng(svgContent, width, height) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const svg = new Blob([svgContent], {type: 'image/svg+xml'});
        const url = URL.createObjectURL(svg);
        
        img.onload = function() {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            const pngData = canvas.toDataURL('image/png');
            URL.revokeObjectURL(url);
            resolve(pngData);
          } catch (err) {
            reject(err);
          }
        };
        
        img.onerror = function() {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load SVG'));
        };
        
        img.src = url;
      });
    }
  </script>
</body>
</html>
`;

const htmlPath = path.join(iconDir, 'icon-generator.html');
fs.writeFileSync(htmlPath, htmlContent);
console.log(`Created ${htmlPath}`);

console.log('\nAll SVG icons have been created successfully!');
console.log(`\nTo generate PNG icons, open the HTML file in a browser: ${htmlPath}`);
console.log('Then click the "Generate All PNG Icons" button and download each icon.');
