Inventory Management API Test Framework

## Prerequisites
* Node.js (Latest LTS version)
* npm
* Git

## Setup Steps
1. **Clone Repository**
   ```bash
   git clone https://github.com/Yoharaaj23/assessment.git
   cd assessment
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory (if not present already) with:
   ```plaintext
   API_BASE_URL=https://apiforshopsinventorymanagementsystem.onrender.com
   TEST_USERNAME=<username>
   TEST_PASSWORD=<password>
   ```

## Project Structure
```plaintext
└── DWP_Assessment
    ├── src/
    │   ├── api/          # API clients
    │   └── utils/        # Helpers & utilities
    ├── tests/            # Test files
    ├── reports/          # Test reports
    └── .env              # Environment variables
```

## Tech Stack
* Cucumber.js - BDD testing framework
* Chai - Assertions
* Axios - HTTP client
* dotenv - Environment management

## Running Tests
Run this on any OS:

```bash
npm test
```

### Running Tagged Tests

To run tests with a specific tag (e.g., `@e2e`), use:

```bash
npm test -- --tags "@e2e"
```

Test reports will be generated in `reports/cucumber-report.html`

## Troubleshooting
1. **Node.js Issues**
    * Use LTS version
    * Run: `npm cache clean --force`

2. **Environment Issues**
    * Verify `.env` file exists
    * Check all variables are set

3. **Windows Issues**
    * Use Command Prompt or PowerShell
    * Make sure you're in the project directory
