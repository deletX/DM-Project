import {createMuiTheme, responsiveFontSizes} from "@material-ui/core";

/**
 * App theme with app primary and secondary colors.
 * @type {Theme}
 */
let theme = createMuiTheme({
    palette: {
        primary: {
            light: '#52c7b8',
            main: '#009688',
            dark: '#00675b',
            contrastText: '#000',
        },
        secondary: {
            light: '#ffc246',
            main: '#ff9100',
            dark: '#c56200',
            contrastText: '#000',
        },
        background: {
            paper: '#f0f0f0',
        }
    },
});

/**
 * Same as main app color, but with white text and colorings for textfields
 * @type {Theme}
 */
export const white_text_theme = responsiveFontSizes(createMuiTheme({
    palette: {
        primary: {
            light: '#52c7b8',
            main: '#009688',
            dark: '#00675b',
            contrastText: '#000',
        },
        secondary: {
            light: '#ffc246',
            main: '#ff9100',
            dark: '#c56200',
            contrastText: '#000',
        },
        background: {
            paper: '#f0f0f0',
        },
        text: {
            primary: "#fff",
            secondary: "#000",
        }
    },
    overrides: {
        MuiInput: {
            underline: {
                "&:before": {
                    borderBottomColor: "rgba(255, 255, 255, 0.7)"
                }
            },
        },
        MuiInputLabel: {
            root: {
                color: "white"
            }
        },
        MuiPickersDay: {
            day: {
                color: "rgba(0, 0, 0, 0.87)"
            },
            dayDisabled: {
                color: "rgba(0, 0, 0, 0.38)"
            },
        },
        MuiPickersCalendarHeader: {
            transitionContainer: {
                color: "rgba(0, 0, 0, 0.87)"
            }
        },
        MuiPickersYear: {
            root: {
                color: "rgba(0, 0, 0, 0.87)"
            }
        },
        MuiPickersClockNumber: {
            clockNumber: {
                color: "rgba(0, 0, 0, 0.87)"
            }
        },
        MuiIconButton: {
            root: {
                color: "rgba(255,255, 255, 0.74)",
            }
        }
    }
}));


theme = responsiveFontSizes(theme);

export default theme;