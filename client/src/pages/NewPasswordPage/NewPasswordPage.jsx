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
import { LOGIN_USER } from "../../GQL/mutation/mutations";
import { userAccountContextAPi } from "../../store/handleUserAccountContextApi";
import { Navigate, useLoaderData } from "react-router-dom";
import client from "../../GQL/apollo";
import { getTokenToVerifyResetPassword } from "../../GQL/query/query";
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

export default function NewPasswordPage() {
  const [allowEnter, setAllowEnter] = React.useState(false);
  const [permissionReady, setPermissionReady] = React.useState(false);
  const [loginUser, { loading, error }] = useMutation(LOGIN_USER);
  const ctx = React.useContext(userAccountContextAPi);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = new FormData(event.currentTarget);
    if (userData.get("password") === "" || userData.get("password1") === "") {
      alert("請輸入密碼");
      return;
    }
    if (userData.get("password") !== userData.get("password2")) {
      alert("新舊密碼不同");
      return;
    }
    try {
      const { data } = await loginUser({
        variables: {
          password: userData.get("password"),
        },
      });
      console.log(`${data}前端data`);
      //   if (data?.login?.message?.message === "使用者名稱不存在") {
      //     alert("用户名不存在");
      //   } else if (data?.login?.message?.message === "密碼不正確") {
      //     alert("密碼錯誤");
      //   } else {
      //     console.log(data.login)
      //     const userData = data?.login?.userData
      //     ctx.login(userData);
      //     navigate("/home");
      //   }
    } catch (error) {
      // 处理注册失败的错误
      console.error(error);

      // 显示具体的错误信息
      console.log("重置失败:", error.message);
    }
  };
  const tokenFromUrl = useLoaderData();
  const checkTokenAndAllowEnter = async () => {
    const {
      loading: queryLoading,
      errors,
      data,
    } = await client.query({
      query: getTokenToVerifyResetPassword,
      variables: {
        token: tokenFromUrl,
      },
    });
    console.log(data.findTokenToResetPassword);
    setAllowEnter(data.findTokenToResetPassword.permission);
    setPermissionReady(true);
  };

  React.useEffect(() => {
    checkTokenAndAllowEnter();
  }, []);

  if (!ctx.isLoggedIn && allowEnter && permissionReady) {
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
              重置密碼
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 4 }}
            >
              <Typography
                sx={{ mt: 1, fontSize: "15px" }}
                component="h5"
                variant="h5"
              >
                請輸入新密碼
              </Typography>
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
              <Typography
                sx={{ mt: 2, fontSize: "15px" }}
                component="h5"
                variant="h5"
              >
                再次輸入新密碼
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password2"
                label="Password2"
                type="password2"
                id="password2"
                autoComplete="comfirm-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? "登入中..." : "確認新密碼"}
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
  } else if (!ctx.isLoggedIn && !allowEnter && permissionReady) {
    return <Navigate to="/forgotPassword" />;
  } else if (ctx.isLoggedIn) {
    return <Navigate to="/home" />;
  }
}
