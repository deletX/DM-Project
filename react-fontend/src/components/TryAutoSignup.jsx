import React from 'react';
import {useSnackbar} from "notistack";

const TryAutoSignup = (props) => {
    const {enqueueSnackbar,} = useSnackbar();

    if (!props.isAuthenticatedOrLoading && !props.error)
        props.onTryAutoSignup(enqueueSnackbar)

    return (
        <div/>
    );
};

export default TryAutoSignup;