import React, {useState} from "react";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import {white} from "color-name";
import Divider from "@material-ui/core/Divider";
import {Stepper} from "@material-ui/core";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import PersonalInfoForm from "./signup/PersonalInfoForm";
import StepContent from "@material-ui/core/StepContent";
import CarForm from "./signup/CarForm";
import SummaryData from "./signup/SummaryData";
import LinearProgress from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {home, signup} from "../../constants/pagesurls";
import {history} from "../../App";
import {authCheckState, authLogin, authSignup, googleOAuthLogin} from "../../actions/authActions";
import {connect} from "react-redux";
import {changePicture, createCar} from "../../actions/profileActions";
import {addAlert} from "../../actions/alertActions";

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
    }

}));

const getSteps = () => (
    ["Personal Info", "Add your Car", "Submit!"]
);


function SignupComponent({authSignup, googleLogin, setPicture, postCar, addError}) {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState("");


    const [carName, setCarName] = useState("");
    const [totSeats, setTotSeats] = useState(4);
    const [consumption, setConsumption] = useState(10);
    const [fuel, setFuel] = useState(1);

    const [isGoogleLogin, setGoogleLogin] = useState(false);
    const [googleAccessToken, setGoogleAccessToken] = useState("");

    const [open, setOpen] = useState(true);
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <PersonalInfoForm firstName={firstName} setFirstName={setFirstName} lastName={lastName}
                                         setLastName={setLastName} username={username} setUsername={setUsername}
                                         usernameError={usernameError} setUsernameError={setUsernameError} email={email}
                                         setEmail={setEmail} emailError={emailError} setEmailError={setEmailError}
                                         password={password} setPassword={setPassword} passwordError={passwordError}
                                         setPasswordError={setPasswordError} image={image} setImage={setImage}
                                         imageURL={imageURL} setImageURL={setImageURL} isGoogleLogin={isGoogleLogin}
                                         setGoogleLogin={setGoogleLogin}
                                         setGoogleAccessToken={setGoogleAccessToken} handleNext={handleNext}
                />;
            case 1:
                return <CarForm name={carName} setName={setCarName} totSeats={totSeats} setTotSeats={setTotSeats}
                                consumption={consumption} setConsumption={setConsumption} fuel={fuel}
                                setFuel={setFuel}/>
            case 2:
                return <SummaryData firstName={firstName} lastName={lastName} username={username} email={email}
                                    password={password} imageURL={imageURL} carName={carName} totSeats={totSeats}
                                    consumption={consumption} fuel={fuel} isGoogleLogin={isGoogleLogin}/>
            default:
                return "Unknown step";
        }
    };


    const steps = getSteps();
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());

    const isStepValid = (step) => {
        switch (step) {
            case 0:
                return (!emailError && email.length > 0 && !usernameError && username.length > 0 && !passwordError && password.length > 0) || isGoogleLogin;
            case 1:
                return carName.length > 0;
            default:
                return true;
        }
    };

    const isStepOptional = (step) => {
        return step === 1;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const clearSkipped = (step) => {
        if (step === 1) {
            setCarName("")
            setTotSeats(4)
            setFuel(1)
            setConsumption(10)
        }
    }

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            addError("You can't skip a step that isn't optional.");
        }
        clearSkipped(activeStep)
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const uploadData = () => {
        if (isGoogleLogin) {
            googleLogin(googleAccessToken).then((value) => {
                if (value instanceof Error) {
                    addError("An error occurred while signing you up with google")
                    console.log(value)
                    setOpen(false);
                    setActiveStep(0);
                } else {
                    if (carName !== "") {
                        postCar(carName, totSeats, fuel, consumption)
                    }
                    if (imageURL !== "") {
                        setPicture(image)
                    }
                    history.push(home)
                }
            })
        } else {
            authSignup(username, firstName, lastName, email, password).then((value) => {
                if (value instanceof Error) {
                    addError("An error occurred while signing you up")
                    console.log(value)
                    setOpen(false);
                    setActiveStep(0);
                } else {
                    if (carName !== "") {
                        postCar(carName, totSeats, fuel, consumption)
                    }
                    if (imageURL !== "") {
                        setPicture(image)
                    }
                    history.push(home)
                }
            })
        }
    }

    if (activeStep === steps.length) {
        uploadData()
    }

    const disabled = !isStepValid(activeStep);
    return (
        <div className={classes.root}>
            <Typography variant="h5" align="center" className={classes.title}>
                Sign Up!
            </Typography>
            <Divider/>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (isStepOptional(index)) {
                        labelProps.optional = <Typography variant="caption">Optional</Typography>;
                    }
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                            <StepContent>
                                {getStepContent(index)}
                                <div>
                                    <Button disabled={activeStep === 0} onClick={handleBack}
                                            className={classes.button}>
                                        Back
                                    </Button>
                                    {isStepOptional(activeStep) && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSkip}
                                            className={classes.button}
                                        >
                                            Skip
                                        </Button>
                                    )}

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                        className={classes.button}
                                        disabled={disabled}
                                    >
                                        {activeStep === steps.length - 1 ? 'SignUP!' : 'Next'}
                                    </Button>
                                </div>
                            </StepContent>
                        </Step>
                    );
                })}
            </Stepper>

            {activeStep === steps.length &&
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
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        authSignup: (username, firstName, lastName, email, password) => dispatch(authSignup(username, firstName, lastName, email, password)),
        googleLogin: (googleToken) => dispatch(googleOAuthLogin(googleToken)),
        setPicture: (image) => dispatch(changePicture(image)),
        postCar: (carName, totSeats, fuel, consumption) => dispatch(createCar(carName, totSeats, fuel, consumption)),
        addError: (text) => dispatch(addAlert(text, "error")),
    };
};


export default connect(null, mapDispatchToProps)(SignupComponent)