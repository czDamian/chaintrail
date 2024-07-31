import { useState } from "react";
import Popup from "../HomePage/Popup";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";
import Button from "../Reusable/Button";

export default function Profile() {
  const { userInfo, isLoading } = useTelegramAuth();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  if (isLoading){
    return (
      <>
        <div
          onClick={openPopup}
          className="animate-bounce-in-down focus:outline-none">
          <Button className="bg-black hover:scale-105 text-xs">CONNECT</Button>
        </div>
        <Popup isOpen={isPopupOpen} onClose={closePopup} />
      </>
    );
  }

  if (!userInfo) {
    return (
      <>
        <div
          onClick={openPopup}
          className="animate-bounce-in-down focus:outline-none">
          <Button className="border border-white bg-black hover:border-gold-500 text-xs">
            CONNECT
          </Button>
        </div>
        <Popup isOpen={isPopupOpen} onClose={closePopup} />
      </>
    );
  }

  return (
    <div className="text-xs">
      <p>Hi, {userInfo.username || userInfo.first_name}!</p>
      <Popup isOpen={isPopupOpen} onClose={closePopup} />
    </div>
  );
}
