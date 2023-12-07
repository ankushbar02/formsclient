
import React, { useState, useEffect, useRef } from "react";
import Categorize from "./Categorize/Categorize";
import Cloze from "./Cloze/Cloze";
import Comprehension from "./Comprehension/Comprehension";
import { useNavigate, useParams } from "react-router-dom";
import { getFormData } from "./api"; 

export default function Form() {
  const navigate = useNavigate();
  const { formId } = useParams();
  const [note, setNote] = useState("");
  const textareaRef = useRef(null);
  const [formData, setFormData] = useState([]);
  const [formTypes, setFormTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("category");
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const cookieToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        setToken(cookieToken);
        if (!cookieToken) {
          navigate("/");
          return;
        }

        const fetchedFormData = await getFormData(formId, cookieToken);
        if (fetchedFormData) {
          setNote(fetchedFormData.title);
          setFormData(fetchedFormData.formData);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    formId && fetchFormData();
  }, [formId, navigate]);

  const updateFormData = (index, newData, formType) => {
    setFormData((prevFormData) => {
      const updatedData = [...prevFormData];
      updatedData[index].preview = newData.preview;
      updatedData[index].question = newData.question;
      updatedData[index].type = newData.type;
      updatedData[index].options = newData.options;
      updatedData[index].categories = newData.categories;
      updatedData[index].item = newData.item;
      updatedData[index].mcq = newData.mcq;
      updatedData[index].passage = newData.passage;

      const formTypeIndex = formTypes.indexOf(formType);
      if (formTypeIndex !== -1) {
        updatedData[index].type = formType;
        setFormTypes((prevFormTypes) => {
          const updatedFormTypes = [...prevFormTypes];
          updatedFormTypes[formTypeIndex] = formType;
          return updatedFormTypes;
        });
      }

      return updatedData;
    });
  };

  const removeFormItem = (index) => {
    setFormData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const addNewFormItem = () => {
    let defaultFormItem;
    if (selectedType === "category") {
      defaultFormItem = {
        type: selectedType,
        categories: [],
        item: [],
        question: "",
      };
    } else if (selectedType === "cloze") {
      defaultFormItem = {
        type: selectedType,
        preview: "",
        options: [],
        question: "",
      };
    } else if (selectedType === "comprehension") {
      defaultFormItem = {
        type: selectedType,
        passage: "",
        mcq: [],
      };
    }
   
    setFormData((prevFormData) => [...prevFormData, defaultFormItem]);
    
  };

  

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const endpoint = formId ? `/updateFormData/${formId}` : "/addFormData";
      const cookieToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      const response = await fetch(`http://localhost:4000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookieToken}`,
        },
        body: JSON.stringify({ formData, title: note }),
      });

      if (response.ok) {
        const result = await response.json();
        navigate("/forms");
      } else {
        console.error("Request failed");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };
  
  const renderFormItem = (formItem, index) => {
    switch (formItem.type) {
      case "category":
        return (
          <Categorize
            key={index}
            index={index + 1}
            categories={formItem.categories}
            items={formItem.item}
            question={formItem.question}
            onUpdateNote={(newData) =>
              updateFormData(index, newData, "categorize")
            }
          />
        );
      case "cloze":
        return (
          <Cloze
            key={index}
            index={index + 1}
            preview={formItem.preview}
            question={formItem.question}
            options={formItem.options}
            onUpdateNote={(newData) => updateFormData(index, newData, "cloze")}
          />
        );
      case "comprehension":
        return (
          <Comprehension
            key={index}
            index={index + 1}
            passage={formItem.passage}
            mcq={formItem.mcq}
            onUpdateNote={(newData) =>
              updateFormData(index, newData, "comprehension")
            }
          />
        );
      default:
        return null;
    }
  };

 

  return (
    <div className="p-5 flex flex-col justify-center items-center ">
      <div className="flex fixed bottom-36 right-10">
        <select
          className="border"
          value={selectedType }
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="category">Select Form Type</option>
          <option value="category">Categorize</option>
          <option value="cloze">Cloze</option>
          <option value="comprehension">Comprehension</option>
        </select>
        <button
          className="material-symbols-outlined border rounded-full mx-2"
          onClick={addNewFormItem}
        >
          Add
        </button>
      </div>

      <div className="w-full lg:w-4/6">
        <h1 className="my-2">{note ? note : "Title"}</h1>
        <textarea
          className="mb-5"
          placeholder="Description (optional)"
          ref={textareaRef}
          style={{
            display: "block",
            overflow: "hidden",
            resize: "none",
            width: "100%",
            backgroundColor: "white",
            color: "black",
            borderRadius: "10px",
            padding: "10px",
            border: "1px solid grey",
          }}
          id="description"
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
          }}
        />
      </div>

      <div className="w-full lg:w-4/6">
        {formData.map((formItem, index) => (
          <div className="flex" key={index}>
            {renderFormItem(formItem, index)}
            <div>
              <button
                className="material-symbols-outlined border rounded-full"
                onClick={() => removeFormItem(index)}
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
      <button type="submit" onClick={submitForm} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 m-5">
        Submit
      </button>
    </div>
  );
}
