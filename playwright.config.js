const config = {
  testDir: './tests',  
  timeout: 60000,       
  retries: 1,          
  use: {
    navigationTimeout: 60000,
    actionTimeout: 15000,
    headless: true,    
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
};

module.exports = config;
