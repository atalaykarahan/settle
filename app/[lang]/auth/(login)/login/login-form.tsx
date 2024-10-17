"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Checkbox } from "@/components/ui/checkbox";
import CryptoJS from "crypto-js";

// import googleIcon from "@/public/images/auth/google.png";
// import facebook from "@/public/images/auth/facebook.png";
// import twitter from "@/public/images/auth/twitter.png";
// import GithubIcon from "@/public/images/auth/github.png";
import { SiteLogo } from "@/components/svg";
import { useMediaQuery } from "@/hooks/use-media-query";
import { loginAction } from "@/actions/login";
import { useSearchParams } from "next/navigation";
import { CircularProgress } from "@/components/ui/progress";

// const schema = z.object({
//   email: z.string().email({ message: "Your email is invalid." }),
//   password: z.string().min(4),
// });
const LogInForm = () => {
  const searchParams = useSearchParams();
  const { access_token, refresh_token } = {
    access_token: searchParams.get("access"),
    refresh_token: searchParams.get("refresh"),
  };
  const [isPending, startTransition] = React.useTransition();
  const [passwordType, setPasswordType] = React.useState<string>("password");
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");

  // const togglePasswordType = () => {
  //   if (passwordType === "text") {
  //     setPasswordType("password");
  //   } else if (passwordType === "password") {
  //     setPasswordType("text");
  //   }
  // };
  // const {
  //   register,
  //   handleSubmit,
  //   reset,
  //   formState: { errors },
  // } = useForm({
  //   resolver: zodResolver(schema),
  //   mode: "all",
  //   defaultValues: {
  //     email: "dashtail@codeshaper.net",
  //     password: "password",
  //   },
  // });
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
      const decodedAccess = JSON.parse(atob(access_token.split(".")[1]));

      const encryptedAccess = CryptoJS.AES.encrypt(
        access_token,
        process.env.NEXT_PUBLIC_LOCAL_STORAGE_KEY
      ).toString();
      const encryptedRefresh = CryptoJS.AES.encrypt(
        refresh_token,
        process.env.NEXT_PUBLIC_LOCAL_STORAGE_KEY
      ).toString();

      // set local storage
      localStorage.setItem("access_token", encryptedAccess);
      localStorage.setItem("refresh_token", encryptedRefresh);

      startTransition(async () => {
        loginAction(
          decodedAccess.user.ID,
          decodedAccess.user.Name,
          decodedAccess.user.Avatar,
          decodedAccess.user.Role
        ).then((data): any => {
          if (data && data.error) {
            toast.error(data.error);
          }
        });
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
        <CircularProgress className="mx-auto" value="50" color="primary" loading />
      </div>
    );
  }
};

export default LogInForm;
