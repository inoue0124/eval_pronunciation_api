import Link from '@material-ui/core/Link'
import Image from 'next/image'
import {
  Box,
  Container,
  makeStyles,
  Typography,
  Card,
  Grid,
  CardMedia,
  CardContent,
  CardActionArea,
} from '@material-ui/core'

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
  media: {
    height: 140,
    width: 140,
  },
}))

const Home: React.FC = () => {
  const classes = useStyles()

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh', marginTop: 20 }}
    >
      <Grid item xs={10}>
        <Container component="main">
          <div className={classes.paper}>
            <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center">
              <Grid item>
                <Link href="/teacher/login">
                  <Card>
                    <CardActionArea
                      style={{
                        paddingTop: '100px',
                        paddingBottom: '100px',
                        paddingRight: '50px',
                        paddingLeft: '50px',
                      }}
                    >
                      <CardMedia className={classes.media} image="/school.png" />
                      <CardContent style={{ textAlign: 'center' }}>教師ログイン</CardContent>
                    </CardActionArea>
                  </Card>
                </Link>
              </Grid>
              <Grid item>
                <Link href="/learner/login">
                  <Card>
                    <CardActionArea
                      style={{
                        paddingTop: '100px',
                        paddingBottom: '100px',
                        paddingRight: '50px',
                        paddingLeft: '50px',
                      }}
                    >
                      <CardMedia className={classes.media} image="/learner.png" />
                      <CardContent style={{ textAlign: 'center' }}>生徒ログイン</CardContent>
                    </CardActionArea>
                  </Card>
                </Link>
              </Grid>
            </Grid>
            <Box mt={8}>
              <Copyright />
            </Box>
          </div>
        </Container>
      </Grid>
    </Grid>
  )
}
export default Home
