const QuestionImages = ({ currentQuestion }) => (
  <div className="grid grid-cols-2 gap-4">
    {currentQuestion &&
      ["img1", "img2", "img3", "img4"].map(
        (key, index) =>
          currentQuestion[key] && (
            <img
              key={index}
              loading="lazy"
              src={currentQuestion[key]}
              className="rounded-lg w-full h-32 object-cover hover:brightness-75 transition-all"
              alt={`question image ${index + 1}`}
            />
          )
      )}
  </div>
);

export default QuestionImages;
