import { Success, Wrong, Complete } from "@/app/components/Reusable/Popup";

const PopupHandler = ({ showPopup, isCompleted, showComplete, isCorrect }) => {
  if (!showPopup) return null;

  if (isCompleted && showComplete) {
    return <Complete />;
  } else if (isCorrect) {
    return <Success />;
  } else {
    return <Wrong />;
  }
};

export default PopupHandler;
