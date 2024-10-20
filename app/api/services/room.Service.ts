import axios from "@/app/api/axios";
import { RoomModel } from "@/models/room";

class RoomService {
  //#region GET ALL
  async getAll(): Promise<any> {
    return await axios.get(`/room`);
  }

  //#endregion

  // //#region CREATE
  // async create(name: string) {
  //     const props = {
  //         name: name
  //     }
  //     return await axios.post("/categories", props);
  // };

  // //#endregion

  // //#region UPDATE
  // async update(id: string, name: string) {
  //     const props = {
  //         id: id,
  //         name: name
  //     }
  //     return await axios.put("/categories", props);
  // };

  // //#endregion

  // //#region GET BY ID
  // async getById(id: string) {
  //     return await axios.get(`/categories/${id}`,);
  // };

  // //#endregion

  // //#region DELETE
  // async deleteById(id: string) {
  //     return await axios.delete(`/categories/${id}`,);
  // };

  // //#endregion

  // //#region GET ALL
  // async getAll() {
  //     return await axios.get(`/categories`,);
  // };

  //#endregion
}

export const roomService = new RoomService();
