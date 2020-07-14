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
//import {history} from "../../App";
import {useHistory} from "react-router-dom";
import {authCheckState, authLogin, authSignup, googleOAuthLogin} from "../../actions/authActions";
import {connect} from "react-redux";
import {changePicture, createCar} from "../../actions/profileActions";
import {addAlert} from "../../actions/alertActions";
import CardContainer from "../../containers/CardContainer";
import StepperContainer from "../../containers/StepperContainer";
import {Helmet} from "react-helmet";

const useStyles = makeStyles((theme) => ({

    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    }
}));

function SignupComponent({authSignup, googleLogin, setPicture, postCar, addError}) {
    let history=useHistory()

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

    const [open, setOpen] = useState(false);
    const getStepContent = (step, handleNext) => {
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


    const uploadData = (restart) => {
        if (!open)
            setOpen(true);
        else if (isGoogleLogin) {
            googleLogin(googleAccessToken).then((value) => {
                if (value instanceof Error) {
                    addError("An error occurred while signing you up with google")
                    console.log(value)
                    setOpen(false);
                    restart(true);
                } else {
                    if (carName !== "") {
                        postCar(carName, totSeats, fuel, consumption).then(
                            () => {
                                if (image !== null && imageURL !== "") {
                                    setPicture(image).then(() => {
                                        history.push(home)
                                    })
                                }
                            }
                        )
                    } else if (image !== null && imageURL !== "") {
                        setPicture(image).then(() => {
                            history.push(home)
                        })
                    }
                }
            })
        } else {
            authSignup(username, firstName, lastName, email, password).then((value) => {
                if (value instanceof Error) {
                    addError("An error occurred while signing you up")
                    console.log(value)
                    setOpen(false);
                    restart(true);
                } else {
                    if (carName !== "") {
                        postCar(carName, totSeats, fuel, consumption)
                            .then(() => {
                                    if (image !== null && imageURL !== "") {
                                        setPicture(image).then(() => {
                                            history.push(home)
                                        })
                                    }
                                }
                            )
                    } else if (image !== null && imageURL !== "") {
                        setPicture(image).then(() => {
                            history.push(home)
                        })
                    }

                }
            })
        }
    }

    return (
        <CardContainer title="Sign up!" open={open}>
            <Helmet>
                <title>React App - Signup</title>
            </Helmet>
            <StepperContainer
                getSteps={() => (
                    ["Personal Info", "Add your Car", "Submit!"]
                )}
                getStepContent={getStepContent}
                isStepValid={(step) => {
                    switch (step) {
                        case 0:
                            return (!emailError && email.length > 0 && !usernameError && username.length > 0 && !passwordError && password.length > 0) || isGoogleLogin;
                        case 1:
                            return carName.length > 0;
                        default:
                            return true;
                    }
                }}
                isStepOptional={(step) => {
                    return step === 1;
                }}
                clear={(step) => {
                    if (step === 1) {
                        setCarName("")
                        setTotSeats(4)
                        setFuel(1)
                        setConsumption(10)
                    }
                }}
                uploadData={uploadData}
                finalButtonText="Sign Up!"
            />
        </CardContainer>
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