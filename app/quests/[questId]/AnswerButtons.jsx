const AnswerButtons = ({ currentQuestion, handleAnswerClick }) => (
  <div className="my-4">
    <div className="flex flex-wrap justify-center gap-2">
      {currentQuestion &&
        currentQuestion.scrambledAnswer &&
        currentQuestion.scrambledAnswer.split("").map((answer, index) => (
          <button
            key={index}
            className="bg-black hover:bg-yellow-700 active:bg-yellow-900 text-white py-2 px-4 rounded-md text-lg uppercase"
            onClick={() => handleAnswerClick(answer)}>
            {answer}
          </button>
        ))}
    </div>
  </div>
);

export default AnswerButtons;
