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
      className="w-28 h-12  mx-2 flex flex-col items-center justify-center object-fill  rounded "
    >
      {droppedItem && (
        <div
          onDragEnd={removeItem}
          style={{
            cursor: "move",
          }}
          className="border bg-[#8b5cf6] px-2 text-center rounded-full mx-2"
        >
         <p className="m-2 p-0">{droppedItem.name} </p>
        
        </div>
      )}
    </div>
  );
};

export default DroppableAreaCloze;
