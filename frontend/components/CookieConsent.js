import { useEffect, useState } from "react";

export default function CookieConsent() {

    const [showBanner, setShowBanner] = useState(false);
    const [visible, setVisible] = useState(true);

    useEffect(() => {

        const consent = localStorage.getItem("cookieConsent");

        if (!consent) {
            setShowBanner(true);
        }

    }, []);

    const acceptAll = () => {

        localStorage.setItem(
            "cookieConsent",
            JSON.stringify({
                necessary: true,
                functional: true,
                analytics: true
            })
        );

        setShowBanner(false);
    };

    const acceptNecessary = () => {

        localStorage.setItem(
            "cookieConsent",
            JSON.stringify({
                necessary: true,
                functional: false,
                analytics: false
            })
        );

        setShowBanner(false);
    };

    if (!showBanner) return null;
    if (!visible) return null;

    return (

        <div className="cookie-overlay">

            <div className="cookie-box">

                <h2>
                    🍪 Cookie Preferences
                </h2>

                <p>
                    VeriLex AI uses cookies to improve your experience,
                    enhance security, remember preferences,
                    and analyze website performance.
                </p>

                <div className="cookie-types">

                    <div className="cookie-item">

                        <h4>
                            Necessary Cookies
                        </h4>

                        <p>
                            Required for login and website functionality.
                        </p>

                    </div>

                    <div className="cookie-item">

                        <h4>
                            Functional Cookies
                        </h4>

                        <p>
                            Remember your preferences and settings.
                        </p>

                    </div>

                    <div className="cookie-item">

                        <h4>
                            Analytics Cookies
                        </h4>

                        <p>
                            Help us improve performance and features.
                        </p>

                    </div>

                </div>

                <div className="cookie-buttons">

                    <button
                        className="cookie-btn accept"
                        onClick={acceptAll}
                    >
                        Accept All
                    </button>

                    <button
                        className="cookie-btn necessary"
                        onClick={acceptNecessary}
                    >
                        Necessary Only
                    </button>

                    <button
      className="cookie-btn reject"
      onClick={() => {

         localStorage.setItem(
            "cookieConsent",
            JSON.stringify({
               necessary: false,
               functional: false,
               analytics: false
            })
         );

         setVisible(false);

      }}
   >
      Reject All
   </button>

                </div>

            </div>

        </div>

    );

}