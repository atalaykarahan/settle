export interface LastMessageModel {
    ID: string;
    Content: string;
    SenderID:string;
    RoomID:string;
    RepliedMessage: object;
    Attachment: object;
    ReadStatus: string;
    CreatedAt: Date;
    UpdatedAt: Date;
    DeletedAt: Date;
}