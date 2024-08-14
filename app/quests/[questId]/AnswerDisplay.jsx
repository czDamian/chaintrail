const AnswerDisplay = ({ currentQuestion, selectedAnswers }) => (
  <div className="text-white py-4 flex justify-center">
    <div className="flex max-w-[300px] flex-wrap items-center gap-2">
      {currentQuestion &&
        currentQuestion.questAnswer &&
        currentQuestion.questAnswer.length > 0 &&
        Array.from({ length: currentQuestion.questAnswer.length }).map(
          (_, index) => (
            <span
              key={index}
              className="w-8 h-10 bg-gray-700 rounded mx-1 flex items-center justify-center text-lg uppercase">
              {selectedAnswers[index] || ""}
            </span>
          )
        )}
    </div>
  </div>
);

export default AnswerDisplay;
