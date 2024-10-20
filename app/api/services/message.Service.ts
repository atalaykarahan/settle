import axios from "@/app/api/axios";
import { RoomModel } from "@/models/room";

class MessageService {
  //#region GET ALL
  async getByRoomId(
    room_id: string,
    limit: number,
    offset: number
  ): Promise<any> {
    const body = {
      room_id,
      limit,
      offset,
    };

    return await axios.post(`/message/history`, body);
  }

  //#endregion
}

export const messageService = new MessageService();

// export const getMessages = async (id: any) => {
//     try {
//       const response = await axios.get(`/chat/messages/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//       throw error;
//     }
//   };
