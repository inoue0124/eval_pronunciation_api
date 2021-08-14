/* eslint-disable */
import axios from 'axios'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import {
  Button,
  Card,
  createStyles,
  makeStyles,
  Theme,
  Typography,
  LinearProgress,
  CircularProgress,
} from '@material-ui/core'
import ApiClient from '../../../api'
import { Unit } from '../../../types/Unit'
import { getCookie } from '../../../util/cookie'
import { NextPage } from 'next'
import { User } from '../../../types/User'
import MicIcon from '@material-ui/icons/Mic'
import { useRecoilValue } from 'recoil'
import { pitchDataState } from '../../../states/graphData/pitchDataState'
const WaveDisplay = dynamic<any>(
  () => import('../../../components/WaveDisplay').then((module) => module.WaveDisplay),
  { ssr: false },
)

function usePrevious(value: any) {
  const ref = useRef(null)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      margin: theme.spacing(2),
      padding: theme.spacing(2),
    },
    cardTitle: {
      marginBottom: theme.spacing(1),
    },
    toolbarButton: {
      marginRight: theme.spacing(1),
    },
    recordingIndicatorWrapper: {
      textAlign: 'center',
      margin: 'auto',
      width: '100px',
    },
  }),
)

const UnitDetail: NextPage = () => {
  const api = new ApiClient()
  const classes = useStyles()
  const router = useRouter()
  const unitId = Number(router.query.id)
  const teacherId = Number(router.query.ti)
  const [user, setUser] = useState<User>()
  const [unit, setUnit] = useState<Unit>()
  const [isRepeating, setIsRepeating] = useState<boolean>(true)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [isRecorded, setIsRecorded] = useState<boolean>(false)
  const [isShowText, setIsShowText] = useState<boolean>(false)
  const [isCaluculatingScore, setIsCalculatingScore] = useState<boolean>(false)
  const [isCalculatedScore, setIsCalculatedScore] = useState<boolean>(false)
  const [speechIndex, setSpeechIndex] = useState<number>(0)
  const [audioBlob, setAudioBlob] = useState<Blob>()
  const [gop, setGop] = useState<number>()
  const [gopSeq, setGopSeq] = useState<number[]>()
  const [dtw, setDtw] = useState<number>()
  const teacherWavRef = useRef<any>(null)
  const learnerWavRef = useRef<any>(null)
  const pitchData = useRecoilValue(pitchDataState)
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    audio: true,
    onStop: (_: string, blob: Blob) => {
      setAudioBlob(blob)
    },
  })
  const prevMediaBlobUrl = usePrevious(mediaBlobUrl)

  useEffect(() => {
    if (router.isReady) {
      const logged_user = getCookie().logged_user
      // 未ログインの場合はログインページへ遷移
      if (!logged_user) {
        router.push(`/learner/login?unit=${unitId}&ti=${teacherId}`)
        return
      }
      setUser(JSON.parse(logged_user))
      ;(async function () {
        try {
          const unit = await api.getUnitById(unitId)
          setUnit(unit)
        } catch (e) {
          alert(`予期せぬエラーが発生しました。:${e}`)
          router.push(`/learner/login?unit=${unitId}&ti=${teacherId}`)
        }
      })()
    }
  }, [router.query])

  useEffect(() => {
    if (gop !== undefined && dtw !== undefined) {
      setIsCalculatedScore(true)
    } else {
      setIsCalculatedScore(false)
    }
  }, [gop, dtw])

  const onClickStartRepeating = () => {
    setIsRepeating(true)
    setIsRecorded(false)
    teacherWavRef.current!.play()
    setIsPlaying(true)
  }
  const onClickStartShadowing = () => {
    setGop(undefined)
    setDtw(undefined)
    setIsRepeating(false)
    startRecording()
    setIsRecording(true)
    teacherWavRef.current!.play()
  }
  const onClickStopRecording = () => {
    setGop(undefined)
    setDtw(undefined)
    if (isPlaying) setIsPlaying(false)
    if (isRecording) {
      stopRecording()
      setIsRecording(false)
      setIsRecorded(true)
    }
    teacherWavRef.current!.stop()
  }
  const onClickShowText = () => {
    setIsShowText(!isShowText)
  }
  const onClickStartScoring = () => {
    if (audioBlob !== undefined) {
      setGop(undefined)
      setDtw(undefined)
      calculateGop(audioBlob)
      calculateDtw(audioBlob)
      setIsCalculatingScore(true)
    }
  }
  const onClickNext = async () => {
    // 音声アップロード
    if (unit !== undefined && audioBlob !== undefined && gop !== undefined && dtw !== undefined) {
      await api.registerLearnerSpeech(
        unit.id,
        unit.teacher_speeches[speechIndex].id,
        isRepeating ? 1 : 2,
        audioBlob,
        gop,
        dtw,
        JSON.stringify(gopSeq),
        pitchData,
      )
    }
    // 最後の課題の場合は終了画面へ
    if (speechIndex + 1 === unit?.teacher_speeches.length) {
      router.push(`/learner/finish`)
      return
    }
    setIsRecorded(false)
    setGop(undefined)
    setDtw(undefined)
    setSpeechIndex(speechIndex + 1)
  }

  const LearnerWav = useMemo(() => {
    return (
      <Card className={classes.card}>
        <WaveDisplay
          isDisableToolbar={isRecording || isPlaying}
          label="あなたの音声"
          fn_ref={learnerWavRef}
          url={mediaBlobUrl}
          isShowScore={true}
          gop={gop}
          dtw={dtw}
          gopSeq={gopSeq}
        />
      </Card>
    )
  }, [mediaBlobUrl, gop, dtw, gopSeq])

  const calculateGop = (blob: Blob) => {
    api
      .calculateGop(unit!.teacher_speeches[speechIndex].text, blob)
      .then((gop) => {
        setGop(Math.round(gop.frame_based_mean * 100) / 100) // 少数第２位で表示するための計算
        setGopSeq(gop.sequence)
      })
      .catch(() => setGop(0))
  }

  const calculateDtw = (blob: Blob) => {
    axios
      .get(unit!.teacher_speeches[speechIndex].object_key, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'audio/mpeg',
        },
      })
      .then((response: any) => {
        api
          .calculateDtw(new Blob([response.data]), blob)
          .then((dtw) => {
            setDtw(Math.round(dtw.frame_based_mean * 100) / 100) // 少数第２位で表示するための計算
            setIsCalculatingScore(false)
          })
          .catch(() => setDtw(0))
      })
      .catch(() => setDtw(0))
  }

  return (
    <>
      {unit && (
        <>
          <Card className={classes.card}>
            <Typography color="textPrimary">課題ID：{unit.id}</Typography>
            <Typography color="textPrimary">課題名：{unit.name}</Typography>
            <Typography color="textPrimary" style={{ marginBottom: '10px' }}>
              作成日時：{new Date(unit.created_at).toLocaleString()}
            </Typography>
            <Button
              className={classes.toolbarButton}
              variant="contained"
              color="primary"
              onClick={onClickStartRepeating}
              disableElevation
              disabled={isRecording || isPlaying || isCaluculatingScore}
            >
              リピーティング開始
            </Button>
            <Button
              className={classes.toolbarButton}
              variant="contained"
              color="primary"
              onClick={onClickStartShadowing}
              disableElevation
              disabled={isRecording || isPlaying || isCaluculatingScore}
            >
              シャドーイング開始
            </Button>
            <Button
              className={classes.toolbarButton}
              variant="contained"
              color="primary"
              onClick={onClickStopRecording}
              disableElevation
              disabled={!(isRecording || isPlaying)}
            >
              録音停止
            </Button>
            <Button
              className={classes.toolbarButton}
              variant="contained"
              color="primary"
              onClick={onClickShowText}
              disableElevation
              disabled={isRecording}
            >
              テキスト表示
            </Button>
            <Button
              className={classes.toolbarButton}
              variant="contained"
              color="primary"
              onClick={onClickStartScoring}
              disableElevation
              disabled={isRecording || !isRecorded || isCaluculatingScore || isCalculatedScore}
            >
              {isCaluculatingScore && <CircularProgress size={20} style={{ marginRight: 10 }} />}
              {isCaluculatingScore ? 'スコア計算中' : 'スコア計算'}
            </Button>
            <Button
              className={classes.toolbarButton}
              variant="contained"
              color="primary"
              onClick={onClickNext}
              disableElevation
              disabled={isRecording || !isRecorded || !isCalculatedScore}
            >
              次の課題へ
            </Button>
          </Card>
          {isShowText && (
            <Card className={classes.card}>
              <Typography color="textPrimary" variant="h5" align="center">
                {unit.teacher_speeches[speechIndex].text}
              </Typography>
            </Card>
          )}
          <Card className={classes.card}>
            <WaveDisplay
              isDisableToolbar={isRecording || isPlaying}
              label="先生の音声"
              fn_ref={teacherWavRef}
              url={unit.teacher_speeches[speechIndex].object_key}
              onFinishPlaying={
                isRepeating
                  ? () => {
                      setIsPlaying(false)
                      startRecording()
                      setIsRecording(true)
                      setGop(undefined)
                      setDtw(undefined)
                    }
                  : () => {
                      stopRecording()
                      setIsRecording(false)
                      setIsRecorded(true)
                    }
              }
            />
          </Card>

          {mediaBlobUrl && mediaBlobUrl !== prevMediaBlobUrl && !isRecording && isRecorded && (
            <Card className={classes.card}>
              <WaveDisplay
                isDisableToolbar={isRecording || isPlaying}
                label="あなたの音声"
                fn_ref={learnerWavRef}
                url={mediaBlobUrl}
                isShowScore={true}
                gop={gop}
                dtw={dtw}
                gopSeq={gopSeq}
              />
            </Card>
          )}
          {mediaBlobUrl &&
            mediaBlobUrl === prevMediaBlobUrl &&
            !isRecording &&
            isRecorded &&
            LearnerWav}
          {isRecording && (
            <Card className={classes.recordingIndicatorWrapper}>
              <MicIcon style={{ fontSize: 40 }} />
              <Typography variant="caption" display="block" gutterBottom>
                録音中
              </Typography>
              <LinearProgress color="secondary" />
            </Card>
          )}
        </>
      )}
    </>
  )
}

export default UnitDetail
