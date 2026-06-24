import { useEffect, useRef, useState } from "react";
import { FaCamera, FaLock, FaCalendarAlt, FaEdit, FaHome, FaTimes, FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";
import { useRouter } from "next/router";
import axios from "axios";
import API_URL from "../utils/api";

export default function Profile() {

  const router = useRouter();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    username: "",
    gender: "",
    dob: "",
    occupation: "",
    country: "",
    bio: ""
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // EMAIL DIALOG

const [emailDialogOpen, setEmailDialogOpen] = useState(false);
const [newEmail, setNewEmail] = useState("");
const [confirmEmail, setConfirmEmail] = useState("");
const [emailError, setEmailError] = useState("");
const [emailOtp, setEmailOtp] = useState("");
const [emailTimer, setEmailTimer] =useState(0);
const [showOldPassword, setShowOldPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [deleteImageDialog, setDeleteImageDialog] = useState(false);

const [dialog, setDialog] = useState({
  open: false,
  title: "",
  message: ""
});

const [profileImage, setProfileImage] = useState(
  "/default-avatar.jpg"
);
const [profilePicture, setProfilePicture] = useState(null);

const fileInputRef = useRef(null);

// useEffect(() => {

// const storedName = localStorage.getItem("userName");
// const storedEmail = localStorage.getItem("userEmail");
// const savedProfile = JSON.parse(localStorage.getItem(`profileData_${storedEmail}`));
// const savedImage = localStorage.getItem(`profileImage_${storedEmail}`);

//   if (savedProfile) {
//     setProfile(savedProfile);

//   } else {
//     setProfile({
//       name: storedName || "",
//       email: storedEmail || "",
//       username: storedName || "",
//       gender: "",
//       dob: "",
//       occupation: "",
//       country: "",
//       bio: ""
//     });

//   }

//   if (savedImage) {
//     setProfileImage(savedImage);

//   }

// }, []);

useEffect(() => {

  const loadProfile = async () => {

    const storedEmail =
      localStorage.getItem("userEmail");

    const storedName =
      localStorage.getItem("userName");

    try {

      const response = await axios.get(
        `${API_URL}/get-profile/${storedEmail}`
      );

      const data = response.data.profile;
      console.log("PROFILE DATA:", data);
      if (data) {
      setProfile({
        name: data.full_name || storedName || "",
        email: data.email || storedEmail || "",
        username: data.username || storedName || "",
        gender: data.gender || "",
        dob: data.dob || "",
        occupation: data.occupation || "",
        country: data.country || "",
        bio: data.bio || ""
      });

      if (data.profile_picture) {

        setProfileImage(data.profile_picture);
      }
      }

    } catch (error) {

      console.error(
        "Failed to load profile:",
        error
      );

      setProfile({
        name: storedName || "",
        email: storedEmail || "",
        username: storedName || "",
        gender: "",
        dob: "",
        occupation: "",
        country: "",
        bio: ""
      });

    }

  };

  loadProfile();

}, []);

// EMAIL TIMER

useEffect(() => {

  let interval;

  if (emailTimer > 0) {

    interval = setInterval(() => {

      setEmailTimer((prev) => prev - 1);

    }, 1000);

  }

  return () => clearInterval(interval);

}, [emailTimer]);


  // PROFILE COMPLETION %

  const fields = Object.values(profile);

  const filledFields = fields.filter(
    (field) => field && field.trim() !== ""
  ).length;

  const completion = Math.round(
    (filledFields / fields.length) * 100
  );

  // INPUT CHANGE

  const handleChange = (e) => {

    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });

  };

  // PASSWORD CHANGE

  const handlePasswordChange = (e) => {

    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });

  };

  // SEND OTP

const sendOtp = async () => {

  if (emailTimer > 0) {
  return;
}

  if (!newEmail || !confirmEmail) {

    setEmailError(
      "Please fill both email fields."
    );

    return;
  }

  if (newEmail !== confirmEmail) {

    setEmailError(
      "Email addresses do not match."
    );

    return;
  }

  setEmailError("");

  try {

    await axios.post(
      `${API_URL}/send-otp`,
      {
        email: newEmail,
        purpose: "email_update"
      }
    );

    setEmailTimer(60);

    setDialog({
      open: true,
      title: "OTP Sent",
      message:
        `OTP sent successfully to ${newEmail}`
    });

  } catch (err) {

    setDialog({
      open: true,
      title: "Error",
      message:
        err.response?.data?.message ||
        "Failed to send OTP"
    });

  }

};


// VERIFY OTP

const verifyOtp = async () => {

  try {

    const res = await axios.post(
      `${API_URL}/verify-otp`,
      {
        email: newEmail,
        otp: emailOtp
      }
    );

    if (
  res.data.message ===
  "OTP verified successfully"
) {

  const oldEmail = profile.email;

  await axios.post(
    `${API_URL}/update-email`,
    {
      old_email: oldEmail,
      new_email: newEmail
    }
  );

  // Move profile data to new key
  const oldProfileData =
    localStorage.getItem(
      `profileData_${oldEmail}`
    );

  if (oldProfileData) {

    localStorage.setItem(
      `profileData_${newEmail}`,
      oldProfileData
    );

    localStorage.removeItem(
      `profileData_${oldEmail}`
    );

  }

  // Move profile image to new key
  const oldProfileImage =
    localStorage.getItem(
      `profileImage_${oldEmail}`
    );

  if (oldProfileImage) {

    localStorage.setItem(
      `profileImage_${newEmail}`,
      oldProfileImage
    );

    localStorage.removeItem(
      `profileImage_${oldEmail}`
    );

  }

  setProfile(prev => ({
    ...prev,
    email: newEmail
  }));

  localStorage.setItem(
    "userEmail",
    newEmail
  );

      setEmailDialogOpen(false);

      setNewEmail("");
      setConfirmEmail("");
      setEmailOtp("");

      setDialog({
        open: true,
        title: "Success",
        message:
          "Email updated successfully."
      });

    }

  } catch (err) {

    setDialog({
      open: true,
      title: "Invalid OTP",
      message:
        err.response?.data?.message ||
        "Incorrect OTP entered."
    });

  }

};

// IMAGE UPLOAD

const handleImageUpload = (e) => {

  const file = e.target.files[0];

  if (!file) return;

  // STORE REAL FILE
  setProfilePicture(file);

  const reader = new FileReader();

  reader.onloadend = () => {

    const base64String = reader.result;

    setProfileImage(base64String);

    const userEmail = localStorage.getItem("userEmail");

    localStorage.setItem(
      `profileImage_${userEmail}`,
      base64String
    );

    setDialog({
      open: true,
      title: "Image Uploaded",
      message:
        "Profile picture updated successfully."
    });

  };

  reader.readAsDataURL(file);

};

const handleDeleteProfilePicture = async () => {

  try {

    const userEmail =
      localStorage.getItem("userEmail");

    console.log("Deleting image for:", profile.email);

  const response = await axios.post(
    `${API_URL}/delete-profile-picture`,
  {
    email: profile.email
  }
);
console.log(response.data);

    setProfileImage("/default-avatar.jpg");

    setProfilePicture(null);
    if (fileInputRef.current) {
  fileInputRef.current.value = "";
}

    localStorage.removeItem(
      `profileImage_${userEmail}`
    );

    setDeleteImageDialog(false);

    setDialog({
      open: true,
      title: "Success",
      message:
        "Profile picture deleted successfully."
    });

  } catch (error) {

    console.error(
  "DELETE ERROR:",
  error.response?.data || error
);

    setDeleteImageDialog(false);

    setDialog({
      open: true,
      title: "Error",
      message:
        "Unable to delete profile picture."
    });

  }

};
  
  // SAVE PROFILE

  const saveProfile = async () => {

  try {

    const formData = new FormData();

    formData.append("email", profile.email);
    formData.append("username", profile.username);
    formData.append("full_name", profile.name);
    formData.append("gender", profile.gender);
    formData.append("dob", profile.dob);
    formData.append("country", profile.country);
    formData.append("occupation", profile.occupation);
    formData.append("bio", profile.bio);

    // IMAGE FILE
    if (profilePicture) {

      formData.append(
        "profile_picture",
        profilePicture
      );

    }

    const response = await axios.post(
      `${API_URL}/save-profile`,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data"
        }
      }
    );

    localStorage.setItem(
  `profileData_${profile.email}`,
  JSON.stringify(profile)
);

localStorage.setItem(
  `profileImage_${profile.email}`,
  profileImage
);

window.dispatchEvent(
  new Event("storage")
);

localStorage.setItem(
  "userName",
  profile.name
);

localStorage.setItem(
  "userEmail",
  profile.email
);

// Profile completed flag
localStorage.setItem(
  `profileSaved_${profile.email}`,
  "true"
);

    setDialog({
      open: true,
      title: "Success",
      message:
        response.data.message ||
        "Profile saved successfully."
    });

  } catch (error) {

    setDialog({
      open: true,
      title: "Error",
      message:
        error.response?.data?.message ||
        "Failed to save profile."
    });

  }

};

  // CHANGE PASSWORD

  const changePassword = async () => {

  if (
    !passwords.oldPassword ||
    !passwords.newPassword ||
    !passwords.confirmPassword
  ) {
    setDialog({
      open: true,
      title: "Missing Fields",
      message: "Please fill all password fields."
    });
    return;
  }

  if (
    passwords.newPassword !==
    passwords.confirmPassword
  ) {
    setDialog({
      open: true,
      title: "Password Error",
      message: "Passwords do not match."
    });
    return;
  }

  try {

    const response = await axios.post(
      `${API_URL}/change-password`,
      {
        email: profile.email,
        old_password: passwords.oldPassword,
        new_password: passwords.newPassword
      }
    );

    setPasswords({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });

    setDialog({
      open: true,
      title: "Success",
      message: response.data.message
    });

  } catch (error) {

    setDialog({
      open: true,
      title: "Error",
      message:
        error.response?.data?.message ||
        "Password update failed"
    });

  }

};

  return (

    <div className="profile-page">

      <div className="profile-container">

        {/* TITLE */}

        <h1 className="profile-title">
          My Profile
        </h1>

        {/* TOP CARD */}

        <div className="profile-top-card">

          {/* PROFILE IMAGE */}

          <div className="profile-left">

            <div
              className="progress-ring"
              style={{
                background: `conic-gradient(
                  #3b82f6 ${completion * 3.6}deg,
                  #1e293b 0deg
                )`
              }}
            >

              <div className="progress-inner profile-image-wrapper">

  <img
    src={profileImage}
    alt="Profile"
    className="profile-image"
  />

</div>

{
  profileImage !== "/default-avatar.jpg" && (
    <button
      className="delete-profile-pic-btn"
      onClick={() => setDeleteImageDialog(true)}
    >
      <FaTrash />
    </button>
  )
}

            </div>

            <button
  className="upload-btn"
  onClick={() =>
    fileInputRef.current.click()
  }
>
              <FaCamera />
              Upload Picture
            </button>

            <input
  type="file"
  accept="image/*"
  ref={fileInputRef}
  style={{ display: "none" }}
  onChange={handleImageUpload}
/>

            <div className="completion-text">
              Profile Completion: {completion}%
            </div>

          </div>

          {/* PROFILE FORM */}

          <div className="profile-right">

            <div className="profile-grid">

              {/* FULL NAME */}

              <div className="profile-field">
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled
                />
              </div>

              {/* USERNAME */}

              <div className="profile-field">
                <label>Username</label>

                <input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  disabled
                />
              </div>

              {/* ORIGINAL EMAIL */}

<div className="profile-field">

  <label>Current Email</label>

  <div className="edit-field">

    <input
      type="email"
      value={profile.email}
      disabled
    />

    <button
  className="edit-btn"
  onClick={() =>
    setEmailDialogOpen(true)
  }
>
  <FaEdit />
</button>

  </div>

</div>


{/* DATE OF BIRTH */}

<div className="profile-field">

  <label>
    <FaCalendarAlt
      style={{
        marginRight: "8px"
      }}
    />
    Date of Birth
  </label>

  <input
    type="date"
    name="dob"
    value={profile.dob}
    onChange={handleChange}
  />

</div>

              {/* GENDER */}

              <div className="profile-field">
                <label>Gender</label>

                <div className="gender-options">

                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={
                        profile.gender === "Male"
                      }
                      onChange={handleChange}
                    />
                    Male
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={
                        profile.gender === "Female"
                      }
                      onChange={handleChange}
                    />
                    Female
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Other"
                      checked={
                        profile.gender === "Other"
                      }
                      onChange={handleChange}
                    />
                    Other
                  </label>

                </div>

              </div>

              {/* OCCUPATION */}

              <div className="profile-field">
                <label>Occupation</label>

                <input
                  type="text"
                  name="occupation"
                  value={profile.occupation}
                  onChange={handleChange}
                />
              </div>

              {/* COUNTRY */}

              <div className="profile-field">
                <label>Country</label>

                <select
                  name="country"
                  value={profile.country}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Country
                  </option>

                  <option value="India">
                    India
                  </option>

                  <option value="USA">
                    USA
                  </option>

                  <option value="UK">
                    UK
                  </option>

                  <option value="Afghanistan">
                    Afghanistan
                  </option>

                  <option value="Argentina">
                    Argentina
                  </option>

                  <option value="Brazil">
                    Brazil
                  </option>

                  <option value="China">
                    China
                  </option>

                </select>

              </div>

            </div>

            {/* BIO */}

            <div className="profile-field full-width">

              <label>Bio</label>

              <textarea
                name="bio"
                rows="5"
                value={profile.bio}
                onChange={handleChange}
              />

            </div>

            {/* SAVE BUTTON */}

            <div className="profile-btn-group">

  <button
    className="save-profile-btn"
    onClick={saveProfile}
  >
    Save Profile
  </button>

  <button
    className="home-btn"
    onClick={() => router.push("/")}
  >
    <FaHome />
    Back to Home
  </button>

</div>

          </div>

        </div>

        {/* PASSWORD SECTION */}

        <div className="password-card">

          <h2>
            <FaLock />
            Change Password
          </h2>

          <div className="password-grid">

            <div className="password-input-wrapper">

  <input
    type={
      showOldPassword
        ? "text"
        : "password"
    }
    placeholder="Old Password"
    name="oldPassword"
    value={passwords.oldPassword}
    onChange={handlePasswordChange}
  />

  <span
    className="password-eye"
    onClick={() =>
      setShowOldPassword(
        !showOldPassword
      )
    }
  >
    {
      showOldPassword
        ? <FaEyeSlash />
        : <FaEye />
    }
  </span>

</div>

            <div className="password-input-wrapper">

  <input
    type={
      showNewPassword
        ? "text"
        : "password"
    }
    placeholder="New Password"
    name="newPassword"
    value={passwords.newPassword}
    onChange={handlePasswordChange}
  />

  <span
    className="password-eye"
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

            <div className="password-input-wrapper">

  <input
    type={
      showConfirmPassword
        ? "text"
        : "password"
    }
    placeholder="Confirm New Password"
    name="confirmPassword"
    value={passwords.confirmPassword}
    onChange={handlePasswordChange}
  />

  <span
    className="password-eye"
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

          </div>

          <button
            className="change-password-btn"
            onClick={changePassword}
          >
            Update Password
          </button>

        </div>

      </div>

      {/* EMAIL DIALOG */}

{
  emailDialogOpen && (

    <div className="dialog-overlay">

      <div className="dialog-box modern-dialog">

  <button
    className="close-dialog-btn"
    onClick={() => setEmailDialogOpen(false)}
  >
    <FaTimes />
  </button>

  <h3>Update Email</h3>

        <div className="dialog-input-group">

  <input
    type="email"
    placeholder="Enter new email"
    value={newEmail}
    onChange={(e) =>
      setNewEmail(e.target.value)
    }
  />

  <input
    type="email"
    placeholder="Retype new email"
    value={confirmEmail}
    onChange={(e) =>
      setConfirmEmail(e.target.value)
    }
  />

</div>

{
  emailError && (
    <p className="error-text">
      {emailError}
    </p>
  )
}

<div className="dialog-btn-row">

  <button
    className="verify-btn"
    onClick={sendOtp}
    disabled={emailTimer > 0}
    style={{
      opacity: emailTimer > 0 ? 0.5 : 1,
      cursor: emailTimer > 0 ? "not-allowed" : "pointer"
    }}
  >
    {emailTimer > 0
      ? `Wait ${emailTimer}s`
      : "Send OTP"}
  </button>

</div>

<input
  type="text"
  className="otp-input"
  placeholder="Enter OTP"
  value={emailOtp}
  onChange={(e) =>
    setEmailOtp(e.target.value)
  }
/>

<div className="dialog-btn-row">

  <button
    className="verify-btn"
    onClick={verifyOtp}
  >
    Verify OTP
  </button>

</div>

{
  emailTimer > 0 ? (
    <p className="timer-text">
      Resend OTP in {emailTimer}s
    </p>
  ) : (
    <button
      className="resend-btn"
      onClick={sendOtp}
    >
      Resend OTP
    </button>
  )
}

      </div>

    </div>

  )
}

{
  deleteImageDialog && (

    <div className="dialog-overlay">

      <div className="dialog-box delete-dialog">

        <h3>Delete Profile Picture</h3>

        <p>
          Do you want to delete your profile picture?
        </p>

        <div className="delete-dialog-buttons">

  <button
    className="delete-confirm-btn"
    onClick={handleDeleteProfilePicture}
  >
    Yes
  </button>

  <button
    className="delete-cancel-btn"
    onClick={() =>
      setDeleteImageDialog(false)
    }
  >
    No
  </button>

</div>

      </div>

    </div>

  )
}

    {/* DIALOG */}

{
  dialog.open && (

    <div className="dialog-overlay">

      <div className="dialog-box success">

        <h3>{dialog.title}</h3>

        <p>{dialog.message}</p>

        <button
          className="dialog-btn"
          onClick={() =>
            setDialog({
              ...dialog,
              open: false
            })
          }
        >
          OK
        </button>

      </div>

    </div>

  )
}

    </div>

  );
}