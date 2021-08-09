/* eslint-disable */
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
} from '@material-ui/core'
import ApiClient from '../../../api'
import { Unit } from '../../../types/Unit'
import { getCookie } from '../../../util/cookie'
import { NextPage } from 'next'
import { User } from '../../../types/User'
import MicIcon from '@material-ui/icons/Mic'
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
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [isShowText, setIsShowText] = useState<boolean>(false)
  const [speechIndex, setSpeechIndex] = useState<number>(0)
  const teacherWavRef = useRef<any>(null)
  const learnerWavRef = useRef<any>(null)
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    audio: true,
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

  const onClickStartRepeating = () => {
    setIsRepeating(true)
    setIsRecording(true)
    teacherWavRef.current!.play()
  }
  const onClickStartShadowing = () => {
    setIsRepeating(false)
    startRecording()
    setIsRecording(true)
    teacherWavRef.current!.play()
  }
  const onClickStopRecording = () => {
    stopRecording()
    setIsRecording(false)
    teacherWavRef.current!.stop()
  }
  const onClickShowText = () => {
    setIsShowText(!isShowText)
  }
  const onClickNext = () => {
    setSpeechIndex(speechIndex + 1)
  }

  const LearnerWav = useMemo(() => {
    return (
      <Card className={classes.card}>
        <WaveDisplay
          isDisabled={isRecording}
          label="あなたの音声"
          fn_ref={learnerWavRef}
          url={mediaBlobUrl}
        />
      </Card>
    )
  }, [mediaBlobUrl])

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
              disabled={isRecording}
            >
              リピーティング開始
            </Button>
            <Button
              className={classes.toolbarButton}
              variant="contained"
              color="primary"
              onClick={onClickStartShadowing}
              disableElevation
              disabled={isRecording}
            >
              シャドーイング開始
            </Button>
            <Button
              className={classes.toolbarButton}
              variant="contained"
              color="primary"
              onClick={onClickStopRecording}
              disableElevation
              disabled={!isRecording}
            >
              録音停止
            </Button>
            <Button
              className={classes.toolbarButton}
              variant="contained"
              color="primary"
              onClick={onClickShowText}
              disableElevation
            >
              テキスト表示
            </Button>
            <Button
              className={classes.toolbarButton}
              variant="contained"
              color="primary"
              onClick={onClickNext}
              disableElevation
              disabled={isRecording}
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
              isDisabled={isRecording}
              label="先生の音声"
              fn_ref={teacherWavRef}
              url={'https://eval-speech.s3.ap-northeast-1.amazonaws.com/shadowing_2.MP3'}
              onFinishPlaying={isRepeating ? startRecording : stopRecording}
            />
          </Card>

          {mediaBlobUrl && mediaBlobUrl !== prevMediaBlobUrl && !isRecording && (
            <Card className={classes.card}>
              <WaveDisplay label="あなたの音声" fn_ref={learnerWavRef} url={mediaBlobUrl} />
            </Card>
          )}
          {mediaBlobUrl && mediaBlobUrl === prevMediaBlobUrl && !isRecording && LearnerWav}
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
