import { AttachmentModel } from "./attachment";
import { RepliedMessageModel } from "./repliedMessage";
import { UserModel } from "./user";

export interface MessageModel {
  ID: string;
  Content: string;
  SenderID: string;
  RoomID: string;
  RepliedMessage: RepliedMessageModel;
  Attachment: AttachmentModel;
  ReadStatus: number;
  CreatedAt: Date;
  UpdatedAt: Date;
  DeletedAt: Date;
  User: UserModel;
}