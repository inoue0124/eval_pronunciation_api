import { Grid } from '@material-ui/core'
import { LoginForm } from '../../components/auth/LoginForm'
import { UserType } from '../../types/UserType'

const TeacherLogin: React.FC = () => {
  return (
    <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item xs={10}>
          <LoginForm userType={UserType.Teacher} />
        </Grid>
      </Grid>
    </>
  )
}

export default TeacherLogin
