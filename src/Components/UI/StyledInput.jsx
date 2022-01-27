import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledInput = styled((props) => (
  <TextField InputProps={{ disableUnderline: true }} {...props} />
))(({ theme }) => ({
  "& .MuiFilledInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
    borderRadius: 4,
    // backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      //boxShadow: `rgba(255, 255, 255, 0.05) 0 0 0 2px`,
      borderColor: "rgba(255, 99, 132, 1)",
    },
    "& > input": {
      padding: "12px 14px",
      color: "#EEEEEE",
      textAlign: "center",
    },
  },
}));

export default StyledInput;
