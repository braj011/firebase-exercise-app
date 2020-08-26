import React, { useEffect, useReducer, useState} from 'react';
import axios from 'axios';

import Account from '../components/account';
import Exercise from '../components/exercise';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NotesIcon from '@material-ui/icons/Notes';
import Avatar from '@material-ui/core/avatar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';

import { authMiddleWare } from '../util/auth'

const drawerWidth = 240;

const styles = (theme) => ({
    root: {
        display: 'flex'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    avatar: {
        height: 110,
        width: 100,
        flexShrink: 0,
        flexGrow: 0,
        marginTop: 20
    },
    uiProgress: {
        position: 'fixed',
        zIndex: '1000',
        height: '31px',
        width: '31px',
        left: '50%',
        top: '35%'
    },
    toolbar: theme.mixins.toolbar
});

// todo: refactor to hooks
function Home(props) {
    const initialState = {
        firstName: '',
        lastName: '',
        profilePicture: '',
        uiLoading: true,
        imageLoading: false
    }
    const [render, setRender] = useState(false)
    const reducer = (state, newState) => ({ ...state, ...newState })
    const [state, setState] = useReducer(reducer, initialState);


    const loadAccountPage = (event) => {
        return setRender(true)
    };

    const loadExercisesPage = (event) => {
        return setRender(false)
    };

    const logoutHandler = (event) => {
        localStorage.removeItem('AuthToken');
        props.history.push('/login');
    };

    // componentDidMount
    useEffect(() => {
        authMiddleWare(props.history);
        console.log({props})
        console.log('props.history', props.history)
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        // todo: could refactor to  async await?
        axios
            .get('/user')
            .then((response) => {
                console.log(response.data);
                setState({
                    firstName: response.data.userCredentials.firstName,
                    lastName: response.data.userCredentials.lastName,
                    email: response.data.userCredentials.email,
                    phoneNumber: response.data.userCredentials.phoneNumber,
                    country: response.data.userCredentials.country,
                    username: response.data.userCredentials.username,
                    uiLoading: false,
                    profilePicture: response.data.userCredentials.imageUrl
                });
            })
            .catch((error) => {
                if(error.response.status === 403) {
                    props.history.push('/login')
                }
                console.log(error);
                setState({ errorMsg: 'Error in retrieving the data' })
            });
    }, [])

        const { classes } = props
        if (state.uiLoading === true) {
            return (
                <div className={classes.root}>
                    {state.uiLoading && <CircularProgress size={150} className={classes.uiProgress} />}
                </div>
            )
        } else {
            return (
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar position="fixed" className={classes.appBar}>
                        <Toolbar>
                            <Typography variant="h6" noWrap>
                                Exercise App
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        className={classes.drawer}
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper
                        }}
                    >
                        <div className={classes.toolbar} />
                        <Divider />
                        <center>
                            <Avatar src={state.profilePicture} className={classes.avatar} />
                            <p>
                                {' '}
                                {state.firstName} {state.lastName}
                            </p>
                        </center>
                        <Divider />
                        <List>
                            <ListItem button key="Exercise" onClick={loadExercisesPage}>
                                <ListItemIcon>
                                    {' '}
                                    <NotesIcon />{' '}
                                </ListItemIcon>
                                <ListItemText primary="Exercise" />
                            </ListItem>

                            <ListItem button key="Account" onClick={loadAccountPage}>
                                <ListItemIcon>
                                    {' '}
                                    <AccountBoxIcon />{' '}
                                </ListItemIcon>
                                <ListItemText primary="Account" />
                            </ListItem>

                            <ListItem button key="Logout" onClick={logoutHandler}>
                                <ListItemIcon>
                                    {' '}
                                    <ExitToAppIcon />{' '}
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItem>
                        </List>
                    </Drawer>

                    <div>{render ? <Account /> : <Exercise />}</div>
                </div>
            );
        }
}

export default withStyles(styles)(Home);