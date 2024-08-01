"use client";
import { useRouter } from "next/navigation";
import { MdClose } from "react-icons/md";

const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button onClick={handleBack}>
      <MdClose className="text-white text-3xl" />
    </button>
  );
};

export default BackButton;
