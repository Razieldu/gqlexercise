import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "../../GQL/mutation/mutations";
// import { useNavigate } from "react-router-dom";
import { userAccountContextAPi } from "../../store/handleUserAccountContextApi";
import { Navigate } from "react-router-dom";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function ForgotPassword() {
  // const [isLoading, setIsLoaiding] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const ctx = React.useContext(userAccountContextAPi);
  const [resetPassword, { loading, error }] = useMutation(RESET_PASSWORD);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = new FormData(event.currentTarget);
    try {
      if (userData.get("email") === "") {
        alert("請輸入電子郵件");
        return;
      }
      const { data } = await resetPassword({
        variables: {
          email: userData.get("email"),
        },
      });
      setMessage(data.sendPasswordResetEmail.message.message);
    } catch (error) {
      console.error(error);
    }
    console.log({
      email: userData.get("email"),
    });
  };

  if (!ctx.isLoggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 2, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              重置密碼
            </Typography>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item sx={{ width: "25vw" }}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid> */}
                {/* <Grid item   sx={{ textAlign:"center",mt: 2, mb: 2 }} xs={12}> */}
                {/* <FormControlLabel
                    control={
                      <Checkbox value="allowExtraEmails" color="primary" />
                    }
                    label="我想收到活動相關資訊"
                  /> */}
                {/* 發送重置郵件至您的信箱 */}
                {/* </Grid> */}
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {message?"重置電子郵件已寄送":"發送郵件"}
                {/* {loading ? "發送郵件中..." : "發送E-mail"} */}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/" variant="body2">
                    已經擁有帳號 ? 點擊前往登入頁面
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
    );
  } else {
    return <Navigate to="/home" />;
  }
}
