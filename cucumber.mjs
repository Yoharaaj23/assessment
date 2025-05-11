/** @type {import('@cucumber/cucumber').IConfiguration} */
export const config =  {
        require: ['tests/step_definitions/**/*.js'],
        paths: ['tests/features/**/*.feature'],
};
export default config;
