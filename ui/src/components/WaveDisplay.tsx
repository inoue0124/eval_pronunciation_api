/* eslint-disable */
import axios from 'axios'
import { useState, useEffect, useRef, useMemo } from 'react'
import { Filter } from '../util/Filter'
import WaveSurfer from 'wavesurfer.js'
// @ts-expect-error Type-definitions are missing
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.js'
import { Scatter } from 'react-chartjs-2'
import {
  CircularProgress,
  createStyles,
  makeStyles,
  Typography,
  Theme,
  IconButton,
} from '@material-ui/core'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import StopIcon from '@material-ui/icons/Stop'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    waveForm: {
      position: 'relative',
      marginLeft: '35px',
      marginRight: '10px',
    },
    indicatorWrapper: {
      textAlign: 'center',
      marginTop: theme.spacing(2),
      marginBottom: -theme.spacing(10),
    },
    pitchWrapper: {
      position: 'relative',
      minHeight: '150px',
    },
  }),
)

type Data = {
  x: number
  y: number
}

type Props = {
  isDisableToolbar: boolean
  label: string
  url: string
  fn_ref: any
  onFinishPlaying?: () => void
}
export const WaveDisplay: React.FC<Props> = ({
  isDisableToolbar,
  label,
  url,
  fn_ref,
  onFinishPlaying,
}) => {
  const classes = useStyles()
  const wavesurfer = useRef<WaveSurfer | null>(null)
  const waveformRef = useRef<HTMLDivElement | null>(null)
  const workerRef = useRef<Worker>()
  const [graphData, setGraphData] = useState<any>(undefined)
  const [graphOptions, setGraphOptions] = useState<any>(undefined)
  let pitchData: Data[] = []
  const FXRATE = 200
  const audioContext = new AudioContext()
  const samplingRate = audioContext.sampleRate
  const [isCalculatingPitch, setIsCalculatingPitch] = useState<boolean>(false)

  // ピッチ計算
  useEffect(() => {
    setIsCalculatingPitch(true)
    workerRef.current = new Worker(new URL('../util/pitch.worker', import.meta.url))
    // URLから音声データを取得しピッチを抽出
    axios
      .get(url, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'audio/mpeg',
        },
      })
      .then((response) => {
        audioContext.decodeAudioData(
          response.data,
          function onSuccess(buffer: any) {
            const siglen = buffer.length
            const fsignal = new Float32Array(siglen)
            const srcbuf = buffer.getChannelData(0)
            let sigmax = 0
            for (let i = 0; i < siglen; i++) {
              var s = srcbuf[i]
              if (s > sigmax) sigmax = s
              if (s < -sigmax) sigmax = -s
            }
            for (let i = 0; i < siglen; i++) {
              fsignal[i] = srcbuf[i] / sigmax
            }
            const nfsamp = Math.floor(fsignal.length / 3)
            const ffsignal = new Float32Array(nfsamp)
            const filt = new Filter()
            filt.design(filt.LOW_PASS, 4, samplingRate / 3, samplingRate / 3, samplingRate)
            for (var i = 0; i < nfsamp; i++) {
              filt.sample(fsignal[3 * i])
              filt.sample(fsignal[3 * i + 1])
              ffsignal[i] = filt.sample(fsignal[3 * i + 2])
            }
            // setGraphData({
            //   datasets: [
            //     {
            //       data: [
            //         {
            //           x: -10,
            //           y: 0,
            //         },
            //         {
            //           x: 0,
            //           y: 200,
            //         },
            //         {
            //           x: 10,
            //           y: 100,
            //         },
            //         {
            //           x: 0.5,
            //           y: 150.5,
            //         },
            //       ],
            //       borderColor: 'rgb(75, 192, 192)',
            //       borderWidth: 1,
            //     },
            //   ],
            // })
            // setGraphOptions({
            //   responsive: true,
            //   maintainAspectRatio: false,
            //   plugins: {
            //     legend: {
            //       display: false,
            //     },
            //     tooltip: {
            //       enabled: false,
            //     },
            //   },
            // })
            // setIsCalculatingPitch(false)
            // workerスレッドから終了メッセージを受信した際の動作
            workerRef.current!.onmessage = (event) => {
              pitchData = []
              for (i = 0; i < fsignal.length; i++) {
                if (event.data.vs[i] > 0.3) {
                  pitchData.push({ x: i / FXRATE, y: event.data.fx[i] })
                }
              }
              let ymin = 62.5
              let ymax = 500
              if (pitchData.length > 0) {
                let avgPitch = 0
                for (i = 0; i < pitchData.length; i++) {
                  avgPitch += pitchData[i].y
                }
                avgPitch /= pitchData.length
                ymin = avgPitch / 2
                ymax = avgPitch * 1.5
              }
              setGraphData({
                datasets: [
                  {
                    data: pitchData,
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1,
                  },
                ],
              })
              setGraphOptions({
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    enabled: false,
                  },
                },
                scales: {
                  x: {
                    min: 0,
                    max: fsignal.length / samplingRate,
                  },
                  y: {
                    min: Math.floor(ymin),
                    max: Math.floor(ymax),
                  },
                },
              })
              setIsCalculatingPitch(false)
            }
            // workerスレッドを開始
            workerRef.current!.postMessage({ signal: ffsignal, srate: samplingRate / 3 })
          },
          function onFailure() {
            console.log('decode AudioData failed')
          },
        )
      })
      .catch((error) => alert(error))
    return () => {
      workerRef.current!.terminate()
    }
  }, [url])

  // 音声波形表示
  useEffect(() => {
    if (waveformRef.current) {
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
        ],
      })
      wavesurfer.current.load(url)
      return () => {
        wavesurfer.current?.destroy()
      }
    }
  }, [url, waveformRef])

  useEffect(() => {
    if (wavesurfer.current) {
      wavesurfer.current.unAll() // finishのイベントが重複して付いてしまうので毎回消す
      wavesurfer.current.once('finish', () => {
        wavesurfer.current?.seekTo(0)
        if (onFinishPlaying) onFinishPlaying()
      })
    }
  }, [onFinishPlaying])

  fn_ref.current = {
    play: () => {
      wavesurfer.current?.seekTo(0)
      wavesurfer.current?.play()
    },
    stop: () => wavesurfer.current?.stop(),
  }

  const PitchGraph = useMemo(() => {
    return <Scatter data={graphData} options={graphOptions} height={30} />
  }, [graphData, graphOptions])

  return (
    <div>
      <Typography color="textPrimary" variant="h6" display="inline">
        {label}
      </Typography>
      <IconButton
        disabled={isDisableToolbar}
        onClick={() => {
          wavesurfer.current?.play()
        }}
      >
        <PlayArrowIcon />
      </IconButton>
      <IconButton
        disabled={isDisableToolbar}
        onClick={() => {
          wavesurfer.current?.stop()
        }}
      >
        <StopIcon />
      </IconButton>
      <div ref={waveformRef} className={classes.waveForm} />

      <div className={classes.pitchWrapper}>
        {isCalculatingPitch ? (
          <div className={classes.indicatorWrapper}>
            <CircularProgress />
            <Typography variant="caption" display="block" gutterBottom>
              ピッチ計算中
            </Typography>
          </div>
        ) : (
          PitchGraph
        )}
      </div>
    </div>
  )
}
