import React, { useState } from "react";
import { useDrop } from "react-dnd";

const DroppableArea = ({ type, areaId, onDropItem, onRemoveItem }) => {
  const [droppedItems, setDroppedItems] = useState([]);

  const [, drop] = useDrop({
    accept: type,
    drop: (item, monitor) => {
      const newItem = { id: Date.now(), name: item.name };

      const isDuplicate = droppedItems.some(
        (existingItem) => existingItem.name === newItem.name
      );

      if (!isDuplicate) {
        setDroppedItems((prevItems) => [...prevItems, newItem]);
        onDropItem(newItem, areaId);
      }
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
        minHeight: "100px",
        height: "max-content",
      }}
      className="px-3 flex flex-col items-center justify-center"
    >
      {droppedItems.map((item) => (
        <div
          key={item.id}
          onDragEnd={() => removeItem(item.id)}
          style={{
            cursor: "move",
          }}
          className="border w-36 h-10 flex justify-around items-center p-2 bg-[#8b5cf6] py-1  text-center rounded-full  m-2"
        >
          <div>{item.name}</div>
          {
            <span
              onClick={() => removeItem(item.id)}
              className="material-symbols-outlined"
            >
              close
            </span>
          }
        </div>
      ))}
    </div>
  );
};

export default DroppableArea;
