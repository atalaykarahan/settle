"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Icon} from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import avatarGojo from "@/public/images/avatar/avatar-gojo.png";
import {useCurrentUser} from "@/app/hooks/use-current-user";
import {logoutAction} from "@/actions/logout";

const ProfileInfo = () => {
    const user = useCurrentUser();

    const handleLogOut = async () => {
        try {
            await logoutAction();
        } catch (error) {
            console.error("hata mesajı logout;", error)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className=" cursor-pointer">
                <div className=" flex items-center  ">
                    <Image
                        src={avatarGojo}
                        alt=""
                        width={36}
                        height={36}
                        className="rounded-full"
                    />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-0" align="end">
                <DropdownMenuLabel className="flex gap-2 items-center mb-1 p-3">
                    <Image
                        src={avatarGojo}
                        alt=""
                        width={36}
                        height={36}
                        className="rounded-full"
                    />
                    <div>
                        <div className="text-sm font-medium text-default-800 capitalize ">
                            {user?.name}
                        </div>
                        <Link
                            href="https://www.linkedin.com/in/atalay-karahan-050985250/"
                            className="text-xs text-default-600 hover:text-primary"
                        >
                            @atalay-karahan
                        </Link>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="mb-0 dark:bg-background"/>
                <DropdownMenuItem
                    onSelect={handleLogOut}
                    className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize my-1 px-3 dark:hover:bg-background cursor-pointer"
                >
                    <Icon icon="heroicons:power" className="w-4 h-4"/>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
export default ProfileInfo;
