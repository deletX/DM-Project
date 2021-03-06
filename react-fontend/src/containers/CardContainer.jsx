import React from 'react';
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Backdrop from "@material-ui/core/Backdrop";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import {makeStyles} from "@material-ui/core/styles";

/**
 * Card Container with available backdrop with *"Loading your data!"* and circular progress.
 *
 * Title in top middle and Divider before children
 */
const CardContainer = (props) => {
    const classes = useStyles();
    const {children, title, loading = true, open = false} = props;

    return (
        <div className={classes.root}>
            <Typography variant="h5" align="center" className={classes.title}>
                {title}
            </Typography>
            <Divider/>
            {children}
            {loading &&
            <Backdrop className={classes.backdrop} open={open}>
                <Box className={classes.loading}>
                    <Typography className={classes.loadingTypography}>
                        Loading your data!
                    </Typography>
                    <CircularProgress color="inherit"/>
                </Box>
            </Backdrop>
            }
        </div>
    );
};

const useStyles = makeStyles((theme) => ({

    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    root: {
        width: '95%',
        margin: 10
    },
    loading: {
        marginBottom: theme.spacing(5),
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    loadingTypography: {
        marginBottom: theme.spacing(2),
    },
    title: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
    },
}))

export default CardContainer;