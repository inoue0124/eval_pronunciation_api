import { useState, useEffect } from 'react'
import ApiClient from '../../../api'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import { Button, TextField } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import { SpeechListTable } from '../speech/SpeechListTable'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      borderRadius: theme.spacing(1),
    },
  }),
)

export const AddUnitModal: React.FC = () => {
  const api = new ApiClient()
  const classes = useStyles()
  const [open, setOpen] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState<string>('')
  const [isValid, setIsValid] = useState<boolean>(false)
  useEffect(() => {
    setIsValid(file !== null && 0 < text.length && text.length <= 1000)
  }, [file, text])
  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) setFile(event.target.files[0])
  }
  const onChangeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
  }
  const handleRegister = async () => {
    await api.registerTeacherSpeech(text, file!)
    setOpen(false)
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        disableElevation
      >
        新規追加
      </Button>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Typography variant="h5" gutterBottom>
              新規課題登録
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              1.課題名を入力してください。
            </Typography>
            <TextField className="w-full" variant="outlined" />
            <Typography variant="subtitle2" gutterBottom>
              2.音声を選択して下さい。
            </Typography>
            <SpeechListTable />
            <div className="text-center">
              <Button
                className="mr-2"
                variant="contained"
                color="primary"
                onClick={handleRegister}
                disabled={!isValid}
                disableElevation
              >
                登録
              </Button>
              <Button variant="outlined" color="primary" onClick={handleClose} disableElevation>
                キャンセル
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
    </>
  )
}
