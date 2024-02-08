import { CircularProgress } from "@nextui-org/react";

export default function App() {
  return (
    <div className="bg-red-500 w-full h-full flex justify-center items-center">
      <CircularProgress label="Loading..." size="lg" />
    </div>
  );
}
