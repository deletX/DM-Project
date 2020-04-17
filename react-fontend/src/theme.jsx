import {createMuiTheme, responsiveFontSizes} from "@material-ui/core/styles";

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

theme = responsiveFontSizes(theme);

export default theme;