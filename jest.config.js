module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: {
        "^@authorizers/(.*)$": "<rootDir>/authorizers/$1",
        "^@services/(.*)$": "<rootDir>/services/$1"
    }
}