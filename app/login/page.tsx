"use client";
import { useState } from "react";
import { useAuth } from "../../context/auth.context";
import Link from "next/link";
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Stack,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { errorToast, successToast } from "@/helper/toast";
import { setLoggedUser, setToken } from "@/store/slice/Base";
import { useRouter } from "next/navigation";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { login } = useAuth();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setError("");
    try {
      const response = await login(values.email, values.password);

      if (response?.data?.success) {

        router.push('/create');
        dispatch(setToken(response?.data?.token));
        dispatch(setLoggedUser(response?.data?.user));
        // if (response?.data?.requiresApproval) {
        //   // Store pending token and session info
        //   // dispatch(setPendingToken(response?.data?.pendingToken));
        //   // dispatch(
        //   //   setPendingSession({
        //   //     sessionId: response?.data?.pendingSessionId,
        //   //     message: response?.data?.message
        //   //   })
        //   // );
        //   // Show message
        //   successToast(response?.data?.message || 'Active session detected');
        // } else {
        //   // Normal login flow
        //   successToast(response.data.message);
        //   router.push('/home');
        //   dispatch(setToken(response?.data?.token));
        //   dispatch(setLoggedUser(response?.data?.user));
        //   // dispatch(setRoleDetails(response?.data?.roleDetails));
        //   // dispatch(setUserConfigs(response?.data?.userConfigs));

        //   // dispatch(setPendingToken(null));
        //   // dispatch(setPendingSession(null));
        // }
        // }
      } else {
        errorToast(response?.data?.message);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials");
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%', bgcolor: 'background.paper' }}>

      {/* Left side: Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 4, sm: 8, md: 12, lg: 16 },
          py: { xs: 6, md: 0 },
          position: 'relative'
        }}
      >
        <Container maxWidth="xs" sx={{ mx: 'auto', p: 0 }}>

          {/* Logo / Brand Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 6 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'text.primary',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'background.paper' }}>P</Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', letterSpacing: '-0.5px' }}>
              Postiz
            </Typography>
          </Box>

          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Log in
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            New to Postiz?{" "}
            <Link href="/register" passHref style={{ textDecoration: 'none' }}>
              <Typography component="span" sx={{ fontWeight: 500, color: '#2e7d32', '&:hover': { textDecoration: 'underline' } }}>
                Create an account
              </Typography>
            </Link>
          </Typography>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form noValidate autoComplete="off">
                <Stack spacing={3}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    required
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
                      <Link href="#" passHref style={{ textDecoration: 'none' }}>
                        <Typography variant="body2" sx={{ color: '#2e7d32', '&:hover': { textDecoration: 'underline' } }}>
                          Forgot your password?
                        </Typography>
                      </Link>
                    </Box>
                    <TextField
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      fullWidth
                      required
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      }}
                    />
                  </Box>

                  {error && (
                    <Alert severity="error">{error}</Alert>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    disableElevation
                    sx={{
                      mt: 1,
                      bgcolor: '#A3E695',
                      color: 'black',
                      fontWeight: 'bold',
                      py: 1.5,
                      '&:hover': { bgcolor: '#8CD57E' },
                      '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#9e9e9e' }
                    }}
                  >
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Log In"}
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Container>
      </Box>

      {/* Right side: Graphic/Image (Hidden on mobile) */}
      <Box
        sx={{
          flex: 1,
          bgcolor: '#FFD570',
          p: { md: 6, lg: 12 },
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative background pattern overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.2,
            backgroundImage: 'radial-gradient(circle at center, #000 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 10, maxWidth: 500 }}>
          <Box
            sx={{
              display: 'inline-block',
              px: 2,
              py: 0.5,
              border: '1px solid black',
              borderRadius: '20px',
              bgcolor: 'white',
              mb: 3
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              NEW
            </Typography>
          </Box>
          <Typography
            variant="h3"
            sx={{ fontWeight: '900', color: 'text.primary', mb: 5, lineHeight: 1.1, letterSpacing: '-1px' }}
          >
            Manage your social media presence easily
          </Typography>

          {/* Abstract representation of the UI graphic from the reference image */}
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 3,
              boxShadow: 24,
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              transform: 'rotate(2deg)',
              transition: 'transform 0.5s',
              '&:hover': { transform: 'rotate(0deg)' }
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'grey.200' }} />
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
                <Box sx={{ height: 16, bgcolor: 'grey.200', borderRadius: 1, width: '33%' }} />
                <Box sx={{ height: 12, bgcolor: 'grey.100', borderRadius: 1, width: '66%' }} />
              </Box>
            </Box>
            <Stack spacing={2}>
              <Box sx={{ height: 80, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.100' }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ height: 40, width: 96, bgcolor: 'primary.main', borderRadius: 1 }} />
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}