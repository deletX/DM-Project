import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import * as pagesURL from "../../constants/pagesurls";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import React, {useEffect} from "react";
import {fade} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {connect} from "react-redux";
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import NotificationItem from "./NotificationItem";
import Divider from "@material-ui/core/Divider";
import {login, myProfile} from "../../constants/pagesurls";
import {signup} from "../../constants/pagesurls";
import {authLogout} from "../../actions/authActions";
import logo from "../../icons/logo.svg"
import {setSearch} from "../../actions/searchActions";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: "inherit",
        textDecoration: "inherit",
        display: 'none',
        outline: 0,
        marginLeft: 10,
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 5,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    logo: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        maxHeight: '60px',
        outline: 0,
    },
    list: {
        minWidth: 250,
        maxWidth: 500,
        width: "15vw",
    },
    fullList: {
        width: 'auto',
    },
    drawerTitle: {
        margin: 10,
    },
    logout: {
        marginLeft: 20,
    }
}));


function NavBar({isAuthenticated, notifications, authLogout, setSearch, search}) {
    let history = useHistory();
    const classes = useStyles();
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [notificationsNumber, setNotificationsNumber] = React.useState(notifications.filter((notification) => (!notification.read)).length)

    useEffect(() => {
        setNotificationsNumber(notifications.filter((notification) => (!notification.read)).length)
    }, [notifications])

    const readNotification = () => {
        setNotificationsNumber(notificationsNumber - 1)
    }
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setDrawerOpen(open);
    };

    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const logoutButton = (
        <Button color={"inherit"} className={classes.logout} onClick={() => {
            handleMobileMenuClose()
            authLogout()
        }}> Logout</Button>
    );

    const menuId = 'primary-search-account-menu';
    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem
                onClick={(event) => {
                    toggleDrawer(true)(event);
                    handleMobileMenuClose()
                }}>
                <IconButton aria-label={`show ${notificationsNumber} new notifications`} color="inherit">
                    <Badge badgeContent={notificationsNumber} color="secondary">
                        <NotificationsIcon/>
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={() => {
                history.push(myProfile)
            }}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle/>
                </IconButton>
                <p>Profile</p>
            </MenuItem>
            <MenuItem>
                {logoutButton}
            </MenuItem>
        </Menu>
    );

    let notificationListItem = notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} readNotificationNavBar={readNotification}/>
    ));

    const notificationDrawer = (
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
            <div className={classes.list}
                 role="presentation"
                 onClick={toggleDrawer(false)}
                 onKeyDown={toggleDrawer(false)}>
                <Divider/>
                <Typography className={classes.drawerTitle} variant="h6">
                    Notifications:
                </Typography>
                <Divider/>
                <List>
                    {notificationListItem}
                </List>
            </div>
        </Drawer>
    );


    return (
        <div className={classes.grow}>
            <AppBar position="static">
                <Toolbar>
                    <button className={classes.logo} onClick={() => {
                        isAuthenticated ? history.push(pagesURL.home) : history.push(pagesURL.landingPage)
                    }}>

                        <img src={logo} alt="logo" className={classes.logo}/>
                    </button>
                    <Typography className={classes.title} variant="h6" noWrap component="button"
                                onClick={() => {
                                    isAuthenticated ? history.push(pagesURL.home) : history.push(pagesURL.landingPage)
                                }}>
                        DM Project
                    </Typography>
                    {isAuthenticated ? (
                        <>
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon/>
                                </div>
                                <InputBase
                                    placeholder="Search…"
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    inputProps={{'aria-label': 'search'}}
                                    onChange={(input) => {
                                        console.log(input.target.value)
                                        setSearch(input.target.value)
                                    }}
                                />
                            </div>

                            <div className={classes.grow}/>
                            <div className={classes.sectionDesktop}>
                                <IconButton aria-label={`show ${notificationsNumber} new notifications`} color="inherit"
                                            onClick={toggleDrawer(true)}>
                                    <Badge badgeContent={notificationsNumber} color="secondary">
                                        <NotificationsIcon/>
                                    </Badge>
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={() => {
                                        history.push(myProfile)
                                    }}
                                    color="inherit"
                                >
                                    <AccountCircle/>
                                </IconButton>
                                {logoutButton}
                            </div>
                            <div className={classes.sectionMobile}>
                                <IconButton
                                    aria-label="show more"
                                    aria-controls={mobileMenuId}
                                    aria-haspopup="true"
                                    onClick={handleMobileMenuOpen}
                                    color="inherit"
                                >
                                    <MoreIcon/>
                                </IconButton>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={classes.grow}/>
                            <Button variant="contained" color="secondary" disableElevation onClick={() => {
                                history.push(signup)
                            }}>
                                Signup
                            </Button>
                            <Button color="inherit" disableElevation onClick={() => {
                                history.push(login)
                            }}>
                                Login
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {notificationDrawer}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== undefined,
        notifications: state.notifications.notifications,
        search: state.search,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        authLogout: () => dispatch(authLogout()),
        setSearch: (search) => dispatch(setSearch(search)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);