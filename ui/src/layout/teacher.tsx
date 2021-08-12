import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic'
import ViewListIcon from '@material-ui/icons/ViewList'
import PeopleAltIcon from '@material-ui/icons/PeopleAlt'
import { useRouter } from 'next/router'
import { IconButton } from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import ApiClient from '../api'
import { deleteCookie } from '../util/cookie'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    marginTop: 50,
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}))

export const SideMenu: React.FC = ({ children }) => {
  const api = new ApiClient()
  const classes = useStyles()
  const router = useRouter()
  const handleLogout = async () => {
    await api.logout()
    router.push('/teacher/login')
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap className={classes.title}>
            学習者音声評価Web
          </Typography>
          <IconButton color="inherit" aria-label="open drawer" edge="end" onClick={handleLogout}>
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            <ListItem
              button
              selected={router.pathname.includes('/teacher/unit')}
              onClick={() => router.push('/teacher/unit')}
            >
              <ListItemIcon>{<ViewListIcon />}</ListItemIcon>
              <ListItemText primary="課題管理" />
            </ListItem>
            <ListItem
              button
              selected={router.pathname.includes('/teacher/speech')}
              onClick={() => router.push('/teacher/speech')}
            >
              <ListItemIcon>{<LibraryMusicIcon />}</ListItemIcon>
              <ListItemText primary="教師音声管理" />
            </ListItem>
            <ListItem
              button
              selected={router.pathname.includes('/teacher/learner')}
              onClick={() => router.push('/teacher/learner')}
            >
              <ListItemIcon>{<PeopleAltIcon />}</ListItemIcon>
              <ListItemText primary="学習者管理" />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>{children}</main>
    </div>
  )
}
