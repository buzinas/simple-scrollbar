// Karma configuration
// Generated on Mon Sep 25 2017 17:43:21 GMT+1000 (AUS Eastern Standard Time)
var travisConfig = {
    customLaunchers: {
        Chrome_travis_ci: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    },
    singleRun: true,
    browsers: 'Chrome_travis_ci'
};

var additionalConfig = process.env.TRAVIS === 'true' ? travisConfig : {}

console.info(process.env);
console.info(additionalConfig);

var defaultConfig = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'test/*.js',
        'src/*.js',
        'src/*.css'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
};

module.exports = function (config) {
    config.set(Object.assign({ logLevel: config.LOG_INFO }, additionalConfig, defaultConfig));
};
