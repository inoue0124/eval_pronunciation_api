import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { TeacherSpeechListTable } from '../../../components/speech/TeacherSpeechListTable'
import { Button, Typography, TextField, makeStyles, Theme, createStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import { SideMenu } from '../../../layout/teacher'
import dynamic from 'next/dynamic'
const AddSpeechModal = dynamic<any>(
  () =>
    import('../../../components/speech/AddSpeechModal').then((modules) => modules.AddSpeechModal),
  { ssr: false },
)
import ApiClient from '../../../api'
import { selectedSpeechIdsState } from '../../../states/addUnit/selectedSpeechIdsState'
import { useRecoilState } from 'recoil'
import { unitNameState } from '../../../states/addUnit/unitNameState'
import { getCookie } from '../../../util/cookie'
import { User } from '../../../types/User'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    marginTop: {
      marginTop: theme.spacing(3),
    },
  }),
)

const RegisterUnit: React.FC = () => {
  const api = new ApiClient()
  const [user, setUser] = useState<User>()
  useEffect(() => {
    setUser(JSON.parse(getCookie().logged_user))
  }, [])
  const classes = useStyles()
  const router = useRouter()
  const [selectedSpeechIds, setSelectedSpeechIds] = useRecoilState(selectedSpeechIdsState)
  const [name, setName] = useRecoilState(unitNameState)
  const [isValid, setIsValid] = useState<boolean>(false)
  const handleRegister = async () => {
    const unit = await api.registerUnit(name, selectedSpeechIds)
    if (unit === undefined) {
      alert('エラーが発生しました。')
      return
    }
    router.push(`/teacher/unit/${unit.id}`)
    setSelectedSpeechIds([])
    setName('')
  }
  const handleClose = () => {
    router.back()
  }
  useEffect(() => {
    setIsValid(name !== '' && selectedSpeechIds.length !== 0)
  }, [name, selectedSpeechIds])

  return (
    <SideMenu>
      <Grid container direction="row" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            新規課題登録
          </Typography>
        </Grid>
        <Grid item>
          <Button
            className="mr-2"
            variant="contained"
            color="primary"
            onClick={handleRegister}
            disabled={!isValid}
            disableElevation
          >
            課題作成
          </Button>
          <Button variant="outlined" color="primary" onClick={handleClose} disableElevation>
            キャンセル
          </Button>
        </Grid>
      </Grid>
      <div className={classes.marginTop}>
        <Typography variant="h6" gutterBottom>
          1.課題名を入力してください。
        </Typography>
        <TextField
          className="w-full"
          variant="outlined"
          value={name}
          onChange={(event) => {
            setName(event.target.value)
          }}
        />
      </div>
      <div className={classes.marginTop}>
        <Grid container direction="row">
          <Grid item>
            <Typography variant="h6" gutterBottom>
              2.音声を選択して下さい。
            </Typography>
          </Grid>
          <Grid item>
            <AddSpeechModal />
          </Grid>
        </Grid>
        {user && <TeacherSpeechListTable isAdmin={false} teacherId={user.id} />}
      </div>
    </SideMenu>
  )
}

export default RegisterUnit
