import React, {useEffect, useState} from "react";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputAdornment from "@material-ui/core/InputAdornment";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SearchIcon from '@material-ui/icons/Search';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import {authLogout} from "../actions/authActions";
import {setSearch} from "../actions/searchActions";
import {connect} from "react-redux";
import {addAlert} from "../actions/alertActions";
import axios from "axios";
import PositionsDialog from "../components/map/PositionsDialog";
import {nominatimToPrimarySecondary} from "../utils";
import {Map, TileLayer, Marker, Popup} from "react-leaflet";
import Box from "@material-ui/core/Box";

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
    map: {
        width: '200px',
        height: '200px'
    },
    mapBox: {
        display: "block",
    }

}));


const MapContainer = (props) => {

        useEffect(() => {
            if (pos === "" && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    setPos(`SRID=4326;POINT (${position.coords.latitude} ${position.coords.longitude})`)
                    setLatitude(position.coords.latitude)
                    setLongitude(position.coords.longitude)
                })
            }
        })

        //will be props
        const [addr, setAddr] = useState("");
        const [pos, setPos] = useState("");

        const [latitude, setLatitude] = useState(44.629430);
        const [longitude, setLongitude] = useState(10.948296);
        const classes = useStyles();
        let [addrError, setAddrError] = useState(false)

        const [lastRequest, setLastRequest] = useState(new Date())

        const [open, setOpen] = useState(false);
        const [positions, setPositions] = useState([]);

        const [zoom, setZoom] = useState(13)

        const selectItem = (item) => {
            let {primary, secondary} = nominatimToPrimarySecondary(item);
            setAddr(`${primary} ${secondary}`);
            setPos(`SRID=4326;POINT (${item.lat} ${item.lon})`)
            setLatitude(parseInt(item.lat))
            setLongitude(parseInt(item.lon))
        }

        const getMapData = () => {
            axios
                .get(`https://nominatim.openstreetmap.org/search/?q=${encodeURI(addr)}&format=json&limit=3&addressdetails=1&dedupe=1`,)
                .then(res => {
                    setPositions(res.data);
                    setOpen(true)
                })
                .catch(err => {
                    props.addAlert("An error occurred while retrieving positions")
                })
        }

        const click = () => {
            let now = new Date()
            if (now - lastRequest > 1000) {
                getMapData()
            } else {
                console.log("will")
                setTimeout(getMapData, now - lastRequest);
            }
        }
        return (
            <div className={classes.root}>
                <FormControl variant="outlined" className={classes.form}>
                    <Grid container spacing={2}>
                        <Grid item xs={8} sm={4}>
                            <TextField fullWidth id="address" label="Address" placeholder="via Pietro Vivarelli 10, Modena"
                                       value={addr}
                                       onChange={(input) => {
                                           let name = input.target.value;
                                           if (name.length > 0) {
                                               setAddrError(false)
                                           } else {
                                               setAddrError(true)
                                           }
                                           setAddr(name);
                                       }}
                                       onBlur={(input) => {
                                           if (input.target.value === "") {
                                               setAddrError(true)
                                           }
                                       }}
                                       onKeyPress={(ev) => {
                                           if (ev.key === 'Enter') {
                                               click()
                                           }
                                       }}
                                       error={addrError}
                                       required
                                       helperText={addrError ? "Required" : ""}
                                       autoComplete="address-line1"/>
                        </Grid>
                        <Grid item xs={4} sm={2}>
                            <Button
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                startIcon={<SearchIcon/>}
                                disabled={!addr.length}
                                onClick={click}
                            >
                                Search
                            </Button>
                        </Grid>
                    </Grid>
                    <Box className={classes.mapBox}>
                        <Map
                            center={[latitude, longitude]}
                            zoom={zoom}
                            className={classes.map}
                        >
                            <TileLayer
                                attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker
                                draggable={true}
                                onDragend={(ev) => {
                                    console.log(ev)
                                }}
                                position={{lat: latitude, lng: longitude}}
                            >
                                <Popup minWidth={90}>
                                            <span>
                                              {"ciao"}
                                            </span>
                                </Popup>
                            </Marker>
                        </Map>
                    </Box>


                </FormControl>
                <PositionsDialog open={open} close={() => {
                    setOpen(false)
                }} positions={positions} selectItem={selectItem}/>
            </div>
        )
    }
;
const mapDispatchToProps = (dispatch) => {
    return {
        addAlert: (text) => (dispatch(addAlert(text, "error"))),
    }
}

export default connect(null, mapDispatchToProps)(MapContainer);