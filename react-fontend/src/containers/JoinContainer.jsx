import React, {useState} from 'react';
import {connect} from 'react-redux';
import Typography from "@material-ui/core/Typography";
import uuid from "node-uuid";
import {makeStyles} from "@material-ui/core/styles";
import ModalContainer from "./ModalContainer";
import MapContainer from "./MapContainer";
import FormContainer from "./FormContainer";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import {addAlert} from "../actions/alertActions";
import axios from "axios"
import {eventJoinURL} from "../constants/apiurls";
import {headers} from "../utils";
import {history} from "../App";
import {home, profile} from "../constants/pagesurls";
import JoinComponent from "../components/event/JoinComponent";

const useStyles = makeStyles((theme) => ({
    button: {
        width: '90%',
        marginBottom: theme.spacing(2),
    },
}))

const JoinContainer = ({addAlert, cars, token, open, close, event, refreshEvents}) => {
    const classes = useStyles();
    const [addr, setAddr] = useState("");
    const [pos, setPos] = useState("");
    const [car, setCar] = useState(-1);

    return (
        <>
            <ModalContainer open={open}
                            close={close}
                            header={
                                <Typography variant="h5" align="center">
                                    Join!
                                </Typography>}

            >

                <JoinComponent car={car} setCar={setCar} addr={addr} setAddr={setAddr} pos={pos} setPos={setPos}/>
                <Button variant="contained" className={classes.button} color="secondary" disabled={pos === ""}
                        onClick={() => {
                            console.log(event.id)
                            console.log(eventJoinURL(event.id))
                            axios
                                .post(
                                    eventJoinURL(event.id),
                                    {
                                        starting_address: addr,
                                        starting_pos: pos,
                                        car: car === -1 ? null : car
                                    },
                                    headers('application/json', token)
                                )
                                .then(res => {
                                        addAlert("Joined successfully", "success")
                                        refreshEvents();
                                        if (close)
                                            close()
                                    }
                                )
                                .catch(err => {
                                        console.log(err)
                                        addAlert("An error occurred while joining", "error")
                                        if (close)
                                            close()
                                    }
                                )
                        }}
                >
                    join
                </Button>
            </ModalContainer>
        </>
    )
}

function mapStateToProps(state) {
    return {
        cars: state.profile.carSet,
        token: state.auth.token,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        addAlert: (text, style = "error") => (dispatch(addAlert(text, style))),
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(JoinContainer);