import React, {useEffect, useState} from "react";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SearchIcon from '@material-ui/icons/Search';
import Typography from "@material-ui/core/Typography";
import PositionsDialog from "../components/map/PositionsDialog";
import {handleError, handleInfo, nominatimToPrimarySecondary} from "../utils/utils";
import Box from "@material-ui/core/Box";
import {Map, Marker, TileLayer} from "react-leaflet";
import {useSnackbar} from "notistack";
import {getNominatimAddress, getNominatimInfo} from "../utils/api";

/**
 * Map Container has a search field to search for an address
 * (using nominatim see {@link https://nominatim.org/release-docs/develop/api/Search/}) and an interactive map
 * where the marker can be dragged around.
 *
 */
const MapContainer = (props) => {
    const classes = useStyles();
    const {enqueueSnackbar,} = useSnackbar();
    const {addr, setAddr, pos, setPos, loadUserPosition = true} = props

    const [latitude, setLatitude] = useState(pos !== "" ? parseFloat(pos.split(' ')[1].slice(1)) : 44.629430);
    const [longitude, setLongitude] = useState(pos !== "" ? parseFloat(pos.split(' ')[2].slice(0, -1)) : 10.948296);

    let [addrError, setAddrError] = useState(false)

    const [lastRequest,] = useState(new Date())

    const [open, setOpen] = useState(false);
    const [positions, setPositions] = useState([]);

    const [zoom, setZoom] = useState(13)

    /**
     * Given a nominatim address convert it to latitude/longitude; address and position
     *
     * @param {object} item nominatim address
     * @param {number} lat
     * @param {number} lon
     */
    const selectItem = (item, lat = undefined, lon = undefined) => {
        let {primary, secondary} = nominatimToPrimarySecondary(item);
        setAddr(`${primary} ${secondary}`);
        setPos(`SRID=4326;POINT (${item.lat} ${item.lon})`)
        if (lat !== undefined) {
            setLatitude(parseFloat(item.lat))
        } else {
            setLatitude(item.lat)
        }

        if (lon !== undefined) {
            setLongitude(lon);
        } else {
            setLongitude(item.lon);
        }
    }

    /**
     * Search for the inputted address with nominatim
     */
    const getMapData = () => {
        getNominatimAddress(addr,
            (res) => {
                if (res.data.length === 0) {
                    handleInfo(enqueueSnackbar, "No positions found for given address")
                    return;
                }
                setPositions(res.data);
                setOpen(true);
            },
            (err) => {
                handleError(enqueueSnackbar, "Something went wrong while retrieving positions [044]", err)
            })
    }

    /**
     * To ensure nominatim requirements of not more than 1 request per second.
     *
     * see {@link https://operations.osmfoundation.org/policies/nominatim/}
     */
    const click = () => {
        let now = new Date()
        if (now - lastRequest > 1000) {
            getMapData()
        } else {
            setTimeout(getMapData, now - lastRequest);
        }
    }

    useEffect(() => {
        if (pos === "" && navigator.geolocation && loadUserPosition) {
            navigator.geolocation.getCurrentPosition((position) => {
                getNominatimInfo(position.coords.latitude, position.coords.longitude,
                    (res) => {
                        selectItem(res.data, position.coords.latitude, position.coords.longitude);
                    },
                    (err) => {
                        handleInfo(enqueueSnackbar, "Something went wrong while retrieving your position [045]", err)
                    })
            })
        }
    })

    return (
        <div className={classes.root}>
            <FormControl variant="outlined" className={classes.form}>
                <Grid container spacing={2}>
                    <Grid item xs={6} sm={8}>
                        <TextField fullWidth id="address" label="Address"
                                   placeholder="via Pietro Vivarelli 10, Modena"
                                   value={addr}
                                   onChange={(input) => {
                                       let name = input.target.value;
                                       if (input.target.value.length > 0) {
                                           setAddrError(false)
                                       } else {
                                           setAddrError(true)
                                       }
                                       setAddr(name);
                                   }}
                                   onBlur={(input) => {
                                       if (input.target.value === "") {
                                           setAddrError(true)
                                       } else {
                                           setAddrError(false)
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
                    <Grid item xs={6} sm={4}>
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
                        style={{width: '100%', height: '600px'}}
                        onZoomEnd={(e) => {
                            setZoom(e.target._zoom)
                        }}
                        className={classes.map}
                    >
                        <TileLayer
                            attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker
                            draggable={true}
                            onDragend={(ev) => {
                                getNominatimInfo(ev.target._latlng.lat, ev.target._latlng.lng,
                                    (res) => {
                                        selectItem(res.data, ev.target._latlng.lat, ev.target._latlng.lng);
                                        setAddrError(false);
                                    },
                                    (err) => {
                                        handleError(enqueueSnackbar, "Something went wrong while retrieving " +
                                            "your selected location [046]", err)
                                    })
                            }}
                            position={{lat: latitude, lng: longitude}}
                        >
                        </Marker>
                    </Map>
                    <Typography variant="body2" color="textSecondary">
                        You can move the pin on the map to select the exact location
                    </Typography>
                </Box>
            </FormControl>
            <PositionsDialog open={open} close={() => {
                setOpen(false)
            }} positions={positions} selectItem={selectItem}/>
        </div>
    )
}


const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2),
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%',
    },
    button: {
        width: '100%',
        marginTop: 12,
    },

    map: {
        width: '100%',
        height: '100%',
        maxHeight: "40vh",
    },
    mapBox: {
        margin: theme.spacing(2),
        display: "block",
    }

}));


export default MapContainer