import { Grid } from '@material-ui/core'
import { LoginForm } from '../../components/auth/LoginForm'
import { UserType } from '../../types/UserType'

const LearnerLogin: React.FC = () => {
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
          <LoginForm userType={UserType.Learner} />
        </Grid>
      </Grid>
    </>
  )
}

export default LearnerLogin
