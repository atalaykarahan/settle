"use client";
import { type Chat as ChatType, type ProfileUser } from "@/app/api/chat/data";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { formatTime } from "@/lib/utils";
import { MessageModel } from "@/models/message";
import { RoomModel } from "@/models/room";
import { Icon } from "@iconify/react";
import { divIcon } from "leaflet";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
const chatAction = [
  {
    label: "Remove",
    link: "#",
  },
  {
    label: "Forward",
    link: "#",
  },
];

interface MessagesProps {
  message: MessageModel;
  room: RoomModel;
  profile: ProfileUser;
  onDelete: (selectedChatId: any, index: string) => void;
  onEdit: (selectedChatId: any, index: string, content: string) => void;
  index: string;
  selectedChatId: string;
  handleReply: (data: any, room: RoomModel) => void;
  // replayData: any;
  handleForward: (data: any) => void;
  handlePinMessage: (data: any) => void;
  pinnedMessages: ChatType[];
}
const Messages = ({
  message,
  room,
  profile,
  onDelete,
  onEdit,
  index,
  selectedChatId,
  // handleReply,
  // replayData,
  handleForward,
  handlePinMessage,
  pinnedMessages,
}: MessagesProps) => {
  const {
    Sender: sender,
    Content: chatMessage,
    UpdatedAt: time,
    CreatedAt: createdAt,
    RepliedMessage: replayMetadata,
    DeletedAt: deletedAt,
  } = message;
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState(chatMessage);

  // const { avatar } = room;
  // State to manage pin status
  const isMessagePinned = pinnedMessages.some(
    (pinnedMessage: any) => pinnedMessage.index === index
  );

  const handlePinMessageLocal = (note: any) => {
    const obj = {
      note,
      // avatar,
      index,
    };
    handlePinMessage(obj);
  };

  return (
    <>
      <div className="block md:px-6 px-0 ">
        {sender.ID === profile.id ? (
          <>
            {/* {replayMetadata !== null && (
              <div className="w-max ml-auto -mb-2 mr-10">
                <div className="flex items-center gap-1 mb-1">
                  <Undo2 className="w-4 h-4 text-default-600" />{" "}
                  <span className="text-xs text-default-700">
                    You replied to
                    <span className="ml-1 text-default-800">
                      {replayMetadata?.contact?.fullName}
                    </span>
                  </span>
                </div>
                <p className="truncate text-sm bg-default-200 rounded-2xl px-3 py-2.5">
                  {replayData?.message}
                </p>
              </div>
            )} */}
            <div className="flex space-x-2 items-start justify-end group w-full rtl:space-x-reverse mb-4">
              <div className=" flex flex-col  gap-1">
                <div className="flex items-center gap-1">
                  <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible ">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <span className="w-7 h-7 rounded-full bg-default-200 flex items-center justify-center">
                          <Icon
                            icon="bi:three-dots-vertical"
                            className="text-lg"
                          />
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-20 p-0"
                        align="center"
                        side="top"
                      >
                        <DropdownMenuItem
                          onClick={() => onDelete(selectedChatId, index)}
                        >
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditMode(true)}>
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="whitespace-pre-wrap break-all">
                    <div className="bg-primary/70 text-primary-foreground  text-sm  py-2 px-3 rounded-2xl  flex-1  ">
                      {editMode ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            id="chatMessage"
                            defaultValue={chatMessage}
                            onChange={(e) => setInputValue(e.target.value)}
                          />
                          <Badge
                            color={"success"}
                            className="w-5 h-5 rounded-full"
                            onClick={() => {
                              onEdit(selectedChatId, index, inputValue);
                              setEditMode(false);
                            }}
                          />
                          <Badge
                            color={"destructive"}
                            className="w-5 h-5 rounded-full"
                            onClick={() => setEditMode(false)}
                          />
                        </div>
                      ) : deletedAt == null ? (
                        chatMessage
                      ) : (
                        <span className="text-gray-400 font-bold">
                          This message was deleted
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-end text-default-500">
                  {time !== createdAt && "(edited)"} {formatTime(time)}
                </span>
              </div>
              <div className="flex-none self-end -translate-y-5">
                <div className="h-8 w-8 rounded-full ">
                  <Image
                    src={profile?.image}
                    width={32}
                    height={32}
                    alt=""
                    className="block w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex space-x-2 items-start group rtl:space-x-reverse mb-4">
            <div className="flex-none self-end -translate-y-5">
              <div className="h-8 w-8 rounded-full">
                <Image
                  src={sender?.Avatar}
                  width={32}
                  height={32}
                  alt=""
                  className="block w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex flex-col   gap-1">
                <div className="flex items-center gap-1">
                  <div className="whitespace-pre-wrap break-all relative z-[1]">
                    {isMessagePinned && (
                      <Icon
                        icon="ion:pin-sharp"
                        className=" w-5 h-5 text-destructive  absolute left-0 -top-3 z-[-1]  transform -rotate-[30deg]"
                      />
                    )}

                    <div className="bg-default-200  text-sm  py-2 px-3 rounded-2xl  flex-1  ">
                      <span className="text-orange-300 font-bold">
                        {sender?.Name}
                      </span>
                      <br />
                      {deletedAt == null ? (
                        chatMessage
                      ) : (
                        <span className="text-gray-400 font-bold">
                          This message was deleted
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible ">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <span className="w-7 h-7 rounded-full bg-default-200 flex items-center justify-center">
                          <Icon
                            icon="bi:three-dots-vertical"
                            className="text-lg"
                          />
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-20 p-0"
                        align="center"
                        side="top"
                      >
                        <DropdownMenuItem
                          onClick={() => onDelete(selectedChatId, index)}
                        >
                          Remove
                        </DropdownMenuItem>
                        <DropdownMenuItem
                        // onClick={() => handleReply(chatMessage, room)}
                        >
                          Reply
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handlePinMessageLocal(chatMessage)}
                        >
                          {isMessagePinned ? "Unpin" : "Pin"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleForward(chatMessage)}
                        >
                          Forward
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <span className="text-xs   text-default-500">
                  {formatTime(time)} {time !== createdAt && "(edited)"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Messages;
