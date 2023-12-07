import React, { useEffect, useRef, useState } from "react";

export default function Cloze(props) {
  const [note, setnote] = useState("");
  const [preview, setPreview] = useState("");
  const [options, setOptions] = useState([]);
  const [clozeData, setClozeData] = useState({
    type: "cloze",
    preview: "",
    question: "",
    options: [""],
  });

  useEffect(() => {
    const updatedClozeData = {
      type: "cloze",
      preview: preview,
      question: note,
      options: options,
    };

    props.onUpdateNote(updatedClozeData);
  }, [options, note, preview]);

  useEffect(() => {
    setOptions(props.options);
    setPreview(props.preview);
    setnote(props.question);
  }, []);

  const textareaRef = useRef(null);
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
    textareaRef.current.style.height = "0px";
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = scrollHeight + "px";
  }, [note]);

  const handleSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().replace(/\s/g, "");

    if (selectedText !== "") {
      const wordsArray = preview.split(" ");
      const newArray = wordsArray.map((element) =>
        element === selectedText ? "___" : element
      );
      setPreview(newArray.join(" "));
      setOptions((prev) => [...prev, selectedText]);
    }
  };

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleSortOptions = () => {
    let _options = [...options];
    const draggedItemContent = _options.splice(dragItem.current, 1)[0];
    _options.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setOptions(_options);
  };

  return (
    <div className=" p-5  border rounded-md w-full  border-l-4 border-indigo-500">
      <section className="question p-2">
        <div className="flex pb-2">
          <span className="material-symbols-outlined">drag_indicator</span>
          <span>Question {props.index}</span>
        </div>
        <div className="flex justify-between flex-wrap">
          <span>Preview</span>
          <span className="text-xs">
            <span class="material-symbols-outlined text-xs">help</span>Double
            click on the word to create options{" "}
          </span>
        </div>

        <p className="rounded-md w-full border p-2">{preview}</p>
      </section>
      <textarea
        placeholder="Description (optional)"
        ref={textareaRef}
        style={defaultStyle}
        id="description"
        value={note}
        onChange={(e) => {
          setnote(e.target.value);
          setPreview(e.target.value);
        }}
        onMouseUp={handleSelection}
        className="mb-4"
      />

      {options &&
        options.map((ele, id) => (
          <div
            key={id}
            className="flex mb-2"
            draggable
            onDragStart={(e) => (dragItem.current = id)}
            onDragEnter={(e) => (dragOverItem.current = id)}
            onDragEnd={handleSortOptions}
            onDragOver={(e) => e.preventDefault()}
          >
            <span className="material-symbols-outlined">drag_indicator</span>
            <p className="border px-1  rounded w-48">{ele}</p>{" "}
            <span
              onClick={() => {
                const updatedItems = options.filter((i, num) => num !== id);
                setOptions(updatedItems);
              }}
              typeof="button"
              className="material-symbols-outlined"
            >
              close
            </span>
          </div>
        ))}
    </div>
  );
}
