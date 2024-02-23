"use client";

import { type User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import {
  BookMarked,
  FunctionSquare,
  GraduationCap,
  Home,
  Menu,
  MessageSquareMore,
  MessageSquareMoreIcon,
  MusicIcon,
  Settings,
  VideoIcon,
} from "lucide-react";
import {
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Avatar,
  Tab,
  Chip,
  Tabs,
  AvatarIcon,
} from "@nextui-org/react";
import {
  ChevronDown,
  Lock,
  Activity,
  Flash,
  Server,
  TagUser,
  Scale,
  GalleryIcon,
  AddNoteIcon,
} from "./Icons";
import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { l } from "@/lib/utils";
import { Input } from "@nextui-org/react";

const MyNavbar = ({ user }: { user: User | null }) => {
  const router = useRouter();
  // const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  // useEffect(() => {
  //   (async () => {
  //     const supabase = createClient();
  //     const {
  //       data: { user },
  //       error,
  //     } = await supabase.auth.getUser();
  //     l(user === null);
  //     setUser(user);
  //   })();
  // }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { href: "", name: "Home" },
    { href: "materials", name: "Materials" },
    { href: "chat", name: "Chat" },
    { href: "settings", name: "Settings" },
    { href: "analytics", name: "Analytics" },
  ];

  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
    scale: <Scale className="text-warning" fill="currentColor" size={30} />,
    lock: <Lock className="text-success" fill="currentColor" size={30} />,
    activity: (
      <Activity className="text-secondary" fill="currentColor" size={30} />
    ),
    flash: <Flash className="text-primary" fill="currentColor" size={30} />,
    server: <Server className="text-success" fill="currentColor" size={30} />,
    user: <TagUser className="text-danger" fill="currentColor" size={30} />,
  };

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      isBordered
      isBlurred={true}
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
    >
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className="flex gap-2 justify-center items-center">
          <GraduationCap stroke="hsl(var(--primary))" />
          <Link href={"/"}>
            <h1 className="font-extrabold text-xl text-primary">
              SeniorSphere
            </h1>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:block w-full " justify="center">
        <Tabs
          aria-label="Options"
          color="primary"
          variant="underlined"
          selectedKey={
            pathname.substring(1) === ""
              ? "home"
              : pathname.includes("materials")
                ? "materials"
                : pathname.substring(1) === "chat"
                  ? "chat"
                  : null
          }
          classNames={{
            base: "w-full flex justify-center align-center",
            tabList: "gap-5 relative rounded-none p-0 flex items-stretch",
            cursor: "w-full bg-primary",
            tab: "max-w-fit p-0 h-fit",
            tabContent:
              "group-data-[selected=true]:text-primary h-[64px] flex justify-center items-stretch",
          }}
          isDisabled={user === null}
        >
          <Tab
            key="home"
            title={
              <Link href="/" className="flex justify-center items-center">
                <div className="flex items-center space-x-2">
                  <Home />
                  <NavbarItem>Home</NavbarItem>
                  <Chip size="sm" variant="faded">
                    9
                  </Chip>
                </div>
              </Link>
            }
          />
          <Tab
            key="materials"
            title={
              <Link
                href="/materials"
                className="flex justify-center items-center"
              >
                <div className="flex items-center space-x-2">
                  <BookMarked />
                  <NavbarItem>Materials</NavbarItem>
                  <Chip size="sm" variant="faded">
                    3
                  </Chip>
                </div>
              </Link>
            }
          />
          <Tab
            key="chat"
            title={
              <Link href="/chat" className="flex justify-center items-center">
                <div className="flex items-center space-x-2">
                  <MessageSquareMore />
                  <NavbarItem>Chat</NavbarItem>
                  <Chip size="sm" variant="faded">
                    1
                  </Chip>
                </div>
              </Link>
            }
          />
        </Tabs>
      </NavbarContent>

      <NavbarContent justify="end">
        {user === null ? (
          <Avatar
            icon={<AvatarIcon />}
            classNames={{
              base: "bg-gradient-to-br from-primary/50 to-primary",
              icon: "text-black/80",
            }}
            size="sm"
          />
        ) : (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={user.user_metadata.name}
                size="sm"
                src={user.user_metadata.avatar_url}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user?.email}</p>
              </DropdownItem>
              <DropdownItem key="settings" className="p-0">
                <Link href="/settings" className="block py-1.5 px-2 w-full">
                  Settings
                </Link>
              </DropdownItem>
              <DropdownItem key="analytics" className="p-0">
                <Link href="/analytics" className="block py-1.5 px-2 w-full">
                  Analytics
                </Link>
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem
            key={`${item}-${index}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
              }
              className={
                buttonVariants({ variant: "ghost" }) +
                "flex gap-2 w-full !justify-start !text-2xl"
              }
              href={`/${item.href}`}
            >
              <AddNoteIcon className={iconClasses} />
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default MyNavbar;
