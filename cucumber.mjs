/** @type {import('@cucumber/cucumber').IConfiguration} */
export const config = {
        require: ['tests/step_definitions/**/*.js'],
        paths: ['tests/features/**/*.feature'],
        format: [
                ['html:reports/cucumber-report.html'],
                'summary'
        ],
        formatOptions: {
                snippetInterface: 'async-await'
        }
};
export default config;