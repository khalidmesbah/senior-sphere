"use client";

import { useState } from "react";
import { login, signup } from "@/components/Actions";
import {
  Tabs,
  Tab,
  Input,
  Link,
  Button,
  Card,
  CardBody,
  Checkbox,
  checkbox,
} from "@nextui-org/react";
import { EyeFilledIcon, EyeSlashFilledIcon, Google } from "./Icons";
import { Facebook, Github } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [selected, setSelected] = useState<string>("login");
  const [checked, setChecked] = useState<boolean>(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  // Sign up form state
  const [signUpName, setSignUpName] = useState<string>("");
  const [signUpEmail, setSignUpEmail] = useState<string>("");
  const [signUpPassword, setSignUpPassword] = useState<string>("");
  const [signUpPassphrase, setSignUpPassphrase] = useState<string>("");
  const [isPassphraseVisible, setIsPassphraseVisible] = useState(false);
  const togglePassphraseVisibility = () =>
    setIsPassphraseVisible(!isPassphraseVisible);

  const handleLoginWithGithub = () => {
    const supabase = createClient();
    supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: location.origin + "/auth/callback",
      },
    });
  };

  const handleLoginWithGoogle = () => {
    const supabase = createClient();
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: location.origin + "/auth/callback",
      },
    });
  };

  return (
    <Card className="max-w-full w-[340px] h-[489px]">
      <CardBody className="overflow-hidden">
        <Tabs
          fullWidth
          size="md"
          aria-label="Tabs form"
          selectedKey={selected}
          onSelectionChange={(e) => setSelected(e.toString())}
        >
          <Tab key="login" title="Login">
            <div>
              <form className="flex flex-col gap-4">
                <div>
                  <p className="text-small text-center">Login with</p>
                  <div className="flex flex-wrap justify-center items-center gap-2 py-2">
                    <Button size="md" className="aspect-square rounded-full">
                      <Facebook />
                    </Button>
                    <Button
                      size="md"
                      className="aspect-square rounded-full"
                      onClick={handleLoginWithGoogle}
                    >
                      <Google fill="hsl(var(--foreground))" />
                    </Button>
                    <Button
                      size="md"
                      className="aspect-square rounded-full"
                      onClick={handleLoginWithGithub}
                    >
                      <Github />
                    </Button>
                  </div>
                </div>
                <Separator color="primary" />
                <Input
                  name="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.currentTarget.value)}
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  isRequired
                />
                <Input
                  name="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.currentTarget.value)}
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  isRequired
                  autoComplete="off"
                />
                <p className="text-center text-small">
                  Need to create an account?{" "}
                  <Link size="sm" onPress={() => setSelected("sign-up")}>
                    Sign up
                  </Link>
                </p>

                <div className="flex flex-col gap-4 justify-end">
                  <Button
                    fullWidth
                    color="primary"
                    onClick={() => {
                      login({ email: loginEmail, password: loginPassword });
                    }}
                  >
                    Login
                  </Button>
                  <Separator color="primary" />
                  <Button variant="faded" color="primary" className="mt-auto">
                    Continue as a guest
                  </Button>
                </div>
              </form>
            </div>
          </Tab>
          <Tab key="sign-up" title="Sign up">
            <div>
              <form className="flex flex-col gap-4">
                <Input
                  name="name"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.currentTarget.value)}
                  label="Name"
                  type="text"
                  placeholder="Enter your name"
                  isRequired
                />
                <Input
                  name="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.currentTarget.value)}
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  isRequired
                />
                <Input
                  name="password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.currentTarget.value)}
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  isRequired
                  autoComplete="off"
                />
                <p className="text-center text-small">
                  Already have an account?{" "}
                  <Link size="sm" onPress={() => setSelected("login")}>
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
                  <>
                    <Input
                      name="passphrase"
                      value={signUpPassphrase}
                      onChange={(e) =>
                        setSignUpPassphrase(e.currentTarget.value)
                      }
                      label="Passphrase"
                      variant="bordered"
                      placeholder="Enter the secret passphrase"
                      endContent={
                        <button
                          className="focus:outline-none"
                          type="button"
                          onClick={togglePassphraseVisibility}
                        >
                          {isPassphraseVisible ? (
                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                          ) : (
                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                          )}
                        </button>
                      }
                      type={isPassphraseVisible ? "text" : "password"}
                      className="max-w-xs"
                    />
                  </>
                ) : null}
                <div className="flex gap-2 justify-end">
                  <Button
                    fullWidth
                    color="primary"
                    onClick={() => {
                      signup({
                        name: signUpName,
                        email: signUpEmail,
                        password: signUpPassword,
                      });
                    }}
                  >
                    Sign up
                  </Button>
                </div>
              </form>
            </div>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
