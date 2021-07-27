import { Grid } from '@material-ui/core'
import { LoginForm } from '../../components/auth/LoginForm'

const TeacherLogin: React.FC = () => {
  return (
    <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item xs={10}>
          <LoginForm isTeacher={true} />
        </Grid>
      </Grid>
    </>
  )
}

export default TeacherLogin
