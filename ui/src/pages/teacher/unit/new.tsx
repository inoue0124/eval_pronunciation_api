import { useRouter } from 'next/router'
import { TeacherSpeechListTable } from '../../../components/teacher/speech/TeacherSpeechListTable'
import { Button, Typography, TextField, makeStyles, Theme, createStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import { SideMenu } from '../../../layout/teacher'
import React, { useState, useEffect } from 'react'
import { AddSpeechModal } from '../../../components/teacher/speech/AddSpeechModal'
import ApiClient from '../../../api'
import { selectedSpeechIdsState } from '../../../states/addUnit/selectedSpeechIdsState'
import { useRecoilState } from 'recoil'
import { unitNameState } from '../../../states/addUnit/unitNameState'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    marginTop: {
      marginTop: theme.spacing(3),
    },
  }),
)

const RegisterUnit: React.FC = () => {
  const api = new ApiClient()
  const classes = useStyles()
  const router = useRouter()
  const [selectedSpeechIds, setSelectedSpeechIds] = useRecoilState(selectedSpeechIdsState)
  const [name, setName] = useRecoilState(unitNameState)
  const [isValid, setIsValid] = useState<boolean>(false)
  const handleRegister = async (_: React.MouseEvent<HTMLButtonElement>) => {
    const unit = await api.registerUnit(name, selectedSpeechIds)
    if (unit === undefined) {
      alert('エラーが発生しました。')
      return
    }
    router.push(`/teacher/unit/${unit.id}`)
    setSelectedSpeechIds([])
    setName('')
  }
  const handleClose = (_: React.MouseEvent<HTMLButtonElement>) => {
    router.back()
  }
  useEffect(() => {
    setIsValid(name !== '' && selectedSpeechIds.length !== 0)
  }, [name, selectedSpeechIds])

  return (
    <SideMenu>
      <Grid container direction="row" justify="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            新規課題登録
          </Typography>
        </Grid>
        <Grid item>
          <Button
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
        <TeacherSpeechListTable teacherId={18} />
      </div>
    </SideMenu>
  )
}

export default RegisterUnit
