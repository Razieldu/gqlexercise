import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../GQL/mutation/mutations";
import { useNavigate } from "react-router-dom";
import { userAccountContextAPi } from "../store/handleUserAccountContextApi";
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

export default function SignIn() {
  const [loginUser, { loading, error }] = useMutation(LOGIN_USER);
  let navigate = useNavigate();
  const ctx = React.useContext(userAccountContextAPi);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = new FormData(event.currentTarget);
    if(!userData.get("email").includes("@")){
      alert("請輸入有效電子郵件")
      return
    }
    try {
      const { data } = await loginUser({
        variables: {
          username: userData.get("email"),
          password: userData.get("password"),
        },
      });
      console.log(`${data}前端data`);
      if (data?.login?.message?.message === "使用者名稱不存在") {
        alert("用户名不存在");
      } else if (data?.login?.message?.message === "密碼不正確") {
        alert("密碼錯誤");
      } else {
        console.log(data.login)
        const userData = data?.login?.userData
        ctx.login(userData);
        navigate("/home");
      }
    } catch (error) {
      // 处理注册失败的错误
      console.error(error);

      // 显示具体的错误信息
      console.log("注册失败:", error.message);
    }
  };
  if (!ctx.isLoggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              登入
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? "登入中..." : "登入"}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/forgotPassword" variant="body2">
                    忘記密碼?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signup" variant="body2">
                    {"尚未註冊嗎? 點擊註冊"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    );
  } else {
    return <Navigate to="/home" />;
  }
}
