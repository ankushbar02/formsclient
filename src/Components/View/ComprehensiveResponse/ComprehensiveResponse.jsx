import React, { useState, useEffect } from "react";

const ComprehensiveResponse = (props) => {
  const [mcq, setMcq] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    setMcq(props.mcq);
  }, []);
  

useEffect(() => {
 const response={
  type:"comprehension",
  items:selectedOptions
 }
 props.onUpdateNote(response)
}, [selectedOptions])



  const handleOptionChange = (questionIndex, option) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [questionIndex]: option,
    }));
  };

  return (
    <div>
      <div className="p-2 border rounded-md w-full border-l-4 border-indigo-500">
        <section className="question p-2">
          <div className="flex pb-2">
            <span className="material-symbols-outlined">drag_indicator</span>
            <span>Question {props.index}</span>
          </div>

          <span>Passage</span>
          <p className="rounded-md w-full border p-2">{props.passage}</p>
        </section>
        {mcq.map((q, questionIndex) => (
          <div
            key={questionIndex}
            className="p-5 border rounded-md w-full border-l-4 border-indigo-500"
          >
            <section className="question p-2">
              <div className="flex pb-2">
                <span className="material-symbols-outlined">
                  drag_indicator
                </span>
                <span>
                  Question {props.index}.{questionIndex + 1}
                </span>
              </div>

              <p className="rounded-md w-full border p-2">{q.question}</p>
            </section>

            <section className="options p-2">
              <h4 className="p-2">Options:</h4>
              {q.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center">
                  <input
                    type="radio"
                    id={`option${props.index}.${questionIndex}.${optionIndex}`}
                    name={`mcqOptions${props.index}.${questionIndex}`}
                    value={option}
                    checked={selectedOptions[questionIndex] === option}
                    onChange={() => handleOptionChange(questionIndex, option)}
                  />
                  <label
                    htmlFor={`option${props.index}.${questionIndex}.${optionIndex}`}
                    className="ml-2"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </section>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComprehensiveResponse;
