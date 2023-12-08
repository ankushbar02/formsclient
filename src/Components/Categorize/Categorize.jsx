import React, { useEffect, useRef, useState } from "react";

export default function Categorize(props) {
  const [note, setNote] = useState("");
  const textareaRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [item, setItem] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");

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

  useEffect(() => {
    setCategories(props.categories);
    setItem(props.items);
    setNote(props.question);
  }, []);

  useEffect(() => {
    const updatedCategorizeData = {
      type: "category",
      categories: categories,
      item: item,
      question: note,
    };

    if (newItem) {
      updatedCategorizeData.item = [...updatedCategorizeData.item, newItem];
    }

    if (newCategory) {
      updatedCategorizeData.categories = [
        ...updatedCategorizeData.categories,
        newCategory,
      ];
    }

    props.onUpdateNote(updatedCategorizeData);
  }, [categories, item, note, newItem, newCategory]);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleSortCategory = () => {
    let _category = [...categories];
    const draggedItemContent = _category.splice(dragItem.current, 1)[0];
    _category.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setCategories(_category);
  };

  const handleSortItem = () => {
    let _item = [...item];
    const draggedItemContent = _item.splice(dragItem.current, 1)[0];
    _item.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setItem(_item);
  };

  const handleAdd = (type) => {
    if (type === "cat") {
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      setNewCategory("");
    }
  };

  const handleAddItem = () => {
    const newItemObj = { item: newItem, category: newItemCategory };
    setItem([...item, newItemObj]);
    setNewItem("");
    setNewItemCategory("");
  };

  return (
    <>
      <div className="p-5 border rounded-md w-full border-l-4 border-indigo-500">
        <section className="question p-2">
          <div className="flex pb-2">
            <span className="material-symbols-outlined">drag_indicator</span>
            <span>Question {props.index}</span>
          </div>

          <textarea
            placeholder="Description (optional)"
            ref={textareaRef}
            style={defaultStyle}
            id="description"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </section>
        <section className="p-2">
          <div className="flex justify-between">
            <h4 className="p-2">Categories</h4>
          </div>
          {categories.map((ele, id) => (
            <div
              key={id}
              className="flex p-1 "
              draggable
              onDragStart={(e) => (dragItem.current = id)}
              onDragEnter={(e) => (dragOverItem.current = id)}
              onDragEnd={handleSortCategory}
              onDragOver={(e) => e.preventDefault()}
            >
              <span className="material-symbols-outlined cursor-move">drag_indicator</span>
              <input
                placeholder="New Category"
                value={ele}
                onChange={(e) => {
                  const updatedCategories = [...categories];
                  updatedCategories[id] = e.target.value;
                  setCategories(updatedCategories);
                }}
                className="border rounded w-48"
              />
              <span
                onClick={() => {
                  const updatedItems = categories.filter(
                    (i, num) => num !== id
                  );
                  setCategories(updatedItems);
                }}
                className="material-symbols-outlined"
              >
                close
              </span>
            </div>
          ))}

          <div className="flex p-1">
            <span className="material-symbols-outlined ">drag_indicator</span>
            <input
              placeholder="New Category"
              type="text"
              className="border rounded w-48"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <span
              onClick={() => handleAdd("cat")}
              className="material-symbols-outlined "
            >
              add
            </span>
          </div>
        </section>

        <section className="p-2">
          <h4 className="p-2">Items</h4>

          {item &&
            item.map((currentItem, id) => (
              <div
                key={id}
                className="flex flex-wrap  p-1 "
                draggable
                onDragStart={(e) => (dragItem.current = id)}
                onDragEnter={(e) => (dragOverItem.current = id)}
                onDragEnd={handleSortItem}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="flex">
                  <span className="material-symbols-outlined cursor-move">
                    drag_indicator
                  </span>
                  <input
                    placeholder="New item"
                    value={currentItem.item}
                    onChange={(e) => {
                      const updatedItems = item.map((i, num) =>
                        num === id ? { ...i, item: e.target.value } : i
                      );
                      setItem(updatedItems);
                    }}
                    className="border rounded w-full w-48"
                  />
                  <span
                    onClick={() => {
                      const updatedItems = item.filter((i, num) => num !== id);
                      setItem(updatedItems);
                    }}
                    className="material-symbols-outlined"
                  >
                    close
                  </span>
                </div>

                <select
                  name="category"
                  className="w-48 mx-6 sm:max-sm:mx-2    border rounded"
                  value={currentItem.category}
                  onChange={(e) => {
                    const updatedItems = item.map((i, num) =>
                      num === id ? { ...i, category: e.target.value } : i
                    );
                    setItem(updatedItems);
                  }}
                >
                  {categories.map((category, id) => (
                    <option key={id} className="w-48">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            ))}

          <div className="flex p-1  flex-wrap">
            <div className="flex">
              <span className="material-symbols-outlined">drag_indicator</span>
              <input
                placeholder="New item"
                value={newItem}
                onChange={(e) => {
                  setNewItem(e.target.value);
                }}
                className="border rounded w-48"
              />
            </div>

            <div className="flex ">
              <select
                name="category"
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="w-48 mx-6 sm:max-sm:mx-2  border rounded"
              >
                <option value="">Belongs to</option>
                {categories.map((category, id) => (
                  <option key={id} className="w-48">
                    {category}
                  </option>
                ))}
              </select>
              <span
                onClick={handleAddItem}
                className="material-symbols-outlined"
              >
                add
              </span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
