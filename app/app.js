/* global location */

const Hoodie = require('@hoodie/client')
const hoodie = new Hoodie({
  url: location.origin,
  PouchDB: require('pouchdb-idb')
})

const assureAccount = require('./lib/assure-account')
const notesList = require('./lib/notes-list')
const record = require('./lib/record')
const setAppStatus = require('./lib/set-app-status')

hoodie.ready.then(() => {
  record(hoodie)
  assureAccount(hoodie)
    .then(function () {
      console.log('signed up as', hoodie.account.username)
      init()
    })
    .catch(function (error) {
      setAppStatus('Error: ' + error)
    })

  function init () {
    setAppStatus('app is ready')
    console.log('starting app')

    notesList(hoodie)
  }
})

global.hoodie = hoodie