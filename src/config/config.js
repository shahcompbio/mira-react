import { createMuiTheme } from "@material-ui/core/styles";
export const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: '"Helvetica Neue"'
  },
  palette: {
    primary: {
      light: "#c8f7c5",
      main: "#bfe6dd",
      dark: "#8799af",
      contrastText: "#000000"
    }
  },
  overrides: {
    MuiButton: {
      contained: {
        backgroundColor: "#ffffff !important",
        boxShadow: "none",
        "&:hover": {
          backgroundColor: "#ffffff"
        }
      },
      sizeLarge: {
        padding: "8px 10px 0px 10px"
      }
    },
    Paper: {
      root: {
        padding: "15px"
      }
    },
    MuiInput: { root: { width: "200px" } },
    MuiInputBase: {
      root: {
        fontSize: 18,
        width: 200
      },
      input: {
        display: "flex"
      }
    },
    MuiTableCell: { root: { padding: "10px 30px 10px 10px" } },
    MuiExpansionPanel: { rounded: { borderRadius: "5px" } },
    MuiOutlinedInput: { input: { padding: "10px" } },
    MuiExpansionPanelSummary: {
      root: { borderRadius: "5px" },
      content: {
        "&$expanded": {
          margin: "20px 0 0 0"
        }
      }
    }
  }
});
