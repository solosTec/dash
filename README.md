# supported environment variables

replace the smf server on development
```
VUE_APP_SMF_SERVER=host:port
```

do not ask for a config.user - use admin instead 
```
VUE_APP_SMF_NO_AUTH=true
```


# pre steps

sudo npm install -g @vue/cli
sudo chown -R username: /usr/local/lib/node_modules
vue create dash

# dash

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# dependencies

* [bootstrap](https://getbootstrap.com/)
* [bootstrap-vue](https://bootstrap-vue.js.org/)
* [vue-headful](https://github.com/troxler/vue-headful)
* [vue-router](https://github.com/vuejs/vue-router#readme)
* [vue-toasted](https://github.com/shakee93/vue-toasted#readme)
* [vue-websocket](https://github.com/icebob/vue-websocket)
* [vuex](https://github.com/vuejs/vuex#readme)
* [vue-resource](https://github.com/pagekit/vue-resource)
* [i18n](https://github.com/mashpie/i18n-node)
* [vue-analytics](https://github.com/MatteoGabriele/vue-analytics)

## install plugins

```
$ vue add bootstrap-vue 
$ npm i vue-headful
$ npm install i18n --save
$ npm i vue-analytics
$ npm i vue-resource
$ npm i vue-router
$ npm i vue-toasted
```




