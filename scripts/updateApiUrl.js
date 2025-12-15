/**
 * Helper script to update the API URL in apiConfig.js
 * Usage: node scripts/updateApiUrl.js https://your-api-url.com
 */

const fs = require('fs');
const path = require('path');

const apiConfigPath = path.join(__dirname, '..', 'utils', 'apiConfig.js');

// Get URL from command line argument
const newUrl = process.argv[2];

if (!newUrl) {
    console.error('❌ Error: Please provide the API URL');
    console.log('Usage: node scripts/updateApiUrl.js https://your-api-url.com');
    process.exit(1);
}

// Validate URL format
try {
    new URL(newUrl);
} catch (error) {
    console.error('❌ Error: Invalid URL format');
    process.exit(1);
}

// Ensure URL ends with /api
const apiUrl = newUrl.endsWith('/api') ? newUrl : `${newUrl}/api`;

// Read current config
let configContent = fs.readFileSync(apiConfigPath, 'utf8');

// Update production URL
const productionUrlRegex = /(export const API_BASE_URL = isDevelopment\s*\?\s*'[^']*'\s*:\s*)'[^']*'/;
if (productionUrlRegex.test(configContent)) {
    configContent = configContent.replace(
        productionUrlRegex,
        `$1'${apiUrl}'`
    );
    fs.writeFileSync(apiConfigPath, configContent);
    console.log(`✅ Updated API URL to: ${apiUrl}`);
    console.log(`📝 File updated: ${apiConfigPath}`);
} else {
    console.error('❌ Error: Could not find API_BASE_URL in config file');
    process.exit(1);
}

