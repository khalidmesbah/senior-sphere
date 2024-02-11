"use client";

import { deleteUser } from "@/lib/supabase/actions";
import { Button } from "@nextui-org/react";
import { UserIcon } from "lucide-react";
import React from "react";

const DeleteButton = ({ user_id }: { user_id: string }) => {
  return (
    <Button
      color="danger"
      variant="bordered"
      startContent={<UserIcon />}
      onClick={() => deleteUser(user_id)}
    >
      Delete user
    </Button>
  );
};

export default DeleteButton;
