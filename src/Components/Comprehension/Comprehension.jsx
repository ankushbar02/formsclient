import React, { useEffect, useRef, useState } from "react";

export default function Comprehension(props) {
  const [passage, setPassage] = useState("");
  const [questions, setQuestions] = useState([{ question: "", options: [""] }]);
  const passageTextareaRef = useRef(null);
  const questionTextareaRefs = useRef([]);

  const defaultStyle = {
    display: "block",
    overflow: "hidden",
    resize: "none",
    width: "100%",
    backgroundColor: "white",
    color: "black",
    borderRadius: "10px",
    padding: "10px",
    border: "1px solid grey",
  };

  useEffect(() => {
    props.onUpdateNote({
      type: "comprehension",
      passage: passage,
      mcq: questions,
    });
  }, [passage, questions]);

  useEffect(() => {
   setPassage(props.passage);
    setQuestions(props.mcq);
  }, []);

  useEffect(() => {
    if (passageTextareaRef.current) {
      passageTextareaRef.current.style.height = "0px";
      const scrollHeight = passageTextareaRef.current.scrollHeight;
      passageTextareaRef.current.style.height = scrollHeight + "px";
    }
  }, [passage]);

  useEffect(() => {
    questionTextareaRefs.current.forEach((textareaRef) => {
      if (textareaRef) {
        textareaRef.style.height = "0px";
        const scrollHeight = textareaRef.scrollHeight;
        textareaRef.style.height = scrollHeight + "px";
      }
    });
  }, [questions]);

  const handleAdd = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        question: "",
        options: [""],
      },
    ]);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push("");
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (questionIndex) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((question, index) => index !== questionIndex)
    );
  };

  
  const dragItemOption = useRef(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const handleSortOptions = (questionIndex, optionIndex, e) => {
    e.preventDefault();

    setQuestions((prevQuestions) => {
      if (
        dragItemOption.current === null ||
        questionIndex < 0 ||
        questionIndex >= prevQuestions.length ||
        dragItemOption.current < 0 ||
        dragItemOption.current >= prevQuestions[questionIndex]?.options?.length
      ) {
        console.error(
          "Invalid indices:",
          dragItemOption.current,
          questionIndex
        );
        return prevQuestions;
      }

      const updatedQuestions = [...prevQuestions];
      const updatedOptions = [
        ...(updatedQuestions[questionIndex]?.options || []),
      ];

      const [removed] = updatedOptions.splice(dragItemOption.current, 1);
      updatedOptions.splice(optionIndex, 0, removed);
      updatedQuestions[questionIndex].options = updatedOptions;

      
      dragItemOption.current = null;

      return updatedQuestions;
    });
  };

  
  const handleSortQuestions = () => {
    let _options = [...questions];
    const draggedItemContent = _options.splice(dragItem.current, 1)[0];
    _options.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setQuestions(_options);
  };

  return (
    <div className="p-5 border rounded-md w-full border-l-4 border-indigo-500">
      <section className="question p-2">
        <div className="flex pb-2">
          <span className="material-symbols-outlined">drag_indicator</span>
          <span>Question {props.index}</span>
        </div>
      </section>
      <textarea
        placeholder="Passage*"
        ref={passageTextareaRef}
        style={defaultStyle}
        id="passage"
        value={passage}
        onChange={(e) => {
          setPassage(e.target.value);
        }}
        className="mb-4"
      />
      <span className="px-2">MCQ</span>
      {questions.map((mcq, questionIndex) => (
        <div
          key={questionIndex}
          className="p-5 border rounded-md w-full "
          draggable
          onDragStart={(e) => (dragItem.current = questionIndex)}
          onDragEnter={(e) => (dragOverItem.current = questionIndex)}
          onDragEnd={handleSortQuestions}
          onDragOver={(e) => e.preventDefault()}
        >
          <section className="question p-2">
            <div className="flex justify-between pb-2">
              <div className="flex cursor-move">
                <span className="material-symbols-outlined">
                  drag_indicator
                </span>
                <span>{`Question ${props.index}.${questionIndex + 1}`}</span>
              </div>
              <span
                onClick={() => handleRemoveQuestion(questionIndex)}
                className="material-symbols-outlined border rounded-full mx-1"
              >
                close
              </span>
            </div>
          </section>
          <textarea
            placeholder="Question*"
            ref={(el) => (questionTextareaRefs.current[questionIndex] = el)}
            style={defaultStyle}
            id={`question_${questionIndex}`}
            value={mcq.question}
            onChange={(e) => {
              const updatedQuestions = [...questions];
              updatedQuestions[questionIndex].question = e.target.value;
              setQuestions(updatedQuestions);
            }}
            className="mb-4"
          />
          <section className="p-2">
            <div className="flex justify-between">
              <h4 className="p-2">Options</h4>
            </div>
            {mcq.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className="flex p-1 cursor-move"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    "questionIndex",
                    questionIndex.toString()
                  );
                  e.dataTransfer.setData("optionIndex", optionIndex.toString());
                  dragItemOption.current = optionIndex;
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleSortOptions(questionIndex, optionIndex, e)}
              >
                <span className="material-symbols-outlined">
                  drag_indicator
                </span>
                <input
                  placeholder="Option"
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(
                      questionIndex,
                      optionIndex,
                      e.target.value
                    )
                  }
                  className="border rounded w-48"
                />
                <span
                  onClick={() => handleRemoveOption(questionIndex, optionIndex)}
                  className="material-symbols-outlined"
                >
                  close
                </span>
              </div>
            ))}

            <div className="flex p-1">
              <span
                onClick={() => handleAddOption(questionIndex)}
                className="material-symbols-outlined "
              >
                add
              </span>
            </div>
          </section>
        </div>
      ))}

      <div className="flex p-1">
        <span
          onClick={handleAdd}
          className="material-symbols-outlined border rounded-full p-1 "
        >
          add
        </span>
      </div>
    </div>
  );
}
