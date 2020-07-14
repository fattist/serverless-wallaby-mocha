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
            'authorizers/*.ts',
            'services/*.ts',
        ],
        tests: [
            '__tests__/**/*.spec.ts'
        ],
        testFramework: 'jest'
    }
}