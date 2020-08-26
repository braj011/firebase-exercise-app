import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardContent from '@material-ui/core/CardContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Typography from "@material-ui/core/Typography";
import withStyles from '@material-ui/core/styles/withStyles';

import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { authMiddleWare } from '../util/auth';

const styles = (theme) => ({
    title: {
        marginLeft: theme.spacing(2),
            flex: 1
    },
    submitButton: {
        display: 'block',
        color: 'white',
        textAlign: 'center',
        position: 'absolute',
        top: 14,
        right: 10
    },
    floatingButton: {
        position: 'fixed',
        bottom: 0,
        right: 0
},
    form: {
        width: '98%',
            marginLeft: 13,
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(3)
    },
    toolbar: theme.mixins.toolbar,
        root: {
        minWidth: '100%'
    },
    bullet: {
        display: 'inline-block',
            margin: '0 2px',
            transform: 'scale(0.8)'
    },
    pos: {
        marginBottom: 12
    },
    uiProgress: {
        position: 'fixed',
        zIndex: '1000',
        height: '10px',
        width: '10px',
        left: '50%',
        top: '35%'
    },
    dialogueStyle: {
        maxWidth: '50%'
    },
    viewRoot: {
        margin: 0,
            padding: theme.spacing(2)
    },
    closeButton: {
        position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500]
    }
});

// standard slide transition - as seen on MUI - https://material-ui.com/components/transitions/
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class Exercise extends Component {
    constructor(props) {
        super(props);

        this.state = {
            exercises: '',
            title: '',
            sets: 0,
            reps: 0,
            comments: '',
            exerciseId: '',
            errors: [],
            open: false,
            uiLoading: true,
            buttonType: '',
            viewOpen: false
        };

        this.deleteExerciseHandler = this.deleteExerciseHandler.bind(this);
        this.handleEditClickOpen = this.handleEditClickOpen.bind(this);
        this.handleViewOpen = this.handleViewOpen.bind(this);
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    componentWillMount = () => {
        authMiddleWare(this.props.history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        axios
            .get('/exercises')
            .then((response) => {
                this.setState({
                    exercises: response.data,
                    uiLoading: false
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    deleteExerciseHandler(data) {
        authMiddleWare(this.props.history);
        const authToken = localStorage.getItem('AuthToken');
        console.log({authToken})
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        let exerciseId = data.exercise.exerciseId;
        axios
            .delete(`exercises/${exerciseId}`)
            .then(() => {
                window.location.reload();
            })
            .catch((err) => {
                console.log({err});

            });
    }

    handleEditClickOpen(data) {
        this.setState({
            title: data.exercise.title,
            sets: data.exercise.sets ?? 0,
            reps:  data.exercise.reps ?? 0,
            comments:  data.exercise.comments,
            exerciseId: data.exercise.exerciseId,
            buttonType: 'Edit',
            open: true
        });
    }

    handleViewOpen(data) {
        this.setState({
            title: data.exercise.title,
            sets: data.exercise.sets,
            reps:  data.exercise.reps,
            comments:  data.exercise.comments,
            viewOpen: true
        });
    }

    render() {
        const DialogTitle = withStyles(styles)((props) => {
            const { children, classes, onClose, ...other } = props;
            return (
                <MuiDialogTitle disableTypography className={classes.root} {...other}>
                    <Typography variant="h6">{children}</Typography>
                    {onClose ? (
                        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    ) : null}
                </MuiDialogTitle>
            );
        });

        const DialogContent = withStyles((theme) => ({
            root: {
                padding: theme.spacing(2)
            }
        }))(MuiDialogContent);

        dayjs.extend(relativeTime);
        const { classes } = this.props;
        const { open, errors, viewOpen } = this.state;

        const handleClickOpen = () => {
            this.setState({
                exerciseId: '',
                title: '',
                sets: 0,
                reps: 0,
                comments: '',
                buttonType: '',
                open: true
            });
        };

        const handleSubmit = (event) => {
            authMiddleWare(this.props.history);
            event.preventDefault();
            const exercise = {
                title: this.state.title,
                comments: this.state.comments,
            }
            if (this.state.sets) {
                exercise.sets = this.state.sets
                exercise.reps = this.state.reps
            }
            let options = {};
            if (this.state.buttonType === 'Edit') {
                options = {
                    url: `/exercises/${this.state.exerciseId}`,
                    method: 'put',
                    data: exercise
                };
            } else {
                options = {
                    url: '/exercises',
                    method: 'post',
                    data: exercise
                };
            }
            const authToken = localStorage.getItem('AuthToken');
            axios.defaults.headers.common = { Authorization: `${authToken}` };
            axios(options)
                .then(() => {
                    this.setState({ open: false });
                    window.location.reload();
                })
                .catch((error) => {
                    this.setState({ open: true, errors: error.response.data });
                    console.log(error);
                });
        };

        const handleViewClose = () => {
            this.setState({ viewOpen: false });
        };

        const handleClose = (event) => {
            this.setState({ open: false });
        };

        if (this.state.uiLoading === true) {
            return (
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgress} />}
                </main>
            );
        } else {
            return (
                //Form view
                <main className={classes.content}>
                    <div className={classes.toolbar} />

                    <IconButton
                        className={classes.floatingButton}
                        color="primary"
                        aria-label="Add Exercise"
                        onClick={handleClickOpen}
                    >
                        <AddCircleIcon style={{ fontSize: 60 }} />
                    </IconButton>
                    <Dialog fullWidth maxWidth={'md'} open={open} onClose={handleClose} TransitionComponent={Transition}>
                        <AppBar className={classes.appBar}>
                            <Toolbar>
                                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                    <CloseIcon />
                                </IconButton>
                                <Typography variant="h6" className={classes.title}>
                                    {this.state.buttonType === 'Edit' ? 'Edit Exercise Record' : 'Create a new Exercise Record'}
                                </Typography>
                                <Button
                                    autoFocus
                                    color="inherit"
                                    onClick={handleSubmit}
                                    className={classes.submitButton}
                                >
                                    {this.state.buttonType === 'Edit' ? 'Save' : 'Submit'}
                                </Button>
                            </Toolbar>
                        </AppBar>

                        <form className={classes.form} noValidate>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="exerciseTitle"
                                        label="Exercise Title"
                                        name="title"
                                        autoComplete="exerciseTitle"
                                        helperText={errors.title}
                                        value={this.state.title}
                                        error={errors.title ? true : false}
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                {/*todo: add in sets and reps */}
                                {/* Need to ensure that both have values or none - before being able to submit*/}
                                {/*{(this.state.buttonType !== 'Edit' || this.state.sets) &&*/}
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="exerciseSets"
                                            label="Exercise Sets"
                                            name="sets"
                                            autoComplete="exerciseSets"
                                            helperText={errors.sets}
                                            value={this.state.sets}
                                            error={errors.sets ? true : false}
                                            onChange={this.handleChange}
                                        />
                                    </Grid>
                                {/*}*/}
                                {/*{(this.state.buttonType !== 'Edit' || this.state.reps) &&*/}
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="exerciseReps"
                                        label="Exercise Reps"
                                        name="reps"
                                        autoComplete="exerciseReps"
                                        helperText={errors.reps}
                                        value={this.state.reps}
                                        error={errors.reps ? true : false}
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                {/*}*/}
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="exerciseComments"
                                        label="Exercise Comments"
                                        name="comments"
                                        autoComplete="exerciseComments"
                                        multiline
                                        rows={5}
                                        rowsMax={5}
                                        helperText={errors.comments}
                                        error={errors.comments ? true : false}
                                        onChange={this.handleChange}
                                        value={this.state.comments}
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    </Dialog>
                    {/* Overall page view level */}
                    <Grid container spacing={2}>
                        {this.state.exercises.map((exercise) => (
                            <Grid item xs={12} sm={6} key={exercise.exerciseId}>
                                <Card className={classes.root} variant="outlined">
                                    <CardContent>
                                        <Typography variant="h5" component="h2">
                                            {exercise.title}
                                        </Typography>
                                        <Typography className={classes.pos} color="textSecondary">
                                            {dayjs(exercise.createdAt).fromNow()}
                                        </Typography>
                                        {exercise.comments &&
                                            <Typography variant="body2" component="p">
                                                {`${exercise.comments.substring(0, 65)}`}
                                            </Typography>
                                        }
                                        {exercise.sets &&
                                            <Typography variant="body2" component="p">
                                                Sets: {`${exercise.sets}`}
                                            </Typography>
                                        }
                                        {exercise.reps &&
                                        <Typography variant="body2" component="p">
                                            Reps: {`${exercise.reps}`}
                                        </Typography>
                                        }
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" color="primary" onClick={() => this.handleViewOpen({ exercise })}>
                                            {' '}
                                            View{' '}
                                        </Button>
                                        <Button size="small" color="primary" onClick={() => this.handleEditClickOpen({ exercise })}>
                                            Edit
                                        </Button>
                                        <Button size="small" color="primary" onClick={() => this.deleteExerciseHandler({ exercise })}>
                                            Delete
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    {/*  Single exercise record view (read only)  */}
                    <Dialog
                        onClose={handleViewClose}
                        aria-labelledby="customized-dialog-title"
                        open={viewOpen}
                        fullWidth
                        classes={{ paperFullWidth: classes.dialogueStyle }}
                    >
                        <DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
                            {this.state.title}
                        </DialogTitle>
                        {this.state.comments && <DialogContent dividers>
                            <TextField
                                fullWidth
                                id="exerciseComments"
                                name="comments"
                                multiline
                                readOnly
                                rows={1}
                                rowsMax={5}
                                value={this.state.comments}
                                InputProps={{
                                    disableUnderline: true
                                }}
                            />
                        </DialogContent>
                        }
                        {this.state.sets &&
                            <DialogContent dividers>
                                <TextField
                                    fullWidth
                                    id="exerciseSets"
                                    name="sets"
                                    readOnly
                                    rows={1}
                                    rowsMax={1}
                                    value={`Sets: ${this.state.sets}`}
                                    InputProps={{
                                        disableUnderline: true
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    id="exerciseReps"
                                    name="reps"
                                    readOnly
                                    rows={1}
                                    rowsMax={1}
                                    value={`Reps: ${this.state.reps}`}
                                    InputProps={{
                                        disableUnderline: true
                                    }}
                                />
                            </DialogContent>
                        }
                    </Dialog>
                </main>
            );
        }
    }
}

export default withStyles(styles)(Exercise);