import {createMuiTheme} from "@material-ui/core/styles";
export const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: '"Helvetica Neue"'
  },
  palette: {
    type: "light",
    primary: {
      light: "#acc4e2",
      main: "#8aaedb",
      dark: "#8799af",
      contrastText: "#000000"
    }
  },
  overrides: {
    Paper: {
      root: {
        padding: "15px"
      }
    },
    MuiInput: {root: {width: "200px"}},
    MuiInputBase: {
      root: {
        fontSize: 18,
        width: 350
      },
      input: {
        display: "flex"
      }
    }
  }
});
