import React from 'react';
import vectorpaint from "../icons/vectorpaint.svg"
import Typography from "@material-ui/core/Typography";
import {Helmet} from "react-helmet";

const NotFound404 = () => {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            margin: 50,
        }}>
            <Helmet>
                <title>DM Project - Not Found :(</title>
            </Helmet>
            <img
                src={vectorpaint}
                alt="404"
                style={{width: "80%", height: "80%", maxWidth: "300px", maxHeight: "300px", margin: 30}}/>
            <Typography variant="h2" color="primary" fontWeight="fontWeightBold" align="center">
                404
            </Typography>

            <div style={{width: "100%", maxWidth: "400px", margin: 20}}>
                <Typography variant="h3" fontWeight="fontWeightBold">
                    NOT FOUND
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    We're sorry, but we couldn't find what you where looking for :(
                </Typography>
            </div>
        </div>
    )

};

export default NotFound404;