"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import UsersDataChart from "./users-data-chart";
import UsersDataTable from "./users-data-table";
interface Users {
  id: number;
  country: string;
  count: string;
}

const UsersStat = () => {
  const usersData:Users[] = [
    {
      id: 1,
      country: "Bangladesh",
      count: "05",
    },
    {
      id: 2,
      country: "India",
      count: "06",
    },
    {
      id: 3,
      country: "Pakistan",
      count: "06",
    },
    {
      id: 4,
      country: "Australia",
      count: "10",
    },
    {
      id: 5,
      country: "America",
      count: "08",
    },
  ];
  return (
    <Card>
      <CardHeader className="border-none pb-0 mb-5">
        <div className="flex items-center gap-1">
          <div className="flex-1">
            <div className="text-xl font-semibold text-default-900"> Categories </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-0">
        <UsersDataChart />
        <UsersDataTable
          users={usersData}
        />
      </CardContent>
    </Card>
  );
};

export default UsersStat;