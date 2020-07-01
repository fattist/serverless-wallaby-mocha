module.exports = w => {
    return {
        compilers: {
            '**/*.ts': w.compilers.typeScript({
                isolatedModules: true,
                tsconfig: false
            })
        },
        env: {
            type: 'node',
            runner: 'node'
        },
        files: [
            'tsconfig.json',
            'authorizers/*.ts',
            'services/*.ts',
        ],
        setup: ctx => {
            const mocha = ctx.testFramework;
            const chai = require('chai');
            const sinon = require('sinon');
            const sc = require('sinon-chai');

            chai.use(sc);

            mocha.suite.beforeEach('sinon-before', function() {
               if (null == this.sinon) {
                   this.sinon = sinon.createSandbox();
               }
            });

            mocha.suite.afterEach('sinon-after', function() {
                if (this.sinon && 'function' === typeof this.sinon.restore) {
                    this.sinon.restore();
                }
            });

            if (global._tsconfigPathsRegistered) return;

            const tsConfigPaths = require('tsconfig-paths');
            const tsconfig = require('./tsconfig.json')

            tsConfigPaths.register({
                baseUrl: tsconfig.compilerOptions.baseUrl,
                paths: tsconfig.compilerOptions.paths
            });

            global._tsconfigPathsRegistered = true;
        },
        tests: [
            '__tests__/**/*.spec.ts'
        ],
        testFramework: 'mocha',
        workers: {
            recycle: true
        }
    }
}