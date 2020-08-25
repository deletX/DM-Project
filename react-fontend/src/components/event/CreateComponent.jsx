import React, {useState} from 'react';
import {connect} from 'react-redux';
import FormContainer from "../../containers/FormContainer";
import CardContainer from "../../containers/CardContainer";
import NewEventFormComponent from "./create/NewEventFormComponent"
import MapContainer from "../../containers/MapContainer";
import JoinComponent from "./JoinComponent";
import StepperContainer from "../../containers/StepperContainer";
import {useHistory} from "react-router-dom";
import {addEvent, login} from "../../constants/pagesurls";
import {defaultEventPic} from "../../constants/constants";
import ReviewCreateComponent from "./create/ReviewCreateComponent";
import {handleError, handleSuccess} from "../../utils/utils";
import {addAlert} from "../../actions/alertActions";
import {postCreateEvent, postJoinEvent} from "../../utils/api";
import {useSnackbar} from 'notistack';


function mapStateToProps(state) {
    return {
        isAuthenticatedOrLoading: state.auth.token !== undefined || state.auth.loading,
        loading: state.auth.loading,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        addAlert: (text, style) => dispatch(addAlert(text, style)),
    };
}

// const useStyles = makeStyles((theme) => ({
//     content: {
//         marginBottom: theme.spacing(2),
//         // width: '800px',
//         // display: 'flex',
//         // flexDirection: 'column',
//         // alignItems: 'center',
//         width: '43ch'
//     }
// }))

const CreateComponent = ({addAlert, isAuthenticatedOrLoading}) => {
    //const classes = useStyles();
    let history = useHistory()

    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [date, setDate] = useState(new Date((new Date()).getTime() + 5400 * 1000));
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null)
    const [imageURL, setImageURL] = useState(defaultEventPic);

    const [destination, setDestination] = useState("");
    const [destinationPos, setDestinationPos] = useState("");

    const [address, setAddress] = useState("");
    const [pos, setPos] = useState("");
    const [car, setCar] = useState(-1);

    const {enqueueSnackbar, } = useSnackbar();

    const getStepContent = (step, handleNext, isStepSkipped) => {
        switch (step) {
            case 0:
                return (
                    <NewEventFormComponent
                        name={name} setName={setName} date={date} setDate={setDate}
                        description={description}
                        setDescription={setDescription}
                        image={image} setImage={setImage}
                        imageURL={imageURL} setImageURL={setImageURL}
                    />)
            case 1:
                return <MapContainer addr={destination} setAddr={setDestination} pos={destinationPos}
                                     setPos={setDestinationPos} loadUserPosition={false}/>

            case 2:
                return <JoinComponent car={car} setCar={setCar} pos={pos} setPos={setPos} addr={address}
                                      setAddr={setAddress}/>


            case 3:
                return <ReviewCreateComponent name={name} date={date} description={description}
                                              destination={destination} car={car} address={address}
                                              imageURL={imageURL} isStepSkipped={isStepSkipped}/>
            default:
                return "Unknown step";
        }
    };

    const uploadData = (reset, isStepSkipped) => {
        if (open) return;
        console.log("uploading")

        let token = localStorage.getItem("access_token");
        let data;
        setOpen(true)
        if (image !== null) {
            data = new FormData();
            data.append("picture", image, image.name);
            data.append("name", name);
            data.append("description", description)
            data.append("address", destination)
            data.append("destination", destinationPos)
            data.append("date_time", `${date.getUTCFullYear()}-${date.getUTCMonth() < 10 ? '0' : ''}${date.getUTCMonth() + 1}-${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}`)
        } else {
            data = {
                name: name,
                description: description,
                address: destination,
                destination: destinationPos,
                date_time: `${date.getUTCFullYear()}-${date.getUTCMonth() < 10 ? '0' : ''}${date.getUTCMonth() + 1}-${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}`,
            }
        }

        postCreateEvent(token, data, image,
            (res) => {
                //addAlert("Event created successfully", "success")
                history.goBack()
                let event = res.data
                console.log(res.data)
                handleSuccess(enqueueSnackbar, "Event created successfully")
                if (!isStepSkipped(2))
                    postJoinEvent(event.id, address, pos, car, token,
                        (res) => {
                            //addAlert("Joined successfully", "success")
                            handleSuccess(enqueueSnackbar, "Joined successfully")
                            if (open)
                                setOpen(false)
                        },
                        (err) => {
                            console.log(err)
                            //addAlert("An error occurred while joining", "error")
                            handleError(enqueueSnackbar, "An error occurred while joining")
                            if (open)
                                setOpen(false)
                        })
            },
            (err) => {
                //addAlert("An error occurred while creating the event", "error")
                handleError(enqueueSnackbar, "An error occurred while creating the event")
                reset(true)
                if (open)
                    setOpen(false)
            })
    }

    return (
        <FormContainer
            effect={() => {
                if (!isAuthenticatedOrLoading) {
                    history.push(`${login}?next=${encodeURI(addEvent)}`);
                }
            }}>
            <CardContainer title={"Add Event"} loading={true} open={open}>
                <StepperContainer
                    getSteps={() => (
                        ["Event Details", "Destination", "Join", "Review"]
                    )}
                    getStepContent={getStepContent}
                    isStepValid={(step) => {
                        let now = new Date()
                        now = new Date(now.getTime() + 3600 * 1000)
                        switch (step) {
                            case 0:
                                return name.length > 0 && date > now && description.length > 0;
                            case 1:
                                return destinationPos !== "" && destination !== "";
                            case 2:
                                return pos !== "" && address !== "";
                            default:
                                return true;
                        }
                    }}
                    isStepOptional={(step) => {
                        return step === 2;
                    }}
                    clear={(step) => {
                        switch (step) {
                            case 0:
                                setName("")
                                setDescription("")
                                setDate(Date.now())
                                break;
                            case 1:
                                setDestination("");
                                setDestinationPos("");
                                break;
                            case 2:
                                setCar(-1);
                                setAddress("");
                                setPos("");
                                break;
                            default:
                                break;
                        }
                    }}
                    uploadData={uploadData}
                    finalButtonText="Add Event"
                />
            </CardContainer>
        </FormContainer>
    );
}


export default connect(
    mapStateToProps, mapDispatchToProps
)(CreateComponent);