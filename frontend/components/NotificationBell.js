import { useState, useEffect, useRef } from "react";
import { IoNotificationsOutline } from "react-icons/io5";

export default function NotificationBell() {

  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef(null);


  useEffect(() => {

  const loadNotifications = () => {

    fetch(
      "http://localhost:5000/notifications"
    )

    .then(res => res.json())

    .then(data => {

      setNotifications(data);

    })

    .catch(err => {

      console.error(err);

    });

  };

  loadNotifications();

  const interval = setInterval(
    loadNotifications,
    5000
  );

  return () => clearInterval(interval);

}, []);

  // Close panel if clicked outside

  useEffect(() => {

    const handleClick = (e) => {

      if(

        panelRef.current &&

        !panelRef.current.contains(
          e.target
        )

      ){

        setShowPanel(false);

      }

    };


    document.addEventListener(

      "mousedown",

      handleClick

    );


    return ()=>{

      document.removeEventListener(

        "mousedown",

        handleClick

      );

    };

  }, []);



  const deleteNotification = async (id)=>{

  try{

    await fetch(

      `http://localhost:5000/admin/delete-notification/${id}`,

      {
        method:"DELETE"
      }

    );

    setNotifications(

      notifications.filter(

        item => item.id !== id

      )

    );

  }
  catch(err){

    console.error(err);

  }

};



  const clearAll = async ()=>{

  try{

    await fetch(

      "http://localhost:5000/admin/clear-notifications",

      {
        method:"DELETE"
      }

    );

    setNotifications([]);

  }
  catch(err){

    console.error(err);

  }

};



  return (

    <div
      className="notification-wrapper"
      ref={panelRef}
    >

      <div

        className="notification-bell"

        onClick={()=>

          setShowPanel(

            !showPanel

          )

        }

      >

        <IoNotificationsOutline />

        {

          notifications.length > 0 && (

            <span
             className="notification-badge"
            >

              {

                notifications.length

              }

            </span>

          )

        }

      </div>



      {

        showPanel && (

          <div className="notification-panel">

            <div className="notification-header">

              <h3>

                Notifications

              </h3>


              {

                notifications.length > 0 && (

                  <button

                   className="clear-btn"

                   onClick={clearAll}

                  >

                    Clear All

                  </button>

                )

              }

            </div>


            {

              notifications.length === 0 ?

              (

                <div
                 className="empty-box"
                >

                  No notifications

                </div>

              )

              :

              (

                notifications.map(

                  item=>(

                  <div

                   key={item.id}

                   className="notification-card"

                  >

                    <button

                     className="delete-notification"

                     onClick={()=>

                      deleteNotification(
                        item.id
                      )
                     }

                    >

                      ✕

                    </button>


                    <div
                     className="message"
                    >

                      {

                        item.message

                      }

                    </div>


                    <div
                     className="time"
                    >

                      {

                        item.time

                      }

                    </div>

                  </div>

                  )

                )

              )

            }

          </div>

        )

      }

    </div>

  );

}