import { useState, useEffect } from 'react'
import ApiClient from '../../api'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import { Button } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import { useSetRecoilState } from 'recoil'
import { addedSpeechState } from '../../states/addTeacherSpeech/addedSpeechState'
import { TeacherSpeech } from '../../types/TeacherSpeech'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContentContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      borderRadius: theme.spacing(1),
    },
    marginTop: {
      marginTop: theme.spacing(3),
    },
  }),
)

export const AddSpeechModal: React.FC = () => {
  const api = new ApiClient()
  const classes = useStyles()
  const [open, setOpen] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState<string>('')
  const [isValid, setIsValid] = useState<boolean>(false)
  const setAddedSpeech = useSetRecoilState<TeacherSpeech | null>(addedSpeechState)
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
    if (file !== null) {
      const res = await api.registerTeacherSpeech(text, file)
      if (res !== undefined) {
        setAddedSpeech(res)
        setOpen(false)
      }
    }
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
              新規教師音声登録
            </Typography>
            <div className={classes.marginTop}>
              <Typography variant="subtitle2" gutterBottom>
                1.音声ファイル（mp3形式）を選択してください。
              </Typography>
              <div className="text-center">
                <Button className="mb-4" variant="outlined" color="primary">
                  <input
                    type="file"
                    className="appearance-none"
                    onChange={onSelectFile}
                    accept="audio/mp3"
                  />
                </Button>
              </div>
            </div>
            <div className={classes.marginTop}>
              <Typography variant="subtitle2" gutterBottom>
                2.音声の内容（スクリプト）を入力してください。
              </Typography>
              <TextareaAutosize
                className="w-full p-2 mb-4 border-2 resize-none"
                rowsMin={5}
                placeholder="スクリプト"
                onChange={onChangeText}
              />
            </div>
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
