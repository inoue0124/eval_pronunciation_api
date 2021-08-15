/* eslint-disable */
import { useState, useEffect, useRef } from 'react'
import ApiClient from '../../api'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import { Button, Tab, Tabs, CircularProgress } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import { useSetRecoilState } from 'recoil'
import { addedSpeechState } from '../../states/addTeacherSpeech/addedSpeechState'
import { TeacherSpeech } from '../../types/TeacherSpeech'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import StopIcon from '@material-ui/icons/Stop'
import MicIcon from '@material-ui/icons/Mic'
import { useReactMediaRecorder } from 'react-media-recorder'
import { Filter } from '../../util/Filter'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      borderRadius: theme.spacing(1),
      maxWidth: 500,
    },
    marginTop: {
      marginTop: theme.spacing(3),
    },
  }),
)

export const AddSpeechModal: React.FC = () => {
  const api = new ApiClient()
  const classes = useStyles()
  const [open, setOpen] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState<string>('')
  const [isValid, setIsValid] = useState<boolean>(false)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [blobUrl, setBlobUrl] = useState<string>()
  const [tabIndex, setTabIndex] = useState<number>(0)
  const [pitchData, setPitchData] = useState<string>()
  const [isCalculatedPitch, setIsCalculatedPitch] = useState<boolean>(false)
  const [isCalculatingPitch, setIsCalculatingPitch] = useState<boolean>(false)
  const audioContext = new AudioContext()
  const samplingRate = audioContext.sampleRate
  const workerRef = useRef<Worker>()
  const FXRATE = 200
  const { startRecording, stopRecording } = useReactMediaRecorder({
    audio: true,
    onStop: (blobUrl: string, blob: Blob) => {
      setFile(new File([blob], 'recorded.wemb', { type: 'audio/webm' }))
      setBlobUrl(blobUrl)
      setIsRecording(false)
    },
  })
  const setAddedSpeech = useSetRecoilState<TeacherSpeech | null>(addedSpeechState)
  useEffect(() => {
    setIsValid(file !== null && 0 < text.length && text.length <= 1000 && isCalculatedPitch)
  }, [file, text, isCalculatedPitch])
  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) setFile(event.target.files[0])
  }
  const onChangeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
  }
  const handleRegister = async () => {
    if (file !== null && pitchData !== undefined) {
      const res = await api.registerTeacherSpeech(text, file, pitchData)
      if (res !== undefined) {
        setAddedSpeech(res)
        setOpen(false)
      }
    }
  }
  const onClickRecordButton = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
      setIsRecording(true)
    }
  }
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    workerRef.current?.terminate()
    setIsCalculatingPitch(false)
    setTabIndex(newValue)
  }
  useEffect(() => {
    if (file) {
      file.arrayBuffer().then((data) => {
        setIsCalculatingPitch(true)
        workerRef.current = new Worker(new URL('../../util/pitch.worker', import.meta.url))
        audioContext.decodeAudioData(data, function onSuccess(buffer: any) {
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
          // workerスレッドから終了メッセージを受信した際の動作
          workerRef.current!.onmessage = (event) => {
            const pitchData = []
            for (i = 0; i < fsignal.length; i++) {
              if (event.data.vs[i] > 0.3) {
                pitchData.push({
                  x: Math.round((i / FXRATE) * 100) / 100,
                  y: Math.round(event.data.fx[i] * 100) / 100,
                })
              }
            }
            setPitchData(JSON.stringify({ data: pitchData, xmax: fsignal.length / samplingRate }))
            setIsCalculatedPitch(true)
            setIsCalculatingPitch(false)
          }
          // workerスレッドを開始
          workerRef.current!.postMessage({ signal: ffsignal, srate: samplingRate / 3 })
        })
      })
    }
    return () => {
      workerRef.current?.terminate()
    }
  }, [file])

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        disableElevation
      >
        新規追加
      </Button>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Typography variant="h5" gutterBottom>
              新規教師音声登録
            </Typography>
            <div className={classes.marginTop}>
              <Typography variant="subtitle2" gutterBottom>
                1.音声ファイル（mp3形式）を選択するか、録音ボタンを押して録音して下さい。
              </Typography>
              <Tabs
                value={tabIndex}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleTabChange}
                aria-label="disabled tabs example"
              >
                <Tab label="ファイルを選択する" />
                <Tab label="録音する" />
              </Tabs>
              {tabIndex === 0 && (
                <div className="text-center">
                  <Button className="mb-4 mt-4" variant="outlined" color="primary">
                    <input
                      type="file"
                      className="appearance-none"
                      onChange={onSelectFile}
                      accept="audio/mp3"
                    />
                  </Button>
                </div>
              )}
              {tabIndex === 1 && (
                <div className="mt-4 text-center">
                  <Button
                    className="mr-4"
                    onClick={onClickRecordButton}
                    style={{ display: 'inline' }}
                    variant="contained"
                    color="primary"
                    disableElevation
                  >
                    {isRecording ? <StopIcon /> : <MicIcon />}
                    {isRecording ? '停止' : '録音'}
                  </Button>
                  <audio controls src={blobUrl} style={{ display: 'inline' }}></audio>
                </div>
              )}
              {isCalculatingPitch && (
                <Typography variant="subtitle2" gutterBottom align="center" color="textSecondary">
                  音声の前処理をしています。
                  <CircularProgress size={10} />
                </Typography>
              )}
            </div>
            <div className={classes.marginTop}>
              <Typography variant="subtitle2" gutterBottom>
                2.音声の内容（スクリプト）を入力してください。
              </Typography>
              <textarea
                className="w-full p-2 mb-4 border-2 resize-none"
                style={{ overflow: 'auto', minHeight: 150 }}
                placeholder="スクリプト"
                onChange={onChangeText}
              />
            </div>
            <div className="text-center">
              <Button
                className="mr-2"
                variant="contained"
                color="primary"
                onClick={handleRegister}
                disabled={!isValid}
                disableElevation
              >
                登録
              </Button>
              <Button variant="outlined" color="primary" onClick={handleClose} disableElevation>
                キャンセル
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
    </>
  )
}
