// import React, { useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { GLOBAL_TYPES } from "./redux/actions/global.types";
// import { MESSAGE_TYPES } from "./redux/actions/message.action";
// import { NOTIFICATION_TYPES } from "./redux/actions/notification.action";
// import { POST_TYPES } from "./redux/actions/post.action";

// import bell from "./audio/bell.mp3";

// const spawnNotification = (body, icon, url, title) => {
//   let options = {
//     body,
//     icon,
//   };

//   let n = new Notification(title, options)

//   n.onclick = e => {
//       e.preventDefault()
//       window.open(url, '_blank')
//   }
// };

// const SocketClient = () => {
//     const { auth, socket, notification, online, call } = useSelector(state => state)
//     const dispatch = useDispatch()

//     const audioRef = useRef()

//     // User joins
//     useEffect(() => {
//         socket.emit('joinUser', auth.user)
//     }, [socket, auth.user])

//     // Likes
//     useEffect(() => {
//         socket.on('likeToClient', newPost => {
//             dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })
//         })

//         return () => socket.off('likeToClient')
//     }, [socket, dispatch])

//     useEffect(() => {
//         socket.on('unlikeToClient', newPost => {
//             dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })
//         })

//         return () => socket.off('unlikeToClient')
//     }, [socket, dispatch])

//     // Comments
//   return <div></div>;
// };

// export default SocketClient;
