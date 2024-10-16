"use client";

import ReportsSnapshot from "@/components/reports-snapshot";
import UsersStat from "@/app/[lang]/(pages)/(home)/components/users-stat";


interface DashboardPageViewProps {
    trans: {
        [key: string]: string;
    };
}

const DashboardPageView = ({trans}: DashboardPageViewProps) => {
    return (
        <div className="space-y-6">
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
