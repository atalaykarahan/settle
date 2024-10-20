import { AttachmentModel } from "./attachment";
import { RepliedMessageModel } from "./repliedMessage";

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
}
