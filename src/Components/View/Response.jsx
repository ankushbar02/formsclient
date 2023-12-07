import React, { useEffect, useState, useRef } from "react";
import CategoryResponse from "./CategoryResponse/CategoryResponse";
import ClozeResponse from "./ClozeResponse/ClozeResponse";
import ComprehensiveResponse from "./ComprehensiveResponse/ComprehensiveResponse";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate, useParams } from "react-router-dom";
export default function Response() {
  const navigate = useNavigate();
  const { formId } = useParams();

  const [formData, setFormData] = useState([]);
  const [note, setnote] = useState("");
  const [title, setTitle] = useState("");
  const [responseData, setResponseData] = useState([]);

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

  useEffect(() => {
   
    const fetchForms = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}response/getForms/${formId}`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
          const formsData = await response.json();

          setFormData(formsData.formData);
          setTitle(formsData.title);
        } else {
          // Handle the error response if needed
          console.error("Request failed");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchForms();
  }, []);
  // console.log(note);
  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}addFormResponse/${formId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ responseData: responseData, name: note }),
        }
      );

      if (response.ok) {
        
        navigate("/submitted");
      } else {
        console.error("Request failed");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  const addResponseData = (index, newData, formType) => {
    setResponseData((prevResponse) => {
      const updatedResponse = [...prevResponse];
      updatedResponse[index] = { type: formType, items: newData.items };
      return updatedResponse;
    });
  };
  const renderFormItem = (formItem, index) => {
    switch (formItem.type) {
      case "category":
        return (
          <CategoryResponse
            key={index}
            index={index + 1}
            categories={formItem.categories}
            items={formItem.item}
            question={formItem.question}
            onUpdateNote={(newData) =>
              addResponseData(index, newData, "categorize")
            }
          />
        );
      case "cloze":
        return (
          <ClozeResponse
            key={index}
            index={index + 1}
            preview={formItem.preview}
            question={formItem.question}
            options={formItem.options}
            onUpdateNote={(newData) => addResponseData(index, newData, "cloze")}
          />
        );
      case "comprehension":
        return (
          <ComprehensiveResponse
            key={index}
            index={index + 1}
            passage={formItem.passage}
            mcq={formItem.mcq}
            onUpdateNote={(newData) =>
              addResponseData(index, newData, "comprehension")
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-2 flex flex-col justify-center items-center  ">
      <div className="p-2 border rounded-md w-full border-l-4 border-indigo-500 lg:w-4/6">
        <section className="question p-2">
          <div className="flex pb-2">
            <span className="material-symbols-outlined">drag_indicator</span>
            <span>{title} </span>
          </div>
          <h4 className="p-2 mb-2 border rounded-md">Enter your name</h4>
          <textarea
            placeholder="Name"
            ref={textareaRef}
            style={defaultStyle}
            id="description"
            value={note}
            onChange={(e) => {
              setnote(e.target.value);
            }}
            className="mb-4"
          />
        </section>
      </div>
      {formData.map((formItem, index) => (
        <div className="w-full lg:w-4/6 " key={index}>
          <DndProvider backend={HTML5Backend}>
            <div className=""> {renderFormItem(formItem, index)}</div>
          </DndProvider>
        </div>
      ))}
       <button type="submit" onClick={submitForm} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 m-5">
        Submit
      </button>
    </div>
  );
}
