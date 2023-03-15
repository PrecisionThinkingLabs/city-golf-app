module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      if (env === "development") {
        webpackConfig.resolve.fallback = {
          assert: require.resolve("assert"),
        };
      }
      return webpackConfig;
    },
  },
};
