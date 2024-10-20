"use client";
import { Button } from "@/components/ui/button";
import { decodedAccessUser, encryptLocalStorageSet } from "@/lib/utils";
import { Icon } from "@iconify/react";
import Link from "next/link";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

import { loginAction } from "@/actions/login";
import { SiteLogo } from "@/components/svg";
import { CircularProgress } from "@/components/ui/progress";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSearchParams } from "next/navigation";

const LogInForm = () => {
  const searchParams = useSearchParams();
  const { access_token, refresh_token } = {
    access_token: searchParams.get("access"),
    refresh_token: searchParams.get("refresh"),
  };
  const [isPending, startTransition] = React.useTransition();
  const [passwordType, setPasswordType] = React.useState<string>("password");
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const [isVisible, setIsVisible] = React.useState<boolean>(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const onClickHandle = (data: any) => {
    window.location.href = "http://100.86.3.124:4725/api/v1/auth/login/steam";
  };

  useEffect(() => {
    if (
      access_token &&
      refresh_token &&
      process.env.NEXT_PUBLIC_LOCAL_STORAGE_KEY
    ) {
      // set local storage
      encryptLocalStorageSet("access_token", access_token);
      encryptLocalStorageSet("refresh_token", refresh_token);
      const user = decodedAccessUser();
      console.log("decoded olarak dönen user; ", user);

      if (!user) return;
      startTransition(async () => {
        loginAction(user.ID, user.Name, user.Avatar, user.Role).then(
          (data): any => {
            if (data && data.error) {
              toast.error(data.error);
            }
          }
        );
      });
    }
  }, []);

  if (!isPending) {
    return (
      <div className="w-full py-5 lg:py-10">
        <Link href="/dashboard" className="inline-block">
          <SiteLogo className="h-10 w-10 2xl:w-14 2xl:h-14 text-primary" />
        </Link>
        <div className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
          Hey, Hello 👋
        </div>
        <div className="2xl:text-lg text-base text-default-600 mt-2 leading-6">
          Enter the information you entered while registering.
        </div>
        <Button
          className="w-full hover:bg-default-200  text-default-700  hover:text-default-700"
          color="secondary"
          variant="outline"
          onClick={onClickHandle}
        >
          <Icon
            icon="ri:steam-fill"
            className="w-6 h-6 ltr:mr-2 rtl:ml-2"
            style={{ color: "#171A21" }}
          />
          Steam ile giriş yap
        </Button>
      </div>
    );
  } else {
    return (
      <div className="w-full py-5 lg:py-10">
        <CircularProgress
          className="mx-auto"
          value="50"
          color="primary"
          loading
        />
      </div>
    );
  }
};

export default LogInForm;
