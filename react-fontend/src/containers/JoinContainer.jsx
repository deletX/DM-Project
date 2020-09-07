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


const JoinContainer = (props) => {
    const classes = useStyles();
    const {enqueueSnackbar,} = useSnackbar();
    const {token, open, close, event, refreshEvents} = props;

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
                            postJoinEvent(event.id, addr, pos, car, token,
                                (res) => {
                                    handleSuccess(enqueueSnackbar, "Joined successfully")
                                    refreshEvents();
                                    if (close)
                                        close()
                                },
                                (err) => {
                                    handleError(enqueueSnackbar, "Something went wrong while joining [043]", err)
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

const useStyles = makeStyles((theme) => ({
    button: {
        width: '90%',
        marginBottom: theme.spacing(2),
    },
}))


function mapStateToProps(state) {
    return {
        token: state.auth.token,
    };
}


export default connect(mapStateToProps,)(JoinContainer);