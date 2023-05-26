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
import { REGISTER_USER } from "../GQL/mutation/mutations";
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

export default function SignUp() {
  const [registerUser, { loading, error }] = useMutation(REGISTER_USER);
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
      const { data } = await registerUser({
        variables: {
          username: userData.get("email"),
          password: userData.get("password"),
        },
      });

      console.log(data);
      if (data?.register?.message?.message === "用戶名已存在") {
        // 注册失败，用户名已存在
        alert("用户名已存在，请使用其他用户名。");
      } else {
        // 注册成功，处理返回的 token 数据
        const token = data?.register?.token?.token;
        // 执行您希望的操作，例如保存 token 到本地存储、跳转到其他页面等
        ctx.login(token);
        navigate("/home");
      }
    } catch (error) {
      // 处理注册失败的错误
      console.error(error);

      // 显示具体的错误信息
      console.log("注册失败:", error.message);
    }

    console.log({
      email: userData.get("email"),
      password: userData.get("password"),
    });
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
              註冊
            </Typography>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
                
                {/* <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox value="allowExtraEmails" color="primary" />
                    }
                    label="我想收到活動相關資訊"
                  />
                </Grid> */}
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? "註冊中..." : "註冊"}
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
