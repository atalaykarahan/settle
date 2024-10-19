import { LastMessageModel } from "./lastMessage";

export interface RoomModel {
  ID: string;
  CreatedUserID: string;
  LastMessage: LastMessageModel;
  CreatedAt: Date;
  UpdatedAt: Date;
  DeletedAt: Date;
}
