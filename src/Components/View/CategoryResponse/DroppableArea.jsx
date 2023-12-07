import React, { useState } from "react";
import { useDrop } from "react-dnd";

const DroppableArea = ({ type, areaId, onDropItem, onRemoveItem }) => {
  const [droppedItems, setDroppedItems] = useState([]);

  const [, drop] = useDrop({
    accept: type,
    drop: (item, monitor) => {
      const newItem = { id: Date.now(), name: item.name };

      setDroppedItems((prevItems) => [...prevItems, newItem]);

      onDropItem(newItem, areaId);
    },
  });

  const removeItem = (itemId) => {
    const index = droppedItems.findIndex((item) => item.id === itemId);

    if (index !== -1) {
      const updatedItems = [
        ...droppedItems.slice(0, index),
        ...droppedItems.slice(index + 1),
      ];

      setDroppedItems(updatedItems);

      onRemoveItem(droppedItems[index], areaId);
    }
  };

  return (
    <div
      ref={drop}
      style={{
        
       
       
        minWidth:"100px",
        width: "fit-content",
        minHeight:"60px",
        height: "max-content",
      }}
    >
      {droppedItems.map((item) => (
        <div
          key={item.id}
          onDragEnd={() => removeItem(item.id)}
          style={{
            cursor: "move",
          }}
          className="border bg-[#8b5cf6] py-2  text-center rounded-full  m-2"
       
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default DroppableArea;