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
import { TeacherSpeechListTable } from '../../../components/teacher/speech/TeacherSpeechListTable'
import ApiClient from '../../../api'
import { Unit } from '../../../types/Unit'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
  }),
)

const UnitDetail: React.FC = () => {
  const api = new ApiClient()
  const classes = useStyles()
  const router = useRouter()
  const unitId = Number(router.query.id)
  const [unit, setUnit] = useState<Unit>()
  useEffect(() => {
    if (router.isReady) {
      ;(async function () {
        const unit = await api.getUnitById(unitId)
        if (unit != undefined) {
          setUnit(unit)
        }
      })()
    }
  }, [setUnit, router.query])

  return (
    <SideMenu>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/teacher/unit">
          課題一覧
        </Link>
        <Typography color="textPrimary">課題ID:{unitId}</Typography>
      </Breadcrumbs>

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

      {router.isReady && unit && (
        <TeacherSpeechListTable teacherId={18} speeches={unit.teacher_speeches} />
      )}
    </SideMenu>
  )
}

export default UnitDetail
