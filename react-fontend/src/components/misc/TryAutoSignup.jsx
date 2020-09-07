import React from 'react';
import {useSnackbar} from "notistack";

/**
 * This component automatically tries to login the user if it is not yet authenticated (by loading the stored tokens)
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const TryAutoSignup = (props) => {
    const {enqueueSnackbar,} = useSnackbar();

    if (!props.isAuthenticatedOrLoading && !props.error)
        props.onTryAutoSignup(enqueueSnackbar)

    return (
        <div/>
    );
};

export default TryAutoSignup;