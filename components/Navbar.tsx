"use client";

import { type User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import { FunctionSquare, Menu, Settings } from "lucide-react";
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
  Button,
  Avatar,
} from "@nextui-org/react";
import {
  ChevronDown,
  Lock,
  Activity,
  Flash,
  Server,
  TagUser,
  Scale,
} from "./Icons";
import { useEffect, useState } from "react";
import Link from "next/link";

const MyNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      setUser(data?.user);
    })();
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const menuItems = ["Home", "Materials", "Chat", "Settings", "Analytics"];

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
      isBordered
      isBlurred={true}
      // className="!max-w-7xl mx-auto"
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
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className="flex gap-2 justify-center items-center">
          <FunctionSquare stroke="hsl(var(--primary))" />
          <h1 className="font-extrabold text-xl text-primary">SeniorSphere</h1>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={pathname == "/"}>
          <Link href="/">Home</Link>
        </NavbarItem>
        <NavbarItem isActive={pathname == "/materials"}>
          <Link href="/materials">Materials</Link>
        </NavbarItem>
        <NavbarItem isActive={pathname == "/chat"}>
          <Link href="/chat">Chat</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <Dropdown placement="bottom-end" className="text-blue-500">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold text-blue-500">Signed in as</p>
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
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
              }
              className="w-full"
              href="#"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default MyNavbar;
