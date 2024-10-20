import { AttachmentModel } from "./attachment";

export interface RepliedMessageModel {
  ID: string;
  Content: string;
  SenderID: string;
  RoomID: string;
  RepliedMessage: RepliedMessageModel;
  Attachment: AttachmentModel;
  ReadStatus: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  DeletedAt: Date;
}
