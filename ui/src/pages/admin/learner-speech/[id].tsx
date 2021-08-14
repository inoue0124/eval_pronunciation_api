/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react'
import { SideMenu } from '../../../layout/admin'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import {
  Card,
  createStyles,
  makeStyles,
  Theme,
  Typography,
  Breadcrumbs,
  Link,
} from '@material-ui/core'
import ApiClient from '../../../api'
import { Unit } from '../../../types/Unit'
import { NextPage } from 'next'
import { LearnerSpeech } from '../../../types/LearnerSpeech'
import { TeacherSpeech } from '../../../types/TeacherSpeech'
const WaveDisplay = dynamic<any>(
  () => import('../../../components/WaveDisplay').then((module) => module.WaveDisplay),
  { ssr: false },
)

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

const SpeechDetail: NextPage = () => {
  const api = new ApiClient()
  const classes = useStyles()
  const router = useRouter()
  const speechId = Number(router.query.id)
  const [learnerSpeech, setLearnerSpeech] = useState<LearnerSpeech>()
  const [teacherSpeech, setTeacherSpeech] = useState<TeacherSpeech>()
  const [unit, setUnit] = useState<Unit>()
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const teacherWavRef = useRef<any>(null)
  const learnerWavRef = useRef<any>(null)

  useEffect(() => {
    if (router.isReady) {
      ;(async function () {
        try {
          const learnerSpeech = await api.getLearnerSpeecheById(speechId)
          const unit = await api.getUnitById(learnerSpeech!.unit_id)
          setLearnerSpeech(learnerSpeech)
          setTeacherSpeech(
            unit.teacher_speeches.find(
              (teacherSpeech) => teacherSpeech.id === learnerSpeech!.teacher_speech_id,
            ),
          )
          setUnit(unit)
        } catch (e) {
          alert(`予期せぬエラーが発生しました。:${e}`)
        }
      })()
    }
  }, [router.query])

  return (
    <SideMenu>
      {unit && learnerSpeech && (
        <>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/admin/learner-speech">
              学習者音声一覧
            </Link>
            <Typography color="textPrimary">音声ID:{speechId}</Typography>
          </Breadcrumbs>
          <Card className={classes.card}>
            <Typography color="textPrimary">
              課題ID：
              <Link href={`/admin/unit/${unit.id}`}>{unit.id}</Link>
            </Typography>
            <Typography color="textPrimary">課題名：{unit.name}</Typography>
            <Typography color="textPrimary">
              教師音声ID：{teacherSpeech && teacherSpeech.id}
            </Typography>
            <Typography color="textPrimary">学習者ID：{learnerSpeech.learner_id}</Typography>
            <Typography color="textPrimary">
              録音日時：{new Date(learnerSpeech.created_at).toLocaleString()}
            </Typography>
            <Typography color="textPrimary">
              録音タイプ：
              {learnerSpeech.type === 1 && 'リピーティング'}
              {learnerSpeech.type === 2 && 'シャドーイング'}
            </Typography>
          </Card>
          <Card className={classes.card}>
            {teacherSpeech && (
              <Typography color="textPrimary" variant="h5" align="center">
                {teacherSpeech.text}
              </Typography>
            )}
          </Card>
          {teacherSpeech && (
            <Card className={classes.card}>
              <WaveDisplay
                isDisableToolbar={isPlaying}
                label="教師の音声"
                fn_ref={teacherWavRef}
                url={teacherSpeech.object_key}
                onFinishPlaying={() => {
                  setIsPlaying(false)
                }}
                pitchDataProp={JSON.parse(teacherSpeech.pitch_seq)}
              />
            </Card>
          )}

          <Card className={classes.card}>
            <WaveDisplay
              isDisableToolbar={isPlaying}
              label="学生の音声"
              fn_ref={learnerWavRef}
              url={learnerSpeech.object_key}
              isShowScore={true}
              gop={learnerSpeech.gop_average}
              dtw={learnerSpeech.dtw_average}
              gopSeq={JSON.parse(learnerSpeech.gop_seq)}
              pitchDataProp={JSON.parse(learnerSpeech.pitch_seq)}
            />
          </Card>
        </>
      )}
    </SideMenu>
  )
}

export default SpeechDetail
