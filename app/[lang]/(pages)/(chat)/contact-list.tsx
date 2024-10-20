"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import logo from "@/public/images/logo/logo-1.png";
import { Icon } from "@iconify/react";
import { RoomModel } from "@/models/room";

const ContactList = ({
  room,
  openChat,
  selectedChatId,
}: {
  room: RoomModel;
  openChat: (id: any) => void;
  selectedChatId: string;
}) => {
  const { ID, LastMessage, UpdatedAt } = room;

  return (
    <div
      className={cn(
        " gap-4 py-2 lg:py-2.5 px-3 border-l-2 border-transparent   hover:bg-default-200 cursor-pointer flex ",
        {
          "lg:border-primary/70 lg:bg-default-200 ":
            ID === (selectedChatId as any),
        }
      )}
      onClick={() => openChat(ID)}
    >
      <div className="flex-1 flex  gap-3 ">
        <div className="relative inline-block ">
          <Avatar>
            <AvatarImage src={logo.src} />
            <AvatarFallback className="uppercase">
              {LastMessage.Content.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <Badge
            className=" h-2 w-2  p-0 ring-1 ring-border ring-offset-[1px]   items-center justify-center absolute
             left-[calc(100%-8px)] top-[calc(100%-10px)]"
            color={status === "online" ? "success" : "secondary"}
          ></Badge>
        </div>
        <div className="block">
          <div className="truncate max-w-[120px]">
            <span className="text-sm text-default-900 font-medium">
              {" "}
              Genel Chat
            </span>
          </div>
          <div className="truncate  max-w-[120px]">
            <span className=" text-xs  text-default-600 ">
              {LastMessage.Content}
            </span>
          </div>
        </div>
      </div>
      <div className="flex-none  flex-col items-end  gap-2 hidden lg:flex">
        <span className="text-xs text-default-600 text-end uppercase">
          {new Date(UpdatedAt).toLocaleTimeString("tr-TR", {
            timeZone: "Europe/Istanbul",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </span>
        <span
          className={cn(
            "h-[14px] w-[14px] flex items-center justify-center bg-default-400 rounded-full text-primary-foreground text-[10px] font-medium",
            {
              "bg-primary/70": LastMessage.ReadStatus > 0,
            }
          )}
        >
          {LastMessage.ReadStatus === 0 ? (
            <Icon icon="uil:check" className="text-sm" />
          ) : (
            LastMessage.ReadStatus
          )}
        </span>
      </div>
    </div>
  );
};

export default ContactList;
