module.exports = function (wallaby) {
  return {
    env: {
      params: {
        env: 'NODE_ENV=test;API_KEY=test-api-key',
      },
    },
  };
};
