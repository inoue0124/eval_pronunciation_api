import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import ApiClient, { Country } from '../../api'
import { setCookie } from 'nookies'
import { useRouter } from 'next/router'
import { Select } from '@material-ui/core'
import { MenuItem } from '@material-ui/core'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'

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

export const RegisterProfileForm: React.FC<Props> = ({ isTeacher }) => {
  const api = new ApiClient()
  const classes = useStyles()
  const router = useRouter()
  const [countries, setCountries] = useState<Country[]>([])
  const [name, setName] = useState<string>()
  const [gender, setGender] = useState<number>()
  const [birthDate, setBirthDate] = useState<string>()
  const [birthPlace, setBirthPlace] = useState<string>()

  useEffect(() => {
    ;(async function () {
      const res = await api.fetchCountries()
      setCountries(res)
    })()
  }, [])

  const handleChangeDate = (date: MaterialUiPickersDate) => {
    if (date === null) {
      return
    }
    const formatted = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    setBirthDate(formatted)
  }

  const handleRegister = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    if (
      name === undefined ||
      gender === undefined ||
      birthDate === undefined ||
      birthPlace === undefined
    ) {
      alert('すべての項目を入力して下さい！')
      return
    }
    try {
      const teacher = await api.registerTeacher(name, gender, birthDate, birthPlace)
      setCookie(undefined, 'teacher', JSON.stringify(teacher), {
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
          プロフィール登録
        </Typography>
        <form className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="名前"
            name="name"
            autoFocus
            value={name}
            onChange={(event) => {
              setName(event.target.value as string)
            }}
          />

          <Select
            variant="outlined"
            required
            fullWidth
            id="demo-simple-select-outlined"
            value={gender}
            onChange={(event) => {
              setGender(event.target.value as number)
            }}
            label="性別"
          >
            <MenuItem value={'回答しない'}>回答しない</MenuItem>
            <MenuItem value={'男'}>男</MenuItem>
            <MenuItem value={'女'}>女</MenuItem>
          </Select>

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              fullWidth
              variant="inline"
              required
              inputVariant="outlined"
              format="yyyy/MM/dd"
              margin="normal"
              label="誕生日"
              value={birthDate}
              onChange={handleChangeDate}
            />
          </MuiPickersUtilsProvider>

          <Select
            variant="outlined"
            required
            fullWidth
            id="demo-simple-select-outlined"
            value={birthPlace}
            onChange={(event) => {
              setBirthPlace(event.target.value as string)
            }}
            label="出身国"
          >
            {countries.map((country, index) => (
              <MenuItem key={index} value={country.ja}>
                {country.ja}({country.en})
              </MenuItem>
            ))}
          </Select>

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
        </form>
      </div>
    </Container>
  )
}
