// // SendMessageWrapper.js
// import { useParams, useNavigate } from "react-router-dom";
// import SendMessage from "./SendMessage";

// export default function SendMessageWrapper() {
//   const { uniqueId } = useParams();
//   const navigate = useNavigate();

//   return <SendMessage uniqueId={uniqueId} navigate={navigate} />;
// }
// src/components/messaging/SendMessageWrapper.js
import { useParams } from "react-router-dom";
import SendMessage from "./SendMessage";

export default function SendMessageWrapper() {
  const { uniqueId } = useParams();
  return <SendMessage uniqueId={uniqueId} />;
}
