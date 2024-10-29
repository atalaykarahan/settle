import axios from "@/app/api/axios";
import { RoomModel } from "@/models/room";

class MessageService {
  
  //#region GET ALL BY ROOM ID
  async getByRoomId(
    RoomID: string,
    Limit: number,
    Offset: number
  ): Promise<any> {
    const body = {
      RoomID,
      Limit,
      Offset,
    };

    return await axios.post(`/message/history`, body);
  }
  //#endregion
}

export const messageService = new MessageService();
