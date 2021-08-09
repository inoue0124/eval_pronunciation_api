import { Grid } from '@material-ui/core'
import { RegisterForm } from '../../components/auth/RegisterForm'

const TeacherRegister: React.FC = () => {
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
          <RegisterForm isTeacher={true} />
        </Grid>
      </Grid>
    </>
  )
}

export default TeacherRegister
