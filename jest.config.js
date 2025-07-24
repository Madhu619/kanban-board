module.exports = {
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^react-router-dom$": "<rootDir>/node_modules/react-router-dom",
  },
  transformIgnorePatterns: ["/node_modules/(?!react-router-dom)"],
};
