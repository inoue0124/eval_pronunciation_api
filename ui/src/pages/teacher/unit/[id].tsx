import React, { useState, useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { SideMenu } from '../../../layout/teacher'
import { useRouter } from 'next/router'
import {
  Breadcrumbs,
  Card,
  CardActions,
  CardContent,
  createStyles,
  IconButton,
  Link,
  makeStyles,
  Snackbar,
  Theme,
  Typography,
} from '@material-ui/core'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import DoneIcon from '@material-ui/icons/Done'
import { TeacherSpeechListTable } from '../../../components/teacher/speech/TeacherSpeechListTable'
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
  const [unit, setUnit] = useState<Unit>()
  const [distributeUrl, setDistributeUrl] = useState<string>('')
  const [isCopied, setIsCopied] = useState<boolean>(false)
  useEffect(() => {
    if (router.isReady) {
      ;(async function () {
        try {
          const unit = await api.getUnitById(unitId)
          setUnit(unit)
        } catch (e) {
          alert(`予期せぬエラーが発生しました。:${e}`)
        }
      })()
    }
    setDistributeUrl(`http://localhost:3000/learner/unit/${unitId}?ti=${user.id}`)
  }, [router.query])

  const handleCopyUrl = () => {
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

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
          <CardActions>
            <Typography color="textPrimary">課題配布用URL：</Typography>
            {distributeUrl}
            <CopyToClipboard text={distributeUrl} onCopy={handleCopyUrl}>
              <IconButton aria-label="copy">
                {isCopied ? <DoneIcon /> : <FileCopyIcon />}
              </IconButton>
            </CopyToClipboard>
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              open={isCopied}
              autoHideDuration={2000}
              message="URLをコピーしました！"
            />
          </CardActions>
        </Card>
      )}

      {router.isReady && unit && (
        <TeacherSpeechListTable teacherId={user.id} speeches={unit.teacher_speeches} />
      )}
    </SideMenu>
  )
}

UnitDetail.getInitialProps = (ctx) => {
  const user = JSON.parse(getCookie(ctx).logged_user)
  return { user: user }
}

export default UnitDetail
