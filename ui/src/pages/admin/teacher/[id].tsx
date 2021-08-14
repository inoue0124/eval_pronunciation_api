/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { SideMenu } from '../../../layout/admin'
import { useRouter } from 'next/router'
import {
  Breadcrumbs,
  Card,
  CardContent,
  createStyles,
  Link,
  makeStyles,
  Tab,
  Tabs,
  Theme,
  Typography,
} from '@material-ui/core'
import ApiClient from '../../../api'
import { UnitListTable } from '../../../components/unit/UnitListTable'
import { LearnerListTable } from '../../../components/learner/LearnerListTable'
import { Teacher } from '../../../types/Teacher'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
  }),
)

const TeacherDetail: React.FC = () => {
  const api = new ApiClient()
  const classes = useStyles()
  const router = useRouter()
  const teacherId = Number(router.query.id)
  const [teacher, setTeacher] = useState<Teacher>()
  const [tabIndex, setTabIndex] = useState<number>(0)
  useEffect(() => {
    if (router.isReady) {
      ;(async function () {
        try {
          const teacher = await api.getTeacherById(teacherId)
          if (teacher != undefined) {
            setTeacher(teacher)
          }
        } catch (e) {
          alert(e)
        }
      })()
    }
  }, [setTeacher, router.query])

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue)
  }

  return (
    <SideMenu>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href={'/admin/teacher'}>
          教師一覧
        </Link>
        <Typography color="textPrimary">教師ID:{teacherId}</Typography>
      </Breadcrumbs>

      {teacher && (
        <Card className={classes.card}>
          <CardContent>
            <Typography color="textPrimary">教師ID：{teacher.user_id}</Typography>
            <Typography color="textPrimary">名前：{teacher.name}</Typography>
            <Typography color="textPrimary">性別：{teacher.gender}</Typography>
            <Typography color="textPrimary">年齢：{teacher.birth_date}</Typography>
            <Typography color="textPrimary">出身地：{teacher.birth_place}</Typography>
            <Typography color="textPrimary">
              作成日時：{new Date(teacher.created_at).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Tabs
        value={tabIndex}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleTabChange}
        aria-label="disabled tabs example"
      >
        <Tab label="課題一覧" />
        <Tab label="学習者一覧" />
      </Tabs>

      {router.isReady && tabIndex === 0 && <UnitListTable isAdmin={true} teacherId={teacherId} />}
      {router.isReady && tabIndex === 1 && (
        <LearnerListTable isAdmin={true} teacherId={teacherId} />
      )}
    </SideMenu>
  )
}

export default TeacherDetail
