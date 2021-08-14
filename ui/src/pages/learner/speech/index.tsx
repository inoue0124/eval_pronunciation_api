/* eslint-disable */
import React, { useState, useEffect } from 'react'
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
import { LearnerSpeechListTable } from '../../../components/learner/LearnerSpeechListTable'
import { Learner } from '../../../types/Learner'
import ApiClient from '../../../api'
import { getCookie } from '../../../util/cookie'
import { UserType } from '../../../types/UserType'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
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
  const [learner, setLearner] = useState<Learner>()
  useEffect(() => {
    if (router.isReady) {
      const logged_user = getCookie().logged_user
      // 未ログインの場合はログインページへ遷移
      if (!logged_user) {
        router.push(`/learner/login`)
        return
      }
      ;(async function () {
        try {
          const learner = await api.getLearnerById(JSON.parse(logged_user).id)
          if (learner != undefined) {
            setLearner(learner)
          }
        } catch (e) {
          alert(e)
        }
      })()
    }
  }, [setLearner, router.query])

  return (
    <div className={classes.root}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/learner/unit/list">
          ← 課題一覧へ戻る
        </Link>
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
              GOP平均：{learner.gop_average ? Math.round(learner.gop_average * 100) / 100 : '-'}
            </Typography>
            <Typography color="textPrimary">
              DTW平均：{learner.dtw_average ? Math.round(learner.dtw_average * 100) / 100 : '-'}
            </Typography>
            <Typography color="textPrimary">
              作成日時：{new Date(learner.created_at).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      )}

      {router.isReady && learner && (
        <LearnerSpeechListTable
          userType={UserType.Learner}
          learnerId={learner.user_id}
          speeches={learner.speeches}
        />
      )}
    </div>
  )
}

export default LearnerDetail
