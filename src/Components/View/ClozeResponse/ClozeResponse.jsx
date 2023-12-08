import React, { useState, useEffect } from "react";
import DraggableItemCloze from "./DraggableItemCloze";
import DraggableAreaCloze from "./DraggableAreaCloze";

const ClozeResponse = (props) => {
  useEffect(() => {
    setBlanks(
      props.options.map((item, id) => ({
        id,
        name: `blank${id + 1}`,
        items: "",
      }))
    );
    setOptions(props.options.map((items, id) => ({ id: id, name: items })));
  }, []);

  const [options, setOptions] = useState([]);
  const [blanks, setBlanks] = useState([]);
  useEffect(() => {
    const update = {
      type: "cloze",
      items: blanks.map((area, id) => ({
        id: id,
        name: area.name,
        items: area.items,
      })),
    };
    props.onUpdateNote(update);
  }, [blanks,options]);

  const handleDropItem = (item, areaIndex) => {
    setBlanks((prevBlanks) =>
      prevBlanks.map((blank, index) =>
        index === areaIndex - 1 ? { ...blank, items: item.name } : blank
      )
    );
  };

  const handleRemoveItem = (areaIndex) => {
    
    setBlanks((prevBlanks) =>
      prevBlanks.map((blank, index) =>
        index === areaIndex - 1 ? { ...blank, items: "" } : blank
      )
    );
  };

  
  const sentence = props.preview;
  const blankSpaces = sentence.split("___");

  
  return (
    <div className="p-2 border rounded-md w-full border-l-4 border-indigo-500">
      <section className="question p-2">
        <div className="flex pb-2">
          <span className="material-symbols-outlined">drag_indicator</span>
          <span>Question {props.index} </span>
        </div>
        <h4 className="p-2 border rounded-md">Fill in the blanks</h4>
      </section>
      <section className="p-2">
        <div className="">
          <h4 className="p-2">Options</h4>
          <div className="flex justify-center">
            {options.map((item) => (
              <DraggableItemCloze
                key={item.id}
                name={item.name}
                type="ITEM"
                onDragEnd={() => handleDropItem(item, 0)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="p-2 ">
        <div className="flex sm:justify-center items-center flex-wrap">
          {blankSpaces.map((part, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <div
                  className=" w-36 flex flex-col justify-center items-center border rounded bg-[#fcd34d]"
                  key={`area-${index}`}
                >
                  <h2>Blank {index}</h2>
                  <DraggableAreaCloze
                    type="ITEM"
                    areaId={index}
                    onDropItem={(item) => handleDropItem(item, index)}
                    onRemoveItem={() => handleRemoveItem(index)}
                  />
                </div>
              )}
              <span className="mx-2">{part}</span>
            </React.Fragment>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ClozeResponse;
