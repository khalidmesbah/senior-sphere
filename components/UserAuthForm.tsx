"use client";

import { useState } from "react";
import { ActionResponse } from "@/lib/types/custom.type";
import { login, signup } from "@/lib/supabase/actions";
import {
  Tabs,
  Tab,
  Input,
  Link,
  Button,
  Card,
  CardBody,
  Checkbox,
} from "@nextui-org/react";
import { EyeFilledIcon, EyeSlashFilledIcon, Google } from "./Icons";
import { Facebook, Github } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { handleActionResponse } from "@/lib/supabase/helpers";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [selected, setSelected] = useState<string>("login");

  const goSignUp = () => setSelected("sign-up");
  const goLogin = () => setSelected("login");

  return (
    <Card className="w-full mx-3 min-w-[280px] max-w-[400px] h-[609px] shadow-md shadow-primary">
      <CardBody>
        <Tabs
          fullWidth
          size="md"
          aria-label="Tabs form"
          selectedKey={selected}
          onSelectionChange={(e) => setSelected(e.toString())}
        >
          <Tab key="login" title="Login">
            <LoginForm goSignUp={goSignUp} />
          </Tab>
          <Tab key="sign-up" title="Sign up">
            <SignUpForm goLogin={goLogin} />
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}

const loginFormSchema = z.object({
  email: z
    .string({
      required_error: "Please enter a valid email address.",
    })
    .email(),
  password: z.string().min(1),
});
type LoginFormValues = z.infer<typeof loginFormSchema>;

const LoginForm = ({ goSignUp }: { goSignUp: () => void }) => {
  const router = useRouter();
  const supabase = createClient();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormValues) => {
    const res = await login(data);
    router.replace("/");
    handleActionResponse(res);
  };

  const loginWithGithub = async (): Promise<ActionResponse> => {
    const res = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: location.origin + "/auth/callback",
      },
    });

    if (res.error)
      return { status: "error", message: `An error occured: ${res.error}` };

    return {
      status: "success",
      message: `Welome again to Senoirs Sphere, MR. Anonymous!!`,
    };
  };

  const loginWithGoogle = async (): Promise<ActionResponse> => {
    const res = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: location.origin + "/auth/callback",
      },
    });

    if (res.error)
      return { status: "error", message: `An error occured: ${res.error}` };

    return {
      status: "success",
      message: `Welome again to Senoirs Sphere, MR. Anonymous!!`,
    };
  };

  const loginAsGuest = async (): Promise<ActionResponse> => {
    const res = await supabase.auth.signInWithPassword({
      email: process.env.NEXT_PUBLIC_GUEST_EMAIL!,
      password: process.env.NEXT_PUBLIC_GUEST_PASSWORD!,
    });

    if (res.error)
      return { status: "error", message: `An error occured: ${res.error}` };

    return {
      status: "success",
      message: `Welome again to Senoirs Sphere, ${res.data.user.user_metadata.name}!!`,
    };
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div>
          <p className="text-small text-center mb-[7px]">Login with</p>
          <div className="flex flex-wrap justify-center items-center gap-2 p-2">
            <Button
              variant="ghost"
              size="sm"
              className="aspect-square rounded-full"
              onClick={loginWithGoogle}
            >
              <Google fill="hsl(var(--foreground))" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="aspect-square rounded-full"
              onClick={loginWithGithub}
            >
              <Github />
            </Button>
          </div>
        </div>
        <Separator color="primary" />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email address"
                  {...field}
                  isRequired
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                  isRequired
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-center text-small">
          Need to create an account?{" "}
          <Link size="sm" onPress={goSignUp}>
            Sign up
          </Link>
        </p>
        <div className="flex flex-col gap-4 justify-end">
          <Button type="submit" fullWidth color="primary">
            Login
          </Button>
          <Separator color="primary" />
          <Button
            variant="faded"
            color="primary"
            className="mt-auto"
            onClick={loginAsGuest}
          >
            Continue as a guest
          </Button>
        </div>
      </form>
    </Form>
  );
};

const signUpFormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please enter a valid email address.",
    })
    .email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .max(30, {
      message: "Password must not be longer than 30 characters.",
    }),
  secret_key: z.string().optional(),
});

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

const SignUpForm = ({ goLogin }: { goLogin: () => void }) => {
  const router = useRouter();
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      secret_key: "",
    },
    mode: "onChange",
  });

  const [isSecretKeyVisible, setIsSecretKeyVisible] = useState(false);
  const toggleSecretKeyVisibility = () =>
    setIsSecretKeyVisible(!isSecretKeyVisible);
  const [checked, setChecked] = useState<boolean>(false);

  const onSubmit = async (data: SignUpFormValues) => {
    const res = await signup({
      name: data.name,
      email: data.email,
      password: data.password,
      secretKey: data.secret_key as string,
    });
    router.replace("/");
    handleActionResponse(res);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  label="Name"
                  type="text"
                  placeholder="Enter your name"
                  {...field}
                  isRequired
                />
              </FormControl>
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
                  label="Email"
                  type="email"
                  placeholder="Enter your email address"
                  {...field}
                  isRequired
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  isRequired
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-center text-small">
          Already have an account?{" "}
          <Link size="sm" onPress={goLogin}>
            Login
          </Link>
        </p>
        <p className="text-center text-small">
          <Checkbox
            defaultSelected
            color="success"
            isSelected={checked}
            onChangeCapture={() => setChecked(!checked)}
            size="sm"
            dir="right"
          >
            Are you a senior student?
          </Checkbox>
        </p>
        {checked ? (
          <FormField
            control={form.control}
            name="secret_key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secret key</FormLabel>
                <FormControl>
                  <Input
                    label="Secret key"
                    variant="bordered"
                    placeholder="Enter the secret key"
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleSecretKeyVisibility}
                      >
                        {isSecretKeyVisible ? (
                          <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isSecretKeyVisible ? "text" : "password"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}
        <div className="flex gap-2 justify-end">
          <Button fullWidth color="primary" type="submit">
            Sign up
          </Button>
        </div>
      </form>
    </Form>
  );
};
