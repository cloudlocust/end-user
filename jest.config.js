module.exports = {
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    moduleNameMapper: {
        // Mocks out all these file formats when tests are run
        // https://stackoverflow.com/a/54513338/13145536
        '\\.(css|less|scss|sass)$': '<rootDir>/src/mocks/fileMock.ts',
        '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/src/mocks/fileMock.ts',
    },
    roots: ['./src'],
    setupFilesAfterEnv: ['./jest.setup.ts'],
    testMatch: ['**/*.test.(ts|tsx)'],
    testPathIgnorePatterns: ['node_modules/'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    // https://stackoverflow.com/a/50863753/13145536
    modulePaths: ['<rootDir>'],
    verbose: true,
    // Config help makes unit test running faster
    // https://stackoverflow.com/a/60905543
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            isolatedModules: true,
        },
    },
}
