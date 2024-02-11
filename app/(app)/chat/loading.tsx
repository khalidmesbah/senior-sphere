import { CircularProgress } from "@nextui-org/react";

export default function App() {
  return (
    <div className="inset-0 absolute flex justify-center items-center">
      <CircularProgress label="Loading..." size="lg" />
    </div>
  );
}
