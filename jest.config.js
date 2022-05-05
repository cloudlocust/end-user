module.exports = {
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    moduleNameMapper: {
        // Mocks out all these file formats when tests are run
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'identity-obj-proxy',
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
}
