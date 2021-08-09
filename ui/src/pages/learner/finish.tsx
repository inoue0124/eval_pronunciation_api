import { Grid, Card, CardContent, Typography } from '@material-ui/core'
import Image from 'next/image'

const LearnerFinish: React.FC = () => {
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
          <Card>
            <CardContent style={{ textAlign: 'center', padding: '40px' }}>
              <Typography component="h1" variant="h6">
                課題は以上で終了です。ブラウザを閉じて終了して下さい。
              </Typography>
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <Image src="/logo.jpg" width="64" height="32" />
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default LearnerFinish
