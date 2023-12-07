
import React from "react";
import { useDrag } from "react-dnd";

const DraggableItemCloze = ({ name, type, onDragEnd }) => {
  const [, drag] = useDrag({
    type: type,
    item: { name },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();

     
      if (!dropResult) {
        onDragEnd(item);
      }
    },
  });

  return (
    <div
      ref={drag}
      style={{
        cursor: "move",
      }}
      className="border bg-[#38bdf8] py-2 w-28 text-center rounded-full mx-2"
    >
      {name}
    </div>
  );
};

export default DraggableItemCloze;
