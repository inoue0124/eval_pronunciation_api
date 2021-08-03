/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { SideMenu } from '../../../layout/teacher'
import { useRouter } from 'next/router'
import {
  Breadcrumbs,
  Card,
  CardContent,
  createStyles,
  Link,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import { LearnerSpeechListTable } from '../../../components/teacher/learner/LearnerSpeechListTable'
import { Learner } from '../../../types/Learner'
import ApiClient from '../../../api'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
  }),
)

const LearnerDetail: React.FC = () => {
  const api = new ApiClient()
  const classes = useStyles()
  const router = useRouter()
  const learnerId = Number(router.query.id)
  const [learner, setLearner] = useState<Learner>()
  useEffect(() => {
    if (router.isReady) {
      ;(async function () {
        const learner = await api.getLearnerById(learnerId)
        if (learner != undefined) {
          setLearner(learner)
        }
      })()
    }
  }, [setLearner, router.query])

  return (
    <SideMenu>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/teacher/learner">
          学習者一覧
        </Link>
        <Typography color="textPrimary">学習者ID:{learnerId}</Typography>
      </Breadcrumbs>

      {learner && (
        <Card className={classes.card}>
          <CardContent>
            <Typography color="textPrimary">学習者ID：{learner.user_id}</Typography>
            <Typography color="textPrimary">教師ID：{learner.teacher_id}</Typography>
            <Typography color="textPrimary">名前：{learner.name}</Typography>
            <Typography color="textPrimary">性別：{learner.gender}</Typography>
            <Typography color="textPrimary">年齢：{learner.birth_date}</Typography>
            <Typography color="textPrimary">出身地：{learner.birth_place}</Typography>
            <Typography color="textPrimary">学習年数：{learner.year_of_learning}</Typography>
            <Typography color="textPrimary">
              作成日時：{new Date(learner.created_at).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      )}

      {router.isReady && learner && (
        <LearnerSpeechListTable learnerId={learnerId} speeches={learner.speeches} />
      )}
    </SideMenu>
  )
}

export default LearnerDetail
