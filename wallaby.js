/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = w => {
    return {
        compilers: {
            '**/*.ts': w.compilers.typeScript({
                experimentalDecorators: true,
                emitDecoratorMetadata: true,
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
            'src/authorizers/*.ts',
            'src/helpers/*.ts',
            'src/i18n/*.ts',
            'src/routes/*.ts',
            'src/services/*.ts',
            'src/streams/*.ts',
            'src/entities/*/*.ts',
            'src/helpers/*/*.ts'
        ],
        setup: () => {
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
            '__tests__/**/*.integration.ts',
            '__tests__/**/*.spec.ts'
        ],
        testFramework: 'mocha',
        workers: {
            recycle: true
        }
    }
}