import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import NotificationBell from './NotificationBell';
import { FiUser } from 'react-icons/fi';

export default function Navbar() {

  const router = useRouter();
  const dropdownRef = useRef(null);

  const [userName, setUserName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showLegalDropdown, setShowLegalDropdown] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {

    const syncUser = () => {

      if (typeof window === 'undefined') return;

      const storedName = localStorage.getItem('userName');
      const storedEmail = localStorage.getItem("userEmail");
      const savedImage = localStorage.getItem(`profileImage_${storedEmail}`);
      setUserName(
        storedName && storedName.trim()
          ? storedName
          : ''
      );
      setProfileImage(savedImage || "");
    };
    syncUser();


    const handleStorageChange = () => {
      syncUser();
    };


    const handleClickOutside = (event) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {
        setShowDropdown(false);
      }
    };


    window.addEventListener(
      'storage',
      handleStorageChange
    );


    document.addEventListener(
      'mousedown',
      handleClickOutside
    );


    return () => {

      window.removeEventListener(
        'storage',
        handleStorageChange
      );


      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };

  }, []);



  useEffect(() => {

    if (typeof window === 'undefined')
      return;

    const storedName = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem("userEmail");
    const savedImage = localStorage.getItem(`profileImage_${storedEmail}`);

    setUserName(
      storedName && storedName.trim()
        ? storedName
        : ''
    );
    setProfileImage(savedImage || "");

  }, [router.pathname]);



  const handleLogout = () => {

    setShowLogoutDialog(false);
    setShowDropdown(false);

    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('profileData');

    setUserName('');
    setProfileImage("");

    router.push('/');
};


  return (
    <>

      <div className="nav">

        <div
          className="logo"
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer' }}
        >
          VeriLex AI
        </div>


        <div className="nav-links">

          <a
            onClick={() => router.push('/')}
          >
            Home
          </a>


          {userName && (
            <a
              onClick={() =>
                router.push('/dashboard')
              }
            >
              Dashboard
            </a>
          )}


          <a
            onClick={() =>
              router.push('/fact-check')
            }
          >
            Fact-Check
          </a>


          <div
  className="legal-dropdown-wrapper"
  onMouseEnter={() => setShowLegalDropdown(true)}
  onMouseLeave={() => setShowLegalDropdown(false)}
>

  <a>
    Legal-Assistant ▾
  </a>

  {showLegalDropdown && (

    <div className="legal-dropdown-menu">

      <div
        className="legal-dropdown-item"
        onClick={() => router.push('/legal')}
      >
        Bail Prediction
      </div>

      <div
        className="legal-dropdown-item"
        onClick={() =>
          router.push('/constitutional-qa')
        }
      >
        Constitutional Q&A Assistant
      </div>

    </div>

  )}

</div>


          <a
            onClick={() =>
              router.push('/about')
            }
          >
            About-Us
          </a>


          <a
            onClick={() =>
              router.push('/contact')
            }
          >
            Contact
          </a>

           <a
            onClick={() =>
              router.push('/faq')
            }
          >
            FAQ's
          </a>

          <div className="nav-divider"></div>

<NotificationBell />

<div className="nav-divider"></div>


{!userName && (

  <a
    className="login-with-icon"

    onClick={() =>
      router.push('/login')
    }

  >

    <FiUser />

    Login

  </a>

)}
        </div>

      </div>



      {userName && (

        <div className="welcome-bar">

          <div
            className="welcome-dropdown"
            ref={dropdownRef}
          >

            <button
  type="button"
  className="welcome-btn"
  onClick={() =>
    setShowDropdown(
      (prev) => !prev
    )
  }
>

  <span>
    Welcome, {userName}
  </span>

  {profileImage &&
   profileImage !== "/default-avatar.jpg" && (

    <img
      src={profileImage}
      alt="Profile"
      className="navbar-profile-pic"
    />

  )}

  <span className="arrow">
    ▾
  </span>

</button>


            {showDropdown && (
  <div className="dropdown-menu">

     <button
      type="button"
      className="dropdown-btn"
      onClick={() => {
        setShowDropdown(false);
        router.push('/profile');
      }}
    >
      👤 My Profile
    </button>

    <button
      type="button"
      className="dropdown-btn"
      onClick={() => {
        setShowDropdown(false);
        router.push('/history');
      }}
    >
      📜 History
    </button>

    <button
      type="button"
      className="logout-btn"
      onClick={()=>{

    setShowDropdown(
        false
    );

    setShowLogoutDialog(
        true
    );

  }}
    >
      Logout
    </button>

  </div>
)}

          </div>

        </div>

      )}

      {

    showLogoutDialog && (

        <div
            className="dialog-overlay"
        >

            <div
                className="logout-dialog"
            >

                <h2>
                    ⚠️ Logout?
                </h2>


                <p>

                    Are you sure you
                    want to logout?

                </p>


                <div
                    className="delete-actions"
                >

                    <button
                        className=
                        "dialog-btn"

                        onClick={()=>{

                            setShowLogoutDialog(
                                false
                            );

                        }}
                    >

                        Cancel

                    </button>


                    <button
                        className=
                        "logout-confirm-btn"

                        onClick={
                            handleLogout
                        }
                    >

                        Logout

                    </button>

                </div>

            </div>

        </div>

    )

}

    </>
  );
}