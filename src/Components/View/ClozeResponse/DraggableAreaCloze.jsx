// DroppableAreaCloze.js
import React, { useState } from "react";
import { useDrop } from "react-dnd";

const DroppableAreaCloze = ({ type, areaId, onDropItem, onRemoveItem }) => {
  const [droppedItem, setDroppedItem] = useState(null);

  const [, drop] = useDrop({
    accept: type,
    drop: (item) => {
      setDroppedItem(item);

      onDropItem(item, areaId);
    },
  });

  const removeItem = () => {
    setDroppedItem(null);

    onRemoveItem(areaId);
  };
 
  return (
    <div
      ref={drop}
      className=" h-12 w-full flex flex-col items-center justify-center object-fill  rounded "
    >
      {droppedItem && (
        <div
          onDragEnd={removeItem}
          style={{
            cursor: "move",
          }}
          className="border  bg-[#8b5cf6] px-2 text-center rounded-full p-1 "
        >
          <div className="flex justify-center">
            <p className=" ">{droppedItem.name} </p>
            
              <span onClick={removeItem} className="material-symbols-outlined ">
                close
              </span>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default DroppableAreaCloze;
