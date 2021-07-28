import { Grid } from '@material-ui/core'
import { RegisterProfileForm } from '../../components/auth/RegisterProfileForm'

const TeacherRegisterProfile: React.FC = () => {
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
        <Grid item sm={8} md={6} lg={4}>
          <RegisterProfileForm isTeacher={true} />
        </Grid>
      </Grid>
    </>
  )
}

export default TeacherRegisterProfile
