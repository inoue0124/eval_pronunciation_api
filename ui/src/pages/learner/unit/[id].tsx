/* eslint-disable */
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { Card, CardContent, createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
import ApiClient from '../../../api'
import { Unit } from '../../../types/Unit'
import { getCookie } from '../../../util/cookie'
import { NextPage } from 'next'
import { User } from '../../../types/User'
const WaveDisplay = dynamic<any>(
  () => import('../../../components/WaveDisplay').then((module) => module.WaveDisplay),
  { ssr: false },
)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
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
  useEffect(() => {
    setUser(JSON.parse(getCookie().logged_user))
    if (router.isReady) {
      // 未ログインの場合はログインページへ遷移
      if (!user) {
        router.push(`/learner/login?unit=${unitId}&ti=${teacherId}`)
        return
      }
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

  return (
    <>
      {unit && (
        <Card className={classes.card}>
          <CardContent>
            <Typography color="textPrimary">課題ID：{unit.id}</Typography>
            <Typography color="textPrimary">課題名：{unit.name}</Typography>
            <Typography color="textPrimary">
              作成日時：{new Date(unit.created_at).toLocaleString()}
            </Typography>
          </CardContent>
          <WaveDisplay
            url={'https://eval-speech.s3.ap-northeast-1.amazonaws.com/shadowing_2.MP3'}
          />
        </Card>
      )}
    </>
  )
}

export default UnitDetail
