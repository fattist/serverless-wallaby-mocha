module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: {
        "^@authorizers/(.*)$": "<rootDir>/src/authorizers/$1",
        "^@helpers/(.*)$": "<rootDir>/src/helpers/$1",
        "^@routes/(.*)$": "<rootDir>/src/routes/$1",
        "^@services/(.*)$": "<rootDir>/src/services/$1"
    }
}