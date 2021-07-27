import React, { useState } from 'react'
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
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

type Props = {
  isTeacher: boolean
}

export const LoginForm: React.FC<Props> = ({ isTeacher }) => {
  const api = new ApiClient()
  const classes = useStyles()
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const handleRegister = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    try {
      const user = await api.login(email, password)
      setCookie(undefined, 'logged_user', JSON.stringify(user), {
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      })
      router.push(isTeacher ? '/teacher/unit' : '/learner/unit')
    } catch (e) {
      alert(e)
    }
  }

  return (
    <Container component="main">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          ログイン
        </Typography>
        <form className={classes.form}>
          <TextField
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
            ログイン
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Link href={isTeacher ? '/teacher/register' : '/learner/register'} variant="body2">
                アカウント新規作成はこちら
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
