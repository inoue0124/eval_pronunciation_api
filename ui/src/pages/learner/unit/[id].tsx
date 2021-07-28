import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Card, CardContent, createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
import ApiClient from '../../../api'
import { Unit } from '../../../types/Unit'
import { getCookie } from '../../../util/cookie'
import { NextPage } from 'next'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
  }),
)

const UnitDetail: NextPage = ({ user }) => {
  const api = new ApiClient()
  const classes = useStyles()
  const router = useRouter()
  const unitId = Number(router.query.id)
  const teacherId = Number(router.query.ti)
  const [unit, setUnit] = useState<Unit>()
  useEffect(() => {
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
        </Card>
      )}
    </>
  )
}

UnitDetail.getInitialProps = (ctx) => {
  const logged_user = getCookie(ctx).logged_user
  if (!logged_user) return {}
  const user = JSON.parse(logged_user)
  return { user: user }
}

export default UnitDetail
