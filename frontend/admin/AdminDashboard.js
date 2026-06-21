import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaSearch } from "react-icons/fa";

export default function AdminDashboard(){

  const router = useRouter();
  const [message,setMessage] = useState("");
  const [userCount,setUserCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [users,setUsers] = useState([]);
  const [searchTerm,setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [maintenance, setMaintenance] = useState(false);
  const [allNotifications, setAllNotifications] = useState([]);
  const [logs,setLogs] = useState([]);
  const [showLogs,setShowLogs] = useState(false);
  const [selectedProfile,setSelectedProfile] = useState(null);
  const [showProfile,setShowProfile] = useState(false);

  useEffect(()=>{

  loadUserCount();
  loadNotificationCount();
  loadContactCount();
  loadUsers();
  loadMessages();
  loadMaintenance();
  loadAllNotifications();
  loadLogs();

},[]);

  const loadUserCount = async()=>{

  try{

    const response = await fetch(
      "http://localhost:5000/admin/user-count"
    );

    const data = await response.json();

    setUserCount(
      data.total_users
    );

  }

  catch(err){

    console.error(err);

  }

};

const loadNotificationCount = async()=>{

  try{

    const response = await fetch(
      "http://localhost:5000/admin/notification-count"
    );

    const data = await response.json();

    setNotificationCount(
      data.total_notifications
    );

  }

  catch(err){

    console.error(err);

  }

};

const loadContactCount = async()=>{

  try{

    const response = await fetch(
      "http://localhost:5000/admin/contact-count"
    );

    const data = await response.json();

    setContactCount(
      data.total_contacts
    );

  }

  catch(err){

    console.error(err);

  }

};

const loadUsers = async()=>{

  try{

    const response = await fetch(
      "http://localhost:5000/admin/users"
    );

    const data = await response.json();

    setUsers(data);
    setFilteredUsers(data);
  }

  catch(err){

    console.error(err);

  }

};

const loadMessages = async()=>{

  try{

    const response =
    await fetch(

      "http://localhost:5000/admin/contact-messages"

    );

    const data =
    await response.json();

    setMessages(data);

  }

  catch(err){

    console.error(err);

  }

};

const loadAllNotifications = async()=>{

  try{

    const response =
    await fetch(

      "http://localhost:5000/admin/all-notifications"

    );

    const data =
    await response.json();

    setAllNotifications(
      data
    );

  }

  catch(err){

    console.error(err);

  }

};

const loadLogs = async()=>{

  try{

    const response =
      await fetch(
        "http://localhost:5000/admin/activity-logs"
      );

    const data = await response.json();

    setLogs(data);

  }

  catch(err){

    console.error(err);

  }

};

const loadUserProfile = async(email)=>{

  try{

    const response =
      await fetch(
        `http://localhost:5000/admin/user-profile/${encodeURIComponent(email)}`
      );

    const data = await response.json();
      console.log(data);
    setSelectedProfile(data);

    setShowProfile(true);

  }

  catch(err){

    console.error(err);

  }

};

const loadMaintenance = async()=>{

  const response =
  await fetch(

    "http://localhost:5000/admin/maintenance"

  );

  const data =
  await response.json();

  setMaintenance(
    data.maintenance
  );

};

const toggleMaintenance = async()=>{

  const confirmMaintenance =
    window.confirm(

      maintenance

      ?

      "Are you sure you want to disable maintenance mode?"

      :

      "Are you sure you want to enable maintenance mode and block public access?"

    );

  if(!confirmMaintenance){
    return;
  }

  try{

    const newValue =
      !maintenance;

    const response =
      await fetch(

        "http://localhost:5000/admin/maintenance",

        {
          method:"POST",

          headers:{
            "Content-Type":
            "application/json"
          },

          body:JSON.stringify({
            maintenance:newValue
          })

        }

      );

    const data =
      await response.json();

    console.log(data);

    setMaintenance(
      newValue
    );

  }

  catch(err){

    console.error(
      "MAINTENANCE ERROR:",
      err
    );

    alert(
      "Maintenance API failed. Check Flask terminal."
    );

  }

};

const deleteUser = async(id)=>{

  const confirmDelete =
    window.confirm(
      "Do you really want to delete this user?"
    );

  if(!confirmDelete){
    return;
  }

  try{

    await fetch(

      `http://localhost:5000/admin/delete-user/${id}`,

      {
        method:"DELETE"
      }

    );

    loadUsers();

    loadUserCount();

  }

  catch(err){

    console.error(err);

  }

};

const toggleUserStatus = async(id)=>{

  const confirmAction =
    window.confirm(
      "Do you want to change this user's status?"
    );

  if(!confirmAction){
    return;
  }

  try{

    await fetch(

      `http://localhost:5000/admin/toggle-user-status/${id}`,

      {
        method:"POST"
      }

    );

    loadUsers();

  }

  catch(err){

    console.error(err);

  }

};

const deleteNotification = async(id)=>{

  const confirmDelete = window.confirm("Delete this notification?");

  if(!confirmDelete){
    return;
  }

  try{

    await fetch(

      `http://localhost:5000/admin/delete-notification/${id}`,

      {
        method:"DELETE"
      }

    );

    loadAllNotifications();

    loadNotificationCount();

  }

  catch(err){

    console.error(err);

  }

};

const searchUsers = ()=>{

  const term =
    searchTerm.toLowerCase();

  const results = users.filter(

    (user)=>

      user[1]
      .toLowerCase()
      .includes(term)

      ||

      user[2]
      .toLowerCase()
      .includes(term)

  );

  setFilteredUsers(results);

};

  const sendNotification = async()=>{

  if(!message.trim()){

    alert(
      "Notification message cannot be empty."
    );

    return;

  }

  const confirmSend =
    window.confirm(
      "Do you surely want to send the message?"
    );

  if(!confirmSend){
    return;
  }

    try{

      const response =
        await fetch(

          "http://localhost:5000/admin/send-notification",

          {
            method:"POST",

            headers:{
              "Content-Type":"application/json"
            },

            body:JSON.stringify({
              message
            })
          }

        );

      const data =
        await response.json();

      if(data.status==="success"){

        alert(
          "Notification Sent"
        );

        setMessage("");
        loadAllNotifications();
        loadNotificationCount();

      }

    }

    catch(err){

      console.error(err);

    }

  };

const logout = ()=>{

  const confirmLogout = window.confirm("Are you sure you want to logout?");

  if(!confirmLogout){
    return;
  }

  router.push("/admin-login");

};

  return(

    <div className="dashboard-page">

      <div className="dashboard-card">

        <div
  style={{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"flex-start",
    marginBottom:"20px"
  }}
>

  <h1 className="dashboard-title">
    Admin Dashboard
  </h1>

  <div
    style={{
      display:"flex",
      flexDirection:"column",
      gap:"10px",
      alignItems:"flex-end"
    }}
  >

    <button
      className="admin-logout-btn"
      onClick={logout}
    >
      Logout
    </button>

    <button
      className="btn"
      onClick={()=>{

        loadLogs();

        setShowLogs(true);

      }}
    >
      Activity Logs
    </button>

  </div>

</div>

        <div className="stats-grid">

  <div className="stat-box">

    <div className="stat-label">
      Total Users
    </div>

    <div className="stat-value">
      {userCount}
    </div>

  </div>

  <div className="stat-box">

    <div className="stat-label">
      Notifications Sent
    </div>

    <div className="stat-value">
      {notificationCount}
    </div>

  </div>

  <div className="stat-box">

    <div className="stat-label">
      Contact Messages
    </div>

    <div className="stat-value">
      {contactCount}
    </div>

  </div>

</div>

        <div
          className="analytics-box"
        >

          <h2>
            Send Notification
          </h2>

          <textarea

            value={message}

            onChange={(e)=>
              setMessage(
                e.target.value
              )
            }

            placeholder=
            "Enter notification"

          />

          <button

  className="btn"

  onClick={sendNotification}

  disabled={!message.trim()}

>
  Send Notification
</button>

        </div>

            <div className="analytics-box">

  <h2>
    User Management
  </h2>

  <div
  style={{
    marginBottom:"20px"
  }}
>

  <div className="search-container">

  <input

    type="text"

    placeholder="Search user..."

    className="dashboard-search"

    value={searchTerm}

    onChange={(e)=>
      setSearchTerm(
        e.target.value
      )
    }

  />

  <button

    className="search-btn"

    onClick={searchUsers}

  >

    <FaSearch />

  </button>

</div>

</div>

  <table className="admin-user-table">

    <thead>

      <tr>

        <th>ID</th>

        <th>Name</th>

        <th>Email</th>

        <th>Status</th>

        <th>Registered On</th>

        <th>Last Login</th>

        <th>Action</th>

      </tr>

    </thead>

    <tbody>

      {filteredUsers.map((user)=>(

        <tr key={user[0]}>

          <td>{user[0]}</td>

          <td>{user[1]}</td>

          <td>{user[2]}</td>

          <td>

  {

    Number(user[3]) === 1

    ?

    "Active"

    :

    "Disabled"

  }

</td>

<td>
{
  user[4]
    ? new Date(user[4]).toLocaleDateString(
        "en-GB",
        { timeZone: "UTC" }
      )
    : "-"
}
</td>

<td>
  {user[5]
    ? new Date(user[5]).toLocaleString()
    : "Never"}
</td>

          <td
  style={{
    display:"flex",
    gap:"8px",
    alignItems:"center",
    flexWrap:"wrap"
  }}
>
  <button

  className="btn"

  onClick={()=>

    loadUserProfile(
      user[2]
    )

  }

>

  View Profile

</button>

  <button

    className="btn"

    onClick={()=>

      toggleUserStatus(
        user[0]
      )

    }

  >

    {

      Number(user[3]) === 1

      ?

      "Disable"

      :

      "Enable"

    }

  </button>

  <button

    className="admin-delete-btn"

    onClick={()=>
      deleteUser(user[0])
    }

  >

    Delete

  </button>

</td>

        </tr>

      ))}

    </tbody>

  </table>

</div>

<div className="analytics-box">

  <h2>
    Contact Messages
  </h2>

  <table
    className="admin-user-table"
  >

    <thead>

      <tr>

        <th>Name</th>

        <th>Email</th>

        <th>Subject</th>

        <th>View</th>

      </tr>

    </thead>

    <tbody>

      {messages.map(

        (msg,index)=>(

        <tr key={index}>

          <td>
            {msg[0]}
          </td>

          <td>
            {msg[1]}
          </td>

          <td>
            {msg[2]}
          </td>

          <td>

  <button

    className="btn"

    onClick={()=>
      setSelectedMessage(msg)
    }

  >

    View

  </button>

</td>

        </tr>

      ))}

    </tbody>

  </table>

</div>

{selectedMessage && (

<div className="analytics-box">

  <h2>
    Message Details
  </h2>

  <p>

    <strong>Name: </strong>

    {selectedMessage[0]}

  </p>

  <p>

    <strong>Email: </strong>

    {selectedMessage[1]}

  </p>

  <p>

    <strong>Subject: </strong>

    {selectedMessage[2]}

  </p>

  <p>

    <strong>Message: </strong>

    {selectedMessage[3]}

  </p>

</div>

)}

<div className="analytics-box">

  <h2>
    Notification Management
  </h2>

  <table
    className="admin-user-table"
  >

    <thead>

      <tr>

  <th>ID</th>

  <th>Message</th>

  <th>Time</th>

  <th>Action</th>

</tr>

    </thead>

    <tbody>

      {

        allNotifications.map(

          (item)=>(

          <tr key={item[0]}>

            <td>
              {item[0]}
            </td>

            <td>
              {item[1]}
            </td>

            <td>
              {item[2]}
            </td>

            <td>

              <button

                className=
                "admin-delete-btn"

                onClick={()=>

                  deleteNotification(
                    item[0]
                  )

                }

              >

                Delete

              </button>

            </td>

          </tr>

        ))

      }

    </tbody>

  </table>

</div>

{
selectedProfile && (

<div className="profile-modal">

  <div className="profile-content">

    <h2>User Profile</h2>

    <div className="profile-grid">

      <p>
        <strong>Username: </strong>
        {selectedProfile.username || "-"}
      </p>

      <p>
        <strong>Full Name: </strong>
        {selectedProfile.full_name || "-"}
      </p>

      <p>
        <strong>Gender: </strong>
        {selectedProfile.gender || "-"}
      </p>

      <p>
        <strong>Date Of Birth: </strong>
        {selectedProfile.dob || "-"}
      </p>

      <p>
        <strong>Country: </strong>
        {selectedProfile.country || "-"}
      </p>

      <p>
        <strong>Occupation: </strong>
        {selectedProfile.occupation || "-"}
      </p>

      <p>
        <strong>Bio: </strong>
        {selectedProfile.bio || "-"}
      </p>

    </div>

    <button
      className="btn"
      onClick={()=>
        setSelectedProfile(null)
      }
    >
      Close
    </button>

  </div>

</div>

)
}

{
showLogs && (

<div className="log-modal">

  <div className="log-content">

    <h2>
      Activity Logs
    </h2>

    <table className="admin-user-table">

      <thead>

        <tr>

          <th>ID</th>

          <th>Action</th>

          <th>Description</th>

          <th>Time</th>

        </tr>

      </thead>

      <tbody>

        {

          logs.map((log)=>(

            <tr key={log[0]}>

              <td>{log[0]}</td>

              <td>{log[1]}</td>

              <td>{log[2]}</td>

              <td>{log[3]}</td>

            </tr>

          ))

        }

      </tbody>

    </table>

    <button

      className="btn"

      onClick={()=>
        setShowLogs(false)
      }

    >

      Close

    </button>

  </div>

</div>

)
}

<div className="analytics-box">

  <h2>
    Maintenance Mode
  </h2>

  <button

    className="btn"

    onClick={
      toggleMaintenance
    }

  >

    {

      maintenance

      ?

      "Disable Maintenance"

      :

      "Enable Maintenance"

    }

  </button>

</div>

      </div>

    </div>

  );

}