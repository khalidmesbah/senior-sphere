import { ActionResponse } from "@/lib/types/custom.type";
import { toast } from "sonner";

export const handleActionResponse = ({ status, message }: ActionResponse) => {
  if (status === "error") toast.error(message);
  else if (status === "success") toast.success(message);
  else if (status === "info") toast.info(message);
  else if (status === "warning") toast.warning(message);
  else if (status === "description") toast.message(message);
  else toast(message);
};
