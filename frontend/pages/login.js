import { useState, useEffect } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { FaEye, FaEyeSlash, FaTimes, FaFacebookF, FaGithub } from 'react-icons/fa';
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from 'react-icons/fc';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useRouter } from 'next/router';
import API_URL from "../utils/api";

export default function Login() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState('');
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [showForgotBox, setShowForgotBox] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [showResetSection, setShowResetSection] = useState(false);
  const [registerOtpTimer, setRegisterOtpTimer] = useState(0);
  const [forgotOtpTimer, setForgotOtpTimer] = useState(0);

  const openDialog = (msg, type = 'info', action = '') => {
    setMessage(msg);
    setMessageType(type);
    setDialogAction(action);
    setShowDialog(true);
  };

const handleGoogleLogin = useGoogleLogin({

  onSuccess: async (tokenResponse) => {

    try {

      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization:
              `Bearer ${tokenResponse.access_token}`
          }
        }
      );

      const user = userInfo.data;

      const userLoginResponse = await axios.post(
        `${API_URL}/google-login`,
        {
          name: user.name,
          email: user.email,
          google_id: user.sub
        }
      );

      localStorage.setItem(
        "userEmail",
        user.email
      );

      localStorage.setItem(
        "userName",
        user.name
      );

      localStorage.setItem(
  "isLoggedIn",
  "true"
);

// const profileSaved =
//   localStorage.getItem(
//     `profileSaved_${user.email}`
//   );

// if (!profileSaved) {

//   // setShowProfilePrompt(true);
//   if (!userLoginResponse.data.profile_completed) {
//   setShowProfilePrompt(true);
// }
// else {
//   router.push("/");
// }

// } else {

//   router.push('/');

// }
if (userLoginResponse.data.profile_completed) {

    router.push("/");

} else {

    setShowProfilePrompt(true);

}

    } catch (err) {

  console.error("GOOGLE LOGIN ERROR:", err);

  console.log("Response:", err.response?.data);

  openDialog(
    err.response?.data?.message ||
    err.message ||
    "Google login failed",
    "error"
  );

}

  },

  onError: () => {

    openDialog(
      "Google login failed",
      "error"
    );

  }

});

  // REGISTER OTP TIMER

useEffect(() => {

  let interval;

  if (registerOtpTimer > 0) {

    interval = setInterval(() => {

      setRegisterOtpTimer(prev => prev - 1);

    }, 1000);

  }

  return () => clearInterval(interval);

}, [registerOtpTimer]);


// FORGOT PASSWORD OTP TIMER

useEffect(() => {

  let interval;

  if (forgotOtpTimer > 0) {

    interval = setInterval(() => {

      setForgotOtpTimer(prev => prev - 1);

    }, 1000);

  }

  return () => clearInterval(interval);

}, [forgotOtpTimer]);

  const closeDialog = () => { setShowDialog(false);

    if (dialogAction === 'switchToRegister') {
      setIsRegister(true);
    }

    if (dialogAction === 'switchToLogin') {
      setIsRegister(false);
    }

    if (dialogAction === 'goHome') {
      router.push('/');
    }

    setDialogAction('');
  };

  const switchToLogin = () => {
    setIsRegister(false);
    setShowDialog(false);
    setDialogAction('');
  };

  const switchToRegister = () => {
    setIsRegister(true);
    setShowDialog(false);
    setDialogAction('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
  openDialog(
    'Please verify CAPTCHA first.',
    'error'
  );
  return;
}
    if (isSubmitting) return;

    setIsSubmitting(true);
    setShowDialog(false);
    setDialogAction('');

    try {
      const res = await axios.post(
        `${API_URL}/login`,
        {
          email: loginEmail,
          password: loginPassword,
          captcha: captchaToken
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log("LOGIN RESPONSE:", res.data);
      localStorage.setItem('userEmail', res.data.email || loginEmail);
      localStorage.setItem('userName', res.data.name || 'User');
//       localStorage.setItem(
//   `profileData_${res.data.email}`,
//   JSON.stringify({
//     name: res.data.name,
//     email: res.data.email,
//     username: res.data.name,
//     phone: "",
//     gender: "",
//     dob: "",
//     occupation: "",
//     country: "",
//     bio: ""
//   })
// );
      localStorage.setItem('isLoggedIn', 'true');

// const profileSaved =
//   localStorage.getItem(
//     `profileSaved_${res.data.email}`
//   );

// if (!profileSaved) {

//   // setShowProfilePrompt(true);
//   if (!res.data.profile_completed) {
//   setShowProfilePrompt(true);
// }
// else {
//   router.push("/");
// }

// } else {

//   router.push('/');

// }
if (res.data.profile_completed) {

    router.push("/");

} else {

    setShowProfilePrompt(true);

}
    } catch (err) {
  const backendMessage =
    err.response?.data?.message ||
    'Something went wrong';

  if (
    backendMessage.toLowerCase().includes(
      'register first'
    )
  ) {

    openDialog(
      'You do not have an account yet. Please register first.',
      'warning',
      'switchToRegister'
    );

  } else if (
    backendMessage.toLowerCase().includes(
      'incorrect password'
    )
  ) {

    openDialog(
      backendMessage,
      'error'
    );

  } else {

    openDialog(
      backendMessage,
      'error'
    );

  }
} finally {
      setIsSubmitting(false);
    }
  };

  const validatePassword = (password) => {

  // Minimum 10 chars
  // At least 2 uppercase
  // At least 2 lowercase
  // At least 2 digits
  // At least 1 special character

  const regex =
    /^(?=(?:.*[A-Z]){2,})(?=(?:.*[a-z]){2,})(?=(?:.*\d){2,})(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{10,}$/;

  return regex.test(password);
};
  
const checkPasswordStrength = (password) => {

  let strength = 0;

  if (password.length >= 10) strength++;

  if ((password.match(/[A-Z]/g) || []).length >= 2)
    strength++;

  if ((password.match(/[a-z]/g) || []).length >= 2)
    strength++;

  if ((password.match(/[0-9]/g) || []).length >= 2)
    strength++;

  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password))
    strength++;

  if (strength <= 2) {
    setPasswordStrength('Weak');
  }
  else if (strength <= 4) {
    setPasswordStrength('Medium');
  }
  else {
    setPasswordStrength('Strong');
  }
};

const sendRegisterOtp = async () => {

  try {

    await axios.post(
      `${API_URL}/send-otp`,
      {
        email: registerEmail,
        purpose: "registration"
      }
    );

    setRegisterOtpTimer(60);

    setShowOtpBox(true);

    openDialog(
      'OTP has been sent to your email.',
      'success'
    );

  } catch (err) {

    openDialog(
      err.response?.data?.message ||
      'Failed to send OTP',
      'error'
    );

  }

};

const sendForgotOtp = async () => {

  try {

    await axios.post(
      `${API_URL}/send-reset-otp`,
      {
        email: forgotEmail
      }
    );

    setForgotOtpTimer(60);

    setMessage(
      'OTP sent to your email'
    );

    setMessageType(
      'success'
    );

    setShowResetSection(true);

  } catch (err) {

    openDialog(
      err.response?.data?.message ||
      'Failed to send OTP',
      'error'
    );

  }

};

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
  openDialog(
    'Please verify CAPTCHA first.',
    'error'
  );
  return;
}
    if (isSubmitting) return;

    setIsSubmitting(true);
    setShowDialog(false);
    setDialogAction('');

    if (registerPassword !== confirmPassword) {
  openDialog(
    'Password and Confirm Password do not match.',
    'error'
  );
  setIsSubmitting(false);
  return;
}

if (!validatePassword(registerPassword)) {
  openDialog(
    'Password must contain minimum 10 characters, 2 uppercase letters, 2 lowercase letters, 2 numbers and 1 special character.',
    'error'
  );
  setIsSubmitting(false);
  return;
}

if (!showOtpBox) {

  await sendRegisterOtp();

  setIsSubmitting(false);

  return;
}
if (!otpVerified) {

  openDialog(
    'Please verify OTP first.',
    'error'
  );

  setIsSubmitting(false);

  return;
}

    try {
      const res = await axios.post(
        `${API_URL}/register`,
        {
          name,
          email: registerEmail,
          password: registerPassword,
          captcha: captchaToken
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      openDialog(
        res.data.message || 'Registration successful! Please login again.',
        'success',
        'switchToLogin'
      );

      setName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setConfirmPassword('');
      setOtp('');
      setShowOtpBox(false);
      setOtpVerified(false);
    } catch (err) {
      const backendMessage = err.response?.data?.message || 'Something went wrong';

      if (backendMessage.toLowerCase().includes('already exists')) {
        openDialog('This account already exists. Please login instead.', 'warning');
      } else {
        openDialog(backendMessage, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

const handleVerifyOtp = async () => {

  if (!captchaToken) {
    openDialog(
      'Please verify CAPTCHA first.',
      'error'
    );
    return;
  }

  try {

    const otpRes = await axios.post(
      `${API_URL}/verify-otp`,
      {
        email: registerEmail,
        otp: otp,
        captcha: captchaToken
      }
    );

    if (
      otpRes.data.message ===
      'OTP verified successfully'
    ) {

      setOtpVerified(true);

      openDialog(
        'OTP verified successfully. Now click Register.',
        'success'
      );

    }

  } catch (err) {

    openDialog(
      err.response?.data?.message ||
      'OTP verification failed',
      'error'
    );

  }

};

  return (
    <>
      <Navbar />

      <div className="auth-container">
        <div className="auth-box">
          <div className={`auth-panel ${!isRegister ? 'active' : ''}`}
          onClick={() => {
            if (isRegister) switchToLogin();
          }}>
            <button
              type="button"
              className="auth-tab-btn"
              onClick={switchToLogin}
            >
              <h2>Login</h2>
              <p>Welcome back!</p>
            </button>

            {!isRegister && (
              <form className="auth-form" onSubmit={handleLoginSubmit} onClick={(e) => e.stopPropagation()}>
                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />

                <div className="password-wrapper">

  <input
    type={showLoginPassword ? 'text' : 'password'}
    placeholder="Password"
    value={loginPassword}
    onChange={(e) => setLoginPassword(e.target.value)}
    required
  />

  <span
    className="eye-icon"
    onClick={() =>
      setShowLoginPassword(!showLoginPassword)
    }
  >
    {
      showLoginPassword
        ? <FaEyeSlash />
        : <FaEye />
    }
  </span>

</div>
<p
  className="forgot-password"
  onClick={() => setShowForgotBox(true)}
>
  Forgot Password?
</p>

        
                <div className="recaptcha-box">
  <ReCAPTCHA
    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
    onChange={(token) => setCaptchaToken(token)}
  />
</div>

<button type="submit" disabled={isSubmitting}>
  {isSubmitting ? 'Please wait...' : 'Login'}
</button>

<div className="social-login-section">

  <p className="social-title">
    Or sign-in with:
  </p>

  <div className="social-icons">

<button
  type="button"
  className="social-icon google"
  onClick={() => handleGoogleLogin()}
>
  <FcGoogle />
</button>

    <button
      type="button"
      className="social-icon facebook"
      onClick={() =>
        openDialog(
          "Facebook login coming soon...",
          "info"
        )
      }
    >
      <FaFacebookF />
    </button>

    <button
      type="button"
      className="social-icon github"
      onClick={() =>
        openDialog(
          "GitHub login coming soon...",
          "info"
        )
      }
    >
      <FaGithub />
    </button>

  </div>

</div>

              </form>
            )}
          </div>

          <div
  className={`auth-panel ${isRegister ? 'active' : ''}`}
  onClick={() => {
    if (!isRegister) switchToRegister();
  }}
>
            <button
              type="button"
              className="auth-tab-btn"
              onClick={switchToRegister}
            >
              <h2>Register</h2>
              <p>Create your account</p>
            </button>

            {isRegister && (
              <form className="auth-form" onSubmit={handleRegisterSubmit} onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />

                <div className="password-wrapper">

  <input
    type={showPassword ? 'text' : 'password'}
    placeholder="Password"
    value={registerPassword}
    onChange={(e) => {
      setRegisterPassword(e.target.value);
      checkPasswordStrength(e.target.value);
    }}
    required
  />

  <span
    className="eye-icon"
    onClick={() =>
      setShowPassword(!showPassword)
    }
  >
    {
      showPassword
        ? <FaEyeSlash />
        : <FaEye />
    }
  </span>

</div>
<p className={`strength-text ${passwordStrength.toLowerCase()}`}>
  Password Strength: {passwordStrength}
</p>

                <div className="password-wrapper">

  <input
    type={
      showConfirmPassword
        ? 'text'
        : 'password'
    }
    placeholder="Confirm Password"
    value={confirmPassword}
    onChange={(e) =>
      setConfirmPassword(e.target.value)
    }
    required
  />

  <span
    className="eye-icon"
    onClick={() =>
      setShowConfirmPassword(
        !showConfirmPassword
      )
    }
  >
    {
      showConfirmPassword
        ? <FaEyeSlash />
        : <FaEye />
    }
  </span>

</div>
{
  showOtpBox && (
    <>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />

      <button
        type="button"
        onClick={handleVerifyOtp}
      >
        Verify OTP
      </button>
      {
  registerOtpTimer > 0 ? (
    <p className="timer-text">
      Resend OTP in {registerOtpTimer}s
    </p>
  ) : (
    <span
      className="resend-link"
      onClick={sendRegisterOtp}
    >
      Resend OTP
    </span>
  )
}
    </>
  )
}
                <div className="recaptcha-box">
                <ReCAPTCHA
  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
  onChange={(token) => setCaptchaToken(token)}
/>
</div>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Please wait...' : 'Register'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

     {showForgotBox && (
  <div
    className="dialog-overlay"
    onClick={() => {

  setShowForgotBox(false);

  setShowResetSection(false);

  setForgotEmail('');

  setForgotOtp('');

  setNewPassword('');

  setConfirmNewPassword('');

}}
  >
    <div
      className="dialog-box info forgot-dialog"
      onClick={(e) => e.stopPropagation()}
    >
      <button
  className="close-dialog-btn"
  onClick={() => {

    setShowForgotBox(false);

    setShowResetSection(false);

    setForgotEmail('');

    setForgotOtp('');

    setNewPassword('');

    setConfirmNewPassword('');

  }}
>
  <FaTimes />
</button>
      <h3 className="forgot-title">Reset Password</h3>
      {
  message && (
    <p
      style={{
        marginBottom: '15px',
        color:
          messageType === 'success'
            ? '#22c55e'
            : '#ef4444'
      }}
    >
      {message}
    </p>
  )
}

      {!showResetSection ? (
        <>
          <input
            type="email"
            placeholder="Enter registered email"
            value={forgotEmail}
            onChange={(e) =>
              setForgotEmail(e.target.value)
            }
            className="forgot-input"
          />

          <button
            className="dialog-btn"
            // onClick={async () => {

            //   try {

            //     await axios.post(
            //       `${API_URL}/send-reset-otp`,
            //       { email: forgotEmail }
            //     );

            //     setMessage('OTP sent to your email');
            //     setMessageType('success');

            //     setShowResetSection(true);

            //   } catch (err) {

            //     openDialog(
            //       err.response?.data?.message ||
            //       'Failed to send OTP',
            //       'error'
            //     );

            //   }

            // }}
            onClick={sendForgotOtp}
          >
            Send OTP
          </button>
        </>
      ) : (
        <>
  <input
    type="text"
    placeholder="Enter OTP"
    value={forgotOtp}
    onChange={(e) =>
      setForgotOtp(e.target.value)
    }
    className="forgot-input"
  />
  {
  forgotOtpTimer > 0 ? (
    <p className="timer-text">
      Resend OTP in {forgotOtpTimer}s
    </p>
  ) : (
    <button
      type="button"
      className="resend-otp-btn"
      onClick={sendForgotOtp}
    >
      Resend OTP
    </button>
  )
}

  <div className="password-wrapper">

    <input
      type={
        showNewPassword
          ? 'text'
          : 'password'
      }
      placeholder="Enter New Password"
      value={newPassword}
      onChange={(e) =>
        setNewPassword(e.target.value)
      }
      className="forgot-input"
    />

    <span
      className="eye-icon"
      onClick={() =>
        setShowNewPassword(
          !showNewPassword
        )
      }
    >
      {
        showNewPassword
          ? <FaEyeSlash />
          : <FaEye />
      }
    </span>

  </div>

  <div className="password-wrapper">

    <input
      type={
        showConfirmNewPassword
          ? 'text'
          : 'password'
      }
      placeholder="Confirm New Password"
      value={confirmNewPassword}
      onChange={(e) =>
        setConfirmNewPassword(
          e.target.value
        )
      }
      className="forgot-input"
    />

    <span
      className="eye-icon"
      onClick={() =>
        setShowConfirmNewPassword(
          !showConfirmNewPassword
        )
      }
    >
      {
        showConfirmNewPassword
          ? <FaEyeSlash />
          : <FaEye />
      }
    </span>

  </div>

  <button
    className="dialog-btn"
    onClick={async () => {

      if (
        newPassword !==
        confirmNewPassword
      ) {

        openDialog(
          'New Password and Confirm Password do not match.',
          'error'
        );



        return;
      }

      try {

        const res = await axios.post(
          `${API_URL}/reset-password`,
          {
            email: forgotEmail,
            otp: forgotOtp,
            newPassword
          }
        );

        openDialog(
          res.data.message,
          'success'
        );

        setShowForgotBox(false);

        setShowResetSection(false);

        setForgotEmail('');
        setForgotOtp('');
        setNewPassword('');
        setConfirmNewPassword('');

      } catch (err) {

        openDialog(
          err.response?.data?.message ||
          'Password reset failed',
          'error'
        );

      }

    }}
  >
    Reset Password
  </button>
</>
      )}
    </div>
  </div>
)}

      {showProfilePrompt && (
  <div
    className="dialog-overlay"
    onClick={() => setShowProfilePrompt(false)}
  >
    <div
      className="login-success-dialog"
      onClick={(e) => e.stopPropagation()}
    >
      <h3>Success</h3>

      <p>
        Login successful.
        <br />
        Please complete and save your profile.
      </p>

      <div className="login-success-actions">
        <button
          className="profile-action-btn"
          onClick={() => {
            setShowProfilePrompt(false);
            router.push('/profile');
          }}
        >
          Go to My Profile
        </button>

        <button
          className="home-action-btn"
          onClick={() => {
            setShowProfilePrompt(false);
            router.push('/');
          }}
        >
          Stay at Home Page
        </button>
      </div>
    </div>
  </div>
)}
      
      {showDialog && (
        <div className="dialog-overlay" onClick={closeDialog}>
          <div
            className={`dialog-box ${messageType}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>
              {messageType === 'success' && 'Success'}
              {messageType === 'warning' && 'Notice'}
              {messageType === 'error' && 'Error'}
              {messageType === 'info' && 'Message'}
            </h3>

            <p>{message}</p>

            <button className="dialog-btn" onClick={closeDialog}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}