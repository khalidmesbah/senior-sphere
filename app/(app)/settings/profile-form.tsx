"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { type User } from "@supabase/supabase-js";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Separator } from "@/components/ui/separator";

const profileFormSchema = z
  .object({
    username: z
      .string()
      .min(6, {
        message: "Username must be at least 6 characters.",
      })
      .max(30, {
        message: "Username must not be longer than 30 characters.",
      })
      .optional(),
    email: z
      .string({
        required_error: "Please enter a valid email address.",
      })
      .email()
      .optional(),
    current_password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." })
      .max(30, {
        message: "Password must not be longer than 30 characters.",
      })
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
    passphrase: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." })
      .max(30, {
        message: "Passphrase must not be longer than 30 characters.",
      })
      .optional(),
    avatar_url: z
      .string()
      .url({ message: "Please enter a valid image URL." })
      .optional(),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "The new passwords do not match.",
    path: ["confirm_new_password"],
  });

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({ user }: { user: User }) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user.user_metadata?.name! || "",
      email: user.email,
      current_password: "",
      new_password: "",
      confirm_new_password: "",
      avatar_url: user.user_metadata?.avatar_url! || "",
    },
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    // updateAvatarURL();
    updateUsername();
    console.log(`khkfkdsjklfjdslakfjklasdjflakdsjflsadkjfkjdsalkfj`);

    toast(
      `You submitted the following values: ${JSON.stringify(data, null, 2)}`,
    );
  }

  const updateAvatarURL = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.updateUser({
      data: { avatar_url: form.watch().avatar_url },
    });
    if (error) {
      toast(JSON.stringify(error));
    } else {
      toast(JSON.stringify(data));
    }
    console.log(
      "\n---------------> from updateAvatarURL\n",
      `gives: `,
      form.watch(),
      `data: `,
      data,
      `error: `,
      error,
      "\n<--------------- from updateAvatarURL\n",
    );
  };

  const updateUsername = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.updateUser({
      data: { name: form.watch().username },
    });

    if (error) {
      toast(JSON.stringify(error));
    } else {
      toast(JSON.stringify(data));
    }
    console.log(
      "\n---------------> from updateUsername\n",
      `gives: `,
      form.watch(),
      `data: `,
      data,
      `error: `,
      error,
      "\n<--------------- from updateUsername\n",
    );
  };
  const updateEmail = async () => {
    const supabase = createClient();

    const { data, error } = await supabase.auth.updateUser({
      email: form.watch().email,
    });
    console.log(
      "\n---------------> from updateEmail\n",
      `gives: `,
      form.watch(),
      `data: `,
      data,
      `error: `,
      error,
      "\n<--------------- from updateEmail\n",
    );
  };

  const updatePassword = async () => {
    const supabase = createClient();

    const { data, error } = await supabase.auth.updateUser({
      password: form.watch().current_password,
    });
    console.log(
      "\n---------------> from updateEmail\n",
      `gives: `,
      form.watch(),
      `data: `,
      data,
      `error: `,
      error,
      "\n<--------------- from updateEmail\n",
    );
  };

  useEffect(() => {
    console.log(`rerender: `, form.watch());
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym. You can only change this once every 30 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button onClick={updateUsername}>update username</Button>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email address" type="email" {...field} />
              </FormControl>
              <FormDescription>Enter the new email address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button onClick={updateEmail}>update email</Button>
        <Separator />
        <FormField
          control={form.control}
          name="current_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Current password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter your current password here.
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
                <Input type="password" placeholder="New password" {...field} />
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
              <FormLabel>Current password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  {...field}
                />
              </FormControl>
              <FormDescription>Confirm the new password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button onClick={updatePassword}>update password</Button>
        <Separator />
        <FormField
          control={form.control}
          name="avatar_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URLs</FormLabel>
              <FormDescription>
                Add links to your website, blog, or social media profiles.
              </FormDescription>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button onClick={updateAvatarURL}>update avatar url</Button>
        <Separator />
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
