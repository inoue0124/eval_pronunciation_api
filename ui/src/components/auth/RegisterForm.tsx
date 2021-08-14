import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import ApiClient from '../../api'
import { setCookie } from 'nookies'
import { useRouter } from 'next/router'

const Copyright: React.FC = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Kommunikation und Aussprache im L2-Erwerb
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
      <Image src="/logo.jpg" width="64" height="32" />
    </Typography>
  )
}

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    maxWidth: 450,
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

type Props = {
  isTeacher: boolean
}

export const RegisterForm: React.FC<Props> = ({ isTeacher }) => {
  const api = new ApiClient()
  const classes = useStyles()
  const router = useRouter()
  const unitId = Number(router.query.unit)
  const teacherId = Number(router.query.ti)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true)
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true)
  const type = isTeacher ? 1 : 2

  useEffect(() => {
    if (router.isReady) {
      ;(async function () {
        if (
          !isTeacher &&
          (router.query.unit === 'NaN' ||
            router.query.unit === undefined ||
            router.query.ti === 'NaN' ||
            router.query.ti === undefined)
        ) {
          alert('urlが正しくありません！')
          router.push('/')
        }
      })()
    }
  }, [router.query])

  const validate = useCallback(() => {
    let isValid = true
    // メールアドレスの検証
    const emailReg = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/
    if (emailReg.test(email)) {
      setIsEmailValid(true)
    } else {
      setIsEmailValid(false)
      isValid = false
    }
    // パスワードの検証
    const passowrdReg = /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,15}$/i
    if (passowrdReg.test(password)) {
      setIsPasswordValid(true)
    } else {
      setIsPasswordValid(false)
      isValid = false
    }
    return isValid
  }, [email, password])

  const handleRegister = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    if (validate()) {
      try {
        const res = await api.register(email, password, type)
        setCookie(undefined, 'logged_user', JSON.stringify(res.user), {
          path: '/',
          maxAge: 30 * 24 * 60 * 60,
        })
        setCookie(undefined, 'EVAL_SPEECH_SESSION', res.token, {
          path: '/',
          maxAge: 30 * 24 * 60 * 60,
        })
        router.push(
          isTeacher
            ? '/teacher/register-profile'
            : `/learner/register-profile?unit=${unitId}&ti=${teacherId}`,
        )
      } catch (e) {
        alert(e)
      }
    }
  }

  return (
    <Container component="main">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          {isTeacher ? '教師' : '学習者'}新規登録
        </Typography>
        <form className={classes.form}>
          <TextField
            error={!isEmailValid}
            helperText={isEmailValid ? '' : 'メールアドレスの形式が間違っています。'}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="メールアドレス"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
            }}
          />
          <TextField
            error={!isPasswordValid}
            helperText={isPasswordValid ? '' : 'パスワードは英数字8文字以上である必要があります。'}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="パスワード"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleRegister}
          >
            登録
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Link
                href={
                  isTeacher ? '/teacher/login' : `/learner/login?unit=${unitId}&ti=${teacherId}`
                }
                variant="body2"
              >
                ログインはこちら
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}
