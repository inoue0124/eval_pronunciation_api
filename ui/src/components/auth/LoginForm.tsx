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
import { UserType } from '../../types/UserType'

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
  userType: UserType
}

export const LoginForm: React.FC<Props> = ({ userType }) => {
  const api = new ApiClient()
  const classes = useStyles()
  const router = useRouter()
  const unitId = Number(router.query.unit)
  const teacherId = Number(router.query.ti)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true)
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true)
  const [registerPageUrl, setRegisterPageUrl] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [isShowRegister, setIsShowRegister] = useState<boolean>(true)

  useEffect(() => {
    if (
      userType === UserType.Learner &&
      (router.query.unit === undefined || router.query.ti === undefined)
    ) {
      setIsShowRegister(false)
    }
    switch (userType) {
      case UserType.Admin:
        setTitle('管理者ログイン')
        break
      case UserType.Teacher:
        setRegisterPageUrl('/teacher/register')
        setTitle('教師ログイン')
        break
      case UserType.Learner:
        setRegisterPageUrl(`/learner/register?unit=${unitId}&ti=${teacherId}`)
        setTitle('学生ログイン')
        break
      default:
        break
    }
  }, [])

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

  const handleLogin = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    if (validate()) {
      try {
        const res = await api.login(email, password)
        setCookie(undefined, 'logged_user', JSON.stringify(res.user), {
          path: '/',
          maxAge: 30 * 24 * 60 * 60,
        })
        setCookie(undefined, 'EVAL_SPEECH_SESSION', res.token, {
          path: '/',
          maxAge: 30 * 24 * 60 * 60,
        })
        let redirectUrl = ''
        switch (res.user.type) {
          case UserType.Admin:
            redirectUrl = '/admin/teacher'
            break
          case UserType.Teacher:
            redirectUrl = '/teacher/unit'
            break
          case UserType.Learner:
            if (router.query.unit === undefined || router.query.ti === undefined) {
              redirectUrl = '/learner/unit/list'
            } else {
              redirectUrl = `/learner/unit/${unitId}?ti=${teacherId}`
            }
            break
          default:
            break
        }
        router.push(redirectUrl)
      } catch (e) {
        alert('認証情報が間違っています。')
      }
    }
  }

  return (
    <Container component="main">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          {title}
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
            onClick={handleLogin}
          >
            ログイン
          </Button>
          {isShowRegister ? (
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                {userType !== UserType.Admin && (
                  <Link href={registerPageUrl} variant="body2">
                    アカウント新規作成はこちら
                  </Link>
                )}
              </Grid>
            </Grid>
          ) : (
            <div>アカウントの登録には先生が発行したURLが必要です。</div>
          )}
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}
