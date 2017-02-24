module.exports = record

const generateRandomString = require('./generate-random-string')
const AudioRecorder = require('./audio-recorder')

function record (hoodie) {
  const $btnRecord = document.querySelector('#record')
  const $btnStop = document.querySelector('#stop-recording')
  const $save = document.querySelector('#save-recording')
  const $volume = document.querySelector('#volume span')
  const state = {
    audio: null
  }
  let record

  $btnRecord.addEventListener('click', function (event) {
    event.preventDefault()

    record = new AudioRecorder()

    record.getUserPermission()

    .then((stream) => {
      return record.start(stream, onComplete.bind(null, state), showVolume.bind(null, $volume))
    })
  })

  $btnStop.addEventListener('click', function (event) {
    event.preventDefault()
    record.stop()
    showVolume($volume, 0)
  })

  $save.addEventListener('click', function (event) {
    event.preventDefault()
    record.stop()

    const noteId = 'note/' + generateRandomString(7)
    const note = {
      id: noteId,
      progress: []
    }
    const speech = {
      id: noteId + '/speech',
      _attachments: {
        'speech.webm': {
          content_type: state.audio.type,
          data: state.audio
        }
      }
    }

    hoodie.store.add([note, speech])

    .then(() => {
      console.log('stored')
    })

    .catch((error) => {
      console.log(error)
    })
  })
}

function onComplete (state, audioData) {
  // aborted
  if (audioData === null) {
    return
  }

  state.audio = audioData
}

function showVolume ($volume, volume, time) {
  $volume.textContent = volume
  console.log('volume %d at %dms', volume, time)
}