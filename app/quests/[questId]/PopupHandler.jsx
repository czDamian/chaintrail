import { Success, Wrong, Complete } from "@/app/components/Reusable/Popup";

const PopupHandler = ({
  showPopup,
  isCompleted,
  showComplete,
  isCorrect,
  points,
  playPass,
}) => {
  if (!showPopup) return null;

  if (isCompleted && showComplete) {
    return <Complete points={points} playPass={playPass} />;
  } else if (isCorrect) {
    return <Success />;
  } else {
    return <Wrong />;
  }
};

export default PopupHandler;
