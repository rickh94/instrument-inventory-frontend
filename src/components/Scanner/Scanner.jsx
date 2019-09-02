import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Quagga from 'quagga'

import './Scanner.scss'

function Scanner(props) {
  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          contstraints: {
            width: { min: 640 },
            height: { min: 480 },
            aspectRatio: { min: 1, max: 100 },
            facing: 'environment',
          },
        },
        locator: {
          patchSize: 'medium',
          halfSample: true,
        },
        numOfWorkers: 2,
        decoder: {
          readers: ['code_128_reader', 'code_39_reader'],
        },
        locate: true,
      },
      err => {
        if (err) {
          // eslint-disable-next-line no-console
          return console.error(err)
        }
        Quagga.start()
      }
    )
    Quagga.onDetected(props.onDetected)
    return function cleanup() {
      Quagga.offDetected(props.onDetected)
      Quagga.stop()
    }
  })

  return <div id="interactive" className="viewport" data-testid="scanner" />
}

Scanner.propTypes = {
  onDetected: PropTypes.func.isRequired,
}

export default Scanner
