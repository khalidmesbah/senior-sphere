"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { type User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Separator } from "@/components/ui/separator";
import { updateUser } from "@/lib/supabase/actions";
import { l } from "@/lib/utils";
import { handleActionResponse } from "@/lib/supabase/helpers";
import { Link, Chip } from "@nextui-org/react";

const profileFormSchema = z
  .object({
    name: z
      .string()
      .min(6, {
        message: "Name must be at least 6 characters.",
      })
      .max(30, {
        message: "name must not be longer than 30 characters.",
      })
      .optional(),
    email: z
      .string({
        required_error: "Please enter a valid email address.",
      })
      .email()
      .optional(),
    current_password: z
      .union([
        z
          .string()
          .min(6, { message: "Password must be at least 6 characters." })
          .max(30, {
            message: "Password must not be longer than 30 characters.",
          }),
        z.string().length(0),
      ])
      .optional(),
    new_password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." })
      .max(30, {
        message: "Password must not be longer than 30 characters.",
      })
      .optional(),
    confirm_new_password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." })
      .max(30, {
        message: "Password must not be longer than 30 characters.",
      })
      .optional(),
    avatar_url: z
      .union([
        z.string().length(0),
        z.string().url({ message: "Invalid URL." }),
      ])
      .optional()
      .transform((e) => (e === "" ? undefined : e)),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "The new passwords do not match.",
    path: ["confirm_new_password"],
  });

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({ user }: { user: User }) {
  const isGuest = user.email === process.env.NEXT_PUBLIC_GUEST_EMAIL;
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [isForgetPassword, setIsForgetPassword] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: user.new_email || user.email || "",
      name: user.user_metadata.name || "",
      avatar_url: user.user_metadata.avatar_url || "",
    },
    mode: "onChange",
  });

  const verifyPassword = async () => {
    const password = form.watch().current_password;
    if (!password) return;
    if (isPasswordVerified) {
      handleActionResponse({
        status: "info",
        message: `The current password is already verified.`,
      });
      return;
    }

    const supabase = createClient();
    const res = await supabase.rpc("verify_user_password", {
      password,
    });

    l(`-------------------`);
    l(res);
    l(`-------------------`);

    if (res.error) {
      handleActionResponse({ status: "error", message: res.error.message });
      setIsPasswordVerified(false);
      return;
    }

    if (res.data === false) {
      handleActionResponse({ status: "warning", message: `Wrong password.` });
      setIsPasswordVerified(false);
      return;
    }

    handleActionResponse({
      status: "success",
      message: `The current password has been verified.`,
    });
    setIsPasswordVerified(true);
  };

  const onSubmit = async (data: ProfileFormValues) => {
    // l(`data: `, data);
    // l(`user: `, user);
    if (isGuest) {
      handleActionResponse({
        status: "warning",
        message: `As a guest you don't have the priviliges to do this action.`,
      });
      return;
    }

    const {
      email,
      name,
      avatar_url,
      current_password,
      new_password,
      confirm_new_password,
    } = data;
    const newData: {
      email?: string;
      password?: string;
      data?: {
        name?: string;
        avatar_url?: string;
        secret_key?: string;
        requested_role?: string;
      };
    } = {};

    // handle password
    if (
      isPasswordVerified &&
      new_password &&
      confirm_new_password &&
      new_password.trim() !== "" &&
      confirm_new_password.trim() !== "" &&
      new_password === confirm_new_password
    )
      newData.password = new_password;

    // handle email
    if (email !== user.new_email && email !== user.email) newData.email = email;

    if (name !== user.user_metadata.name) {
      newData.data = {};
      newData.data.name = name;
    }
    if (avatar_url && avatar_url !== user.user_metadata.avatar_url) {
      if (!newData.data) newData.data = {};
      newData.data.avatar_url = avatar_url;
    }

    // l(newData, `is the new data`, Object.keys(newData).length);

    if (Object.keys(newData).length !== 0) {
      updateUser(user.id, newData);
      // change the message to not show the data
      toast.success(
        `You submitted the following values: ${JSON.stringify(
          newData,
          null,
          2,
        )}`,
      );
    } else {
      toast.info(`Nothing to update.`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="shadcn"
                  {...field}
                  disabled={isGuest}
                  type="text"
                />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym. You can only change this once every 30 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email address"
                  type="email"
                  {...field}
                  disabled={isGuest}
                />
              </FormControl>
              <FormDescription>Enter the new email address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatar_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URLs</FormLabel>
              <FormDescription>
                Add the link to your avatar image.
              </FormDescription>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter the avatar url"
                  type="text"
                  disabled={isGuest}
                />
              </FormControl>
              <FormMessage />
              <FormDescription className="flex justify-end">
                <Link
                  target="_blank"
                  href="https://vinicius73.github.io/gravatar-url-generator/#/"
                >
                  Get an avatar
                </Link>
              </FormDescription>
            </FormItem>
          )}
        />
        <h2>Change the password</h2>
        <FormField
          control={form.control}
          name="current_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-end gap-2 items-center">
                <div className="w-full">Verify your current password</div>
                {isPasswordVerified ? (
                  <Chip color="success">Verified</Chip>
                ) : (
                  <Chip color="danger">Not verified</Chip>
                )}
              </FormLabel>
              <FormControl>
                <div className="flex justify-end gap-2">
                  <Input
                    type="password"
                    placeholder="Current password"
                    disabled={isGuest || isPasswordVerified}
                    {...field}
                  />
                  <Button
                    disabled={isGuest}
                    onClick={verifyPassword}
                    type="button"
                  >
                    Verify
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                Enter your current password here to verify it.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="New password"
                  {...field}
                  disabled={isGuest || !isPasswordVerified}
                />
              </FormControl>
              <FormDescription>Enter your New password here.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm new password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  {...field}
                  disabled={isGuest || !isPasswordVerified}
                />
              </FormControl>
              <FormDescription>Confirm the new password here.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isGuest}>
          Update profile
        </Button>
      </form>
    </Form>
  );
}
