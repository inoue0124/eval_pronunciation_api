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
import Link from 'next/link'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
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
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Clipped drawer
          </Typography>
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
            <Link href="/teacher/speech">
              <ListItem button selected={location.pathname.includes('/teacher/speech')}>
                <ListItemIcon>{<LibraryMusicIcon />}</ListItemIcon>
                <ListItemText primary="教師音声管理" />
              </ListItem>
            </Link>
            <Link href="/teacher/unit">
              <ListItem button selected={location.pathname.includes('/teacher/unit')}>
                <ListItemIcon>{<ViewListIcon />}</ListItemIcon>
                <ListItemText primary="課題管理" />
              </ListItem>
            </Link>
            <Link href="/teacher/learner">
              <ListItem button selected={location.pathname.includes('/teacher/learner')}>
                <ListItemIcon>{<PeopleAltIcon />}</ListItemIcon>
                <ListItemText primary="学習者管理" />
              </ListItem>
            </Link>
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>{children}</main>
    </div>
  )
}
