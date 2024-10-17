"use client";

import ReportsSnapshot from "@/components/reports-snapshot";
import UsersStat from "@/app/[lang]/(pages)/(home)/components/users-stat";
import { useCurrentUser } from "@/app/hooks/use-current-user";
import { currentUser } from "@/lib/userAuth";


interface DashboardPageViewProps {
    trans: {
        [key: string]: string;
    };
}

const DashboardPageView = ({trans}: DashboardPageViewProps) => {
    const user = useCurrentUser();
    return (
        <div className="space-y-6">
            {JSON.stringify(user)}
            <div className="flex items-center flex-wrap justify-between gap-4">
                <div className="text-2xl font-medium text-default-800 ">
                    Blogs Dashboard
                </div>
            </div>
            {/* reports area */}
            <div className="grid grid-cols-12  gap-6 ">
                <div className="col-span-12 lg:col-span-12">
                    <ReportsSnapshot/>
                </div>
                {/*<div className="col-span-12 lg:col-span-4">*/}
                {/*    /!*<UsersStat/>*!/*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default DashboardPageView;
