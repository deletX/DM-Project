import React, {useState} from 'react';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import {KeyboardDatePicker, KeyboardTimePicker} from "@material-ui/pickers";
import {makeStyles} from "@material-ui/core/styles";
import {PhotoCamera} from "@material-ui/icons";
import Input from "@material-ui/core/Input";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: theme.spacing(2),
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%',
    },

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
    img: {
        color: theme.palette.getContrastText(theme.palette.secondary.dark),
        backgroundColor: theme.palette.secondary.dark,
        margin: 10,
        width: '100%',
        height: '25vw',
        maxHeight: "175px",
    },


}));

const NewEventFormComponent = ({name, setName, date, setDate, description, setDescription, image, setImage, imageURL, setImageURL}) => {
    const classes = useStyles();

    const [day, setDay] = useState(new Date(date))
    const [time, setTime] = useState(new Date(date))

    const [nameError, setNameError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const updateDate = (day, time) => {
        if (day === null || time === null) {
            setDate(null)
            return;
        }
        let date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), time.getHours(), time.getMinutes());
        setDate(date);
    }
    let oneHourAhead = new Date()
    oneHourAhead = new Date(oneHourAhead.getTime() + 3600 * 1000)

    return (
        <div className={classes.root}>
            <Avatar variant="rounded" src={imageURL} className={classes.img}/>

            <form className={classes.form} autoComplete="off">
                <Grid container spacing={2}>

                    <Grid item xs={12}>
                        <TextField
                            required
                            variant="outlined"
                            fullWidth
                            id="name"
                            label="Name"
                            placeholder="Awesome Gig"
                            value={name}
                            onChange={(input) => {
                                setName(input.target.value)
                                if (input.target.value === "")
                                    setNameError(true)
                                else
                                    setNameError(false)
                            }}
                            error={nameError}
                            onBlur={(input) => {
                                if (input.target.value === "")
                                    setNameError(true)
                                else
                                    setNameError(false)
                            }}
                            helperText={nameError ? "Required" : ""}
                        />
                    </Grid>
                    {date < oneHourAhead &&
                    <Grid item xs={12}>
                        <Alert severity="warning">
                            Event can be added till an hour prior
                        </Alert>
                    </Grid>
                    }
                    <Grid item xs={12} sm={6}>
                        <KeyboardDatePicker
                            fullWidth
                            clearable
                            label="Date"
                            value={day}
                            placeholder="26/03/2020"
                            onChange={date => {
                                setDay(date)
                                updateDate(date, time)
                            }}
                            minDate={new Date()}
                            format="dd/MM/yyyy"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <KeyboardTimePicker
                            fullWidth
                            clearable
                            label="Time"
                            value={time}
                            placeholder="21:30"
                            ampm={false}
                            onChange={date => {
                                setTime(date)
                                updateDate(day, date)
                            }}
                            mask="__:__"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="description"
                            label="Description"
                            multiline
                            rows={3}
                            rowsMax={10}
                            value={description}
                            onChange={(input) => {
                                setDescription(input.target.value)
                                if (input.target.value === "")
                                    setDescriptionError(true)
                                else
                                    setDescriptionError(false)
                            }}
                            error={descriptionError}
                            onBlur={(input) => {
                                if (input.target.value === "")
                                    setDescriptionError(true)
                                else
                                    setDescriptionError(false)
                            }}
                            helperText={descriptionError ? "Required" : ""}

                            placeholder="..."
                        />
                    </Grid>
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

                            <Input className={classes.imageInput} type="file" controlled="true" onChange={(input) => {
                                setImage("loading");
                                let fileReader = new FileReader();
                                let file = input.target.files[0];
                                fileReader.onloadend = () => {
                                    setImageURL(fileReader.result)
                                }
                                setImage(file)
                                fileReader.readAsDataURL(file)

                            }}/>
                            {image === "loading" ? (
                                <>
                                    <CircularProgress size="2ch" className={classes.imageProgress}/>
                                </>
                            ) : (
                                <>
                                </>
                            )}
                        </Button>
                    </Grid>

                </Grid>
            </form>
        </div>
    )
};

export default NewEventFormComponent;