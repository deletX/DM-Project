import React, {useState} from 'react';
import {connect} from 'react-redux';
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import ModalContainer from "./ModalContainer";
import Button from "@material-ui/core/Button";
import {handleError, handleSuccess} from "../utils/utils";
import JoinComponent from "../components/event/JoinComponent";
import {postJoinEvent} from "../utils/api";
import {useSnackbar} from 'notistack';

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
    const {enqueueSnackbar,} = useSnackbar();

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
                            //console.log(event.id)
                            //console.log(eventJoinURL(event.id))
                            postJoinEvent(event.id, addr, pos, car, token,
                                (res) => {
                                    //addAlert("Joined successfully", "success")
                                    handleSuccess(enqueueSnackbar, "Joined successfully")
                                    refreshEvents();
                                    if (close)
                                        close()
                                },
                                (err) => {
                                    console.log(err)
                                    handleError(enqueueSnackbar, "An error occurred while joining")
                                    //addAlert("An error occurred while joining", "error")
                                    if (close)
                                        close()
                                })
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


export default connect(mapStateToProps,)(JoinContainer);