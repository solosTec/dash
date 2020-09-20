// vue.config.js
module.exports = {
  publicPath:
    process.env.VUE_APP_SMF_DOCKER === "true"
      ? "/" + process.env.VUE_APP_SMF_PUBLIC_PATH + "/"
      : "/"
};
