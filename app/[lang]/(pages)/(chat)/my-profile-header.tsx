import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { InputGroup, InputGroupText } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type ProfileUser as ProfileUserType } from "@/app/api/chat/data";
const MyProfileHeader = ({
  profile,
  connectionStatus,
}: {
  profile: ProfileUserType;
  connectionStatus: "connected" | "failed" | "error" | "connecting";
}) => {

  const connectionBadge = () => {
    switch (connectionStatus) {
      case "connected":
        return (
          <span className="relative before:h-1.5 before:w-1.5 before:rounded-full before:bg-success before:absolute before:top-1.5 before:-right-3">
          {profile?.name}
        </span>
        );
        break;
      case "failed":
        return (
          <span className="relative before:h-1.5 before:w-1.5 before:rounded-full before:bg-orange-400 before:absolute before:top-1.5 before:-right-3">
          {profile?.name}
        </span>
        );
        break;
      case "error":
        return (
          <span className="relative before:h-1.5 before:w-1.5 before:rounded-full before:bg-rose-700 before:absolute before:top-1.5 before:-right-3">
          {profile?.name}
        </span>
        );
        break;
      default: //connecting
        return (
          <span className="relative before:h-1.5 before:w-1.5 before:rounded-full before:bg-blue-500 before:absolute before:top-1.5 before:-right-3">
          {profile?.name}
        </span>
        );
        break;
    }
  };

  return (
    <>
      <div className="flex  justify-between mb-4">
        <div className="flex   gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile?.image} alt="" />
            <AvatarFallback>{profile?.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="block">
            <div className="text-sm font-medium text-default-900 ">
              {connectionBadge()}
              {/* <span className="relative before:h-1.5 before:w-1.5 before:rounded-full before:bg-success before:absolute before:top-1.5 before:-right-3">
                {profile?.name}
              </span> */}
            </div>
            <span className="text-xs text-default-600">{profile?.role}</span>
          </div>
        </div>
        <div className="hidden lg:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                color="secondary"
                size="icon"
                className="rounded-full"
              >
                <Icon
                  icon="heroicons:ellipsis-horizontal-20-solid"
                  className=" h-5 w-5"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[196px]"
              align="end"
              avoidCollisions
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary">
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* search */}
      <InputGroup merged className="hidden lg:flex">
        <InputGroupText>
          <Icon icon="heroicons:magnifying-glass" />
        </InputGroupText>
        <Input type="text" placeholder="Search by name" />
      </InputGroup>
      {/* actions */}
      <div className="hidden lg:flex flex-wrap justify-between py-4 border-b border-default-200">
        {/* <Button className="flex flex-col items-center px-0 bg-transparent hover:bg-transparent text-default-500 hover:text-default-900">
          <span className="text-xl mb-1">
            <Icon icon="gala:chat" />
          </span>
          <span className="text-xs">Chats</span>
        </Button> */}
        <Button className="flex flex-col items-center px-0 bg-transparent hover:bg-transparent text-default-500 hover:text-default-900">
          <span className="text-xl mb-1">
            <Icon icon="material-symbols:group" />
          </span>
          <span className="text-xs">Groups</span>
        </Button>
        {/* <Button className="flex flex-col items-center px-0 bg-transparent hover:bg-transparent text-default-500 hover:text-default-900">
          <span className="text-xl mb-1">
            <Icon icon="ci:bell-ring" />
          </span>
          <span className="text-xs">Notification</span>
        </Button> */}
      </div>
    </>
  );
};

export default MyProfileHeader;
