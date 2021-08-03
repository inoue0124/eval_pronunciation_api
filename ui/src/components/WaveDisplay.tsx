/* eslint-disable */
import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import { Filter } from '../util/Filter'
import WaveSurfer from 'wavesurfer.js'
// @ts-expect-error Type-definitions are missing
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.js'
// @ts-expect-error Type-definitions are missing
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.js'
import { Button } from '@material-ui/core'

type Props = {
  url: string
}

export const WaveDisplay: React.FC<Props> = ({ url }) => {
  const wavesurfer = useRef<WaveSurfer | null>(null)
  const waveformRef = useRef<HTMLDivElement | null>(null)
  const waveformTimeline = useRef<HTMLDivElement | null>(null)

  const workerRef = useRef<Worker>()
  useEffect(() => {
    workerRef.current = new Worker(new URL('../util/pitch.worker', import.meta.url))
    return () => {
      workerRef.current!.terminate()
    }
  }, [])

  const [samplingRate, setSamplingRate] = useState<number>(48000)
  const [audioContext, setAudioContext] = useState<AudioContext>(new AudioContext())

  const dopitch = (fsignal: any, SRATE: any) => {
    var nfsamp = Math.floor(fsignal.length / 3)
    var ffsignal = new Float32Array(nfsamp)
    var filt = new Filter()
    filt.design(filt.LOW_PASS, 4, SRATE / 3, SRATE / 3, SRATE)
    for (var i = 0; i < nfsamp; i++) {
      filt.sample(fsignal[3 * i])
      filt.sample(fsignal[3 * i + 1])
      ffsignal[i] = filt.sample(fsignal[3 * i + 2])
    }

    console.log('HERE')

    workerRef.current!.onmessage = (event) => {
      const ffx = event.data.fx
      const fvs = event.data.vs
      const ffxlen = event.data.fxlen
      // for (i = 0; i < nsamp; i++) {
      //   if (fvs[ssamp + i] > 0.3)
      //     pdata.push([(i + ssamp) / FXRATE, ffx[ssamp + i]]);
      // }
      console.log(ffx, fvs, ffxlen)
    }

    workerRef.current!.postMessage({ signal: ffsignal, srate: samplingRate / 3 })
  }

  axios
    .get(url, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    })
    .then((response) => {
      const filedata = response.data
      const fileblob = new Blob([filedata], { type: 'audio/wav' })
      const fileurl = URL.createObjectURL(fileblob)

      audioContext.decodeAudioData(
        filedata,
        function onSuccess(buffer: any) {
          let siglen = buffer.length
          let fsignal = new Float32Array(siglen)
          let srcbuf = buffer.getChannelData(0)
          let sigmax = 0
          for (let i = 0; i < siglen; i++) {
            var s = srcbuf[i]
            if (s > sigmax) sigmax = s
            if (s < -sigmax) sigmax = -s
          }
          for (let i = 0; i < siglen; i++) fsignal[i] = srcbuf[i] / sigmax

          dopitch(fsignal, samplingRate)
        },
        function onFailure() {
          alert('decodeAudioData failed')
        },
      )
    })
    .catch((error) => console.log(error))

  useEffect(() => {
    if (waveformRef.current && waveformTimeline.current) {
      wavesurfer.current = WaveSurfer.create({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        container: waveformRef.current!,
        responsive: true,
        plugins: [
          CursorPlugin.create({
            showTime: true,
            opacity: 1,
            customShowTimeStyle: {
              'background-color': '#000',
              color: '#fff',
              padding: '2px',
            },
          }),
          TimelinePlugin.create({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            container: waveformTimeline.current!,
          }),
        ],
      })

      wavesurfer.current.load(url)

      return () => {
        wavesurfer.current?.destroy()
      }
    } else {
      return undefined
    }
  }, [url, waveformRef, waveformTimeline])

  return (
    <div>
      <div id="waveform" ref={waveformRef} style={{ position: 'relative' }} />
      <div id="waveform-timeline" ref={waveformTimeline} />
    </div>
  )
}
