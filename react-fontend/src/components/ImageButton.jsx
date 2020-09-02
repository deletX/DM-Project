import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {PhotoCamera} from "@material-ui/icons";
import Input from "@material-ui/core/Input";
import CircularProgress from "@material-ui/core/CircularProgress";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const ImageButton = (props) => {
    const classes = useStyles();
    return (
        <Grid item xs={12}>
            <Button
                fullWidth
                variant="contained"
                color="secondary"
                component="label"
                justify="flex-end"
                className={classes.button}
                startIcon={<PhotoCamera/>}
            >Picture
                <Input className={classes.imageInput} type="file" controlled="true" onChange={props.onClick}/>
                {props.loading &&
                <CircularProgress size="2ch" className={classes.imageProgress}/>
                }
            </Button>
        </Grid>
    )
}

const useStyles = makeStyles((theme) => ({
    button: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    imageInput: {
        display: 'none',
    },
    imageProgress: {
        marginLeft: theme.spacing(1),
    },


}));

export default ImageButton