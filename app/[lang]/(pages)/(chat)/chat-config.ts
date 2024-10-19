// import { axios } from "@/config/axios.config";
import axios from "@/app/api/axios"

// export const getContacts = async () => {
//   const response = await axios.get("/chat");
//   return response.data;
// };

export const getMessages = async (id: any) => {
  try {
    const response = await axios.get(`/chat/messages/${id}`);
    console.log("Response from getMessages:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};
export const deleteMessage = async (obj: any) => {
  console.log("Object to be sent:", obj); // Add this log statement
  try {
    await axios.delete(`/chat/messages/${obj.selectedChatId}`, { data: obj });
  } catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully (e.g., display an error message to the user)
  }
};

export const getProfile = async () => {
  const response = await axios.get("/chat/profile-data");

  return response.data;
};

export const sendMessage = async (msg: any) => {
  const response = await axios.post("/chat/messages", msg);
  return response.data;
};
