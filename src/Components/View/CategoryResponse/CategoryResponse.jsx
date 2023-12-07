import React, { useState, useEffect } from "react";
import DraggableItem from "./DraggableItem";
import DroppableArea from "./DroppableArea";

const CategoryResponse = (props) => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(
      props.items.map((item, id) => ({ id, name: item.item, items: "" }))
    );
    setCategories(props.categories.map((items, id) => ({ id, name: items })));
  }, []);

  useEffect(() => {
    const update = {
      type: "categorize",
      items: items.map((area, id) => ({
        id: id,
        name: area.name,
        items: Array.isArray(area.items)
          ? area.items.filter((item, index, self) =>
              index === self.findIndex((t) => t.name === item.name)
            )
          : [],
      }))
      
      
    };
    props.onUpdateNote(update);
  }, [items]);

  
  const handleDropItem = (item, areaId) => {
    setItems((prevAreas) =>
      prevAreas.map((area) =>
        area.id === areaId ? { ...area, items: [...area.items, item] } : area
      )
    );
  };
  
  const handleRemoveItem = (removedItem, areaId) => {
    
    setItems((prevAreas) =>
      prevAreas.map((area) =>
        area.id === areaId
          ? {
              ...area,
              items: area.items.filter((item) => item.id !== removedItem.id),
            }
          : area
      )
    );
  };

  return (
    <div className="p-2 border rounded-md w-full border-l-4 border-indigo-500">
      <section className="question p-2 flex flex-col">
        <div className="flex pb-2">
          <span className="material-symbols-outlined">drag_indicator</span>
          <span>Question {props.index} </span>
        </div>
        <span className="p-2 border rounded-md ">{props.question} </span>
      </section>

      <section className="p-2">
        <div className="">
          <h4 className="p-2">Categories</h4>
          <div className="flex justify-center flex-wrap ">
            {categories.map((item) => (
              <DraggableItem
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
        <h4 className="p-2">Items</h4>
        <div className="flex sm:justify-center flex-wrap">
          {items.map((area) => (
            <div className="border text-center bg-[#5eead4] " key={area.id}>
              <h2>{area.name}</h2>

              <DroppableArea
                type="ITEM"
                areaId={area.id}
                onDropItem={(item) => handleDropItem(item, area.id)}
                onRemoveItem={(removedItem) =>
                  handleRemoveItem(removedItem, area.id)
                }
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategoryResponse;
