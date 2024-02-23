export interface ActionResponse {
  status: "description" | "success" | "info" | "warning" | "error";
  message: string;
}
