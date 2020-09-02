import React, {useState} from "react";
import PersonalInfoForm from "./signup/PersonalInfoForm";
import CarForm from "./signup/CarForm";
import SummaryData from "./signup/SummaryData";
import {home} from "../../constants/pagesurls";
import {useHistory} from "react-router-dom";
import {authSignup, googleOAuthLogin} from "../../actions/authActions";
import {connect} from "react-redux";
import {changePicture, createCar} from "../../actions/profileActions";
import CardContainer from "../../containers/CardContainer";
import StepperContainer from "../../containers/StepperContainer";
import {Helmet} from "react-helmet";
import {useSnackbar} from 'notistack';

function SignupComponent({authSignup, googleLogin, setPicture, postCar}) {
    let history = useHistory()

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
    const {enqueueSnackbar,} = useSnackbar();

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
            googleLogin(googleAccessToken, enqueueSnackbar).then((value) => {
                if (value instanceof Error) {
                    setOpen(false);
                    restart(true);
                } else {
                    if (carName !== "") {
                        postCar(carName, totSeats, fuel, consumption, enqueueSnackbar).then(
                            () => {
                                if (image !== null && imageURL !== "") {
                                    setPicture(image, enqueueSnackbar).then(() => {
                                        history.push(home)
                                    })
                                }
                            }
                        )
                    } else if (image !== null && imageURL !== "") {
                        setPicture(image, enqueueSnackbar).then(() => {
                            history.push(home)
                        })
                    }
                }
            })
        } else {
            authSignup(username, firstName, lastName, email, password, enqueueSnackbar).then((value) => {
                if (value instanceof Error) {
                    setOpen(false);
                    restart(true);
                } else {
                    if (carName !== "") {
                        postCar(carName, totSeats, fuel, consumption, enqueueSnackbar)
                            .then(() => {
                                    if (image !== null && imageURL !== "") {
                                        setPicture(image, enqueueSnackbar).then(() => {
                                            history.push(home)
                                        })
                                    }
                                }
                            )
                    } else if (image !== null && imageURL !== "") {
                        setPicture(image, enqueueSnackbar).then(() => {
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
        authSignup: (username, firstName, lastName, email, password, enqueueSnackbar) => dispatch(authSignup(username, firstName, lastName, email, password, enqueueSnackbar)),
        googleLogin: (googleToken, enqueueSnackbar) => dispatch(googleOAuthLogin(googleToken, enqueueSnackbar)),
        setPicture: (image, enqueueSnackbar) => dispatch(changePicture(image, enqueueSnackbar)),
        postCar: (carName, totSeats, fuel, consumption, enqueueSnackbar) => dispatch(createCar(carName, totSeats, fuel, consumption, enqueueSnackbar)),
    };
};


export default connect(null, mapDispatchToProps)(SignupComponent)