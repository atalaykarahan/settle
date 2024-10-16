"use client";
import {Icon} from "@iconify/react";
import AddBlock from "../common/add-block";
import {useCurrentUser} from "@/app/hooks/use-current-user";
import {logoutAction} from "@/actions/logout";

const LogoutFooter = () => {
    const user = useCurrentUser();

    const handleLogOut = async () => {
        try {
            await logoutAction();
        } catch (error) {
            console.error("hata mesajı catch")
        }
    }

    const emailString = () => {
        if (user && user.email && user.email.length > 23)
            return user.email.substring(0, 21) + '...';
        return user?.email
    }

    return (
        <>
            <AddBlock/>
            <div className=" bg-default-50 dark:bg-default-200 items-center flex gap-3  px-4 py-2 mt-5">
                <div className="flex-1">
                    <div className=" text-default-700 font-semibold text-sm capitalize mb-0.5 truncate">
                        {user?.name}
                    </div>
                    <div className=" text-xs text-default-600  truncate">
                        {emailString()}
                    </div>
                </div>
                <div className=" flex-none">
                    <button
                        type="button"
                        onClick={handleLogOut}
                        className="  text-default-500 inline-flex h-9 w-9 rounded items-center  dark:bg-default-300 justify-center dark:text-default-900"
                    >
                        <Icon
                            icon="heroicons:arrow-right-start-on-rectangle-20-solid"
                            className=" h-5 w-5"
                        />
                    </button>
                </div>
            </div>
        </>
    );
};

export default LogoutFooter;
