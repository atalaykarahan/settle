"use server";

import {authService} from "@/app/api/services/auth.Service";
import {signOut} from "@/lib/auth";

export const logoutAction = async () => {
    await authService.logoutServer().then(async (res: any) => {
        if (res === 200) {
            await signOut();
        }
    });
};