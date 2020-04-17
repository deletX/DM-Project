import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {home, login} from "../constants/pagesurls";
import {connect} from "react-redux";
import {authCheckState, authLogin, googleOAuthLogin} from "../actions/authActions";
import {Container, Paper} from "@material-ui/core";
import {white} from "color-name";
import CssBaseline from "@material-ui/core/CssBaseline";
import {history} from "../App";


const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: '100vw',
        backgroundColor: white,
        alignItems: 'center',
        flexDirection: 'column',
        display: 'flex',
    },
    formPaper: {
        flexDirection: 'column',
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        margin: 20,
        maxWidth: '55ch',
        minWidth: '10ch',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
}));

const AuthContainer = ({children, isAuthenticated}) => {
    useEffect(() => {
        if (isAuthenticated) history.push(home)
    });
    const classes = useStyles();

    return (
        <Container className={classes.root} maxWidth="xs">
            <Paper className={classes.formPaper}>
                {children}
            </Paper>
        </Container>
    )


};

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== undefined,
    };
};


export default connect(mapStateToProps, null)(AuthContainer)