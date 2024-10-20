import { MessageModel } from "./message";

export interface RoomModel {
  ID: string;
  CreatedUserID: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  DeletedAt: Date;
  LastMessage: MessageModel;
}
