// vue.config.js
module.exports = {
    publicPath: process.env.VUE_APP_SMF_DOCKER === 'true'
        ? '/smf/'
        : '/'
};
