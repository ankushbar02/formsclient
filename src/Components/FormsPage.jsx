
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const FormsPage = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [token, setToken] = useState("");

  useEffect(() => {
   
    const fetchForms = async () => {
      try {
        const cookieToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        setToken(cookieToken);

        if (!cookieToken) {
       
          console.error("User not authenticated");
          navigate("/");
          return;
        }

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}getForms`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookieToken}`,
          },
        });

        if (response.ok) {
          const formsData = await response.json();
          setForms(formsData.forms);
        } else {
        
          console.error("Request failed");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchForms();
  }, []);

  const deleteForm = async (index) => {
    try {
      const cookieToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      setToken(cookieToken);

      if (!cookieToken) {
        // Handle the case where the user is not authenticated
        console.error("User not authenticated");
        navigate("/login");
        return;
      }
      const deletedItemId = forms[index]._id;

      // Send a DELETE request to delete the form item
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}deleteFormData/${deletedItemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${cookieToken}`,
          },
        }
      );

      if (response.ok) {
        // If the deletion is successful, update the state
        setForms((prevData) => prevData.filter((_, i) => i !== index));
      } else {
        console.error("Deletion failed");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };
  const handleCopyLink = (url) => {
    const currentURL = `${process.env.REACT_APP_FRONTEND_URL}response/${url}`;

    navigator.clipboard
      .writeText(currentURL)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Unable to copy to clipboard", err);
      });
  };
  const handleCreateForm = () => {
    // Redirect to the form creation page
    navigate("/form/");
  };

  return (
    <div className="p-5">
      <div className="flex  justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-5">Your Forms</h1>
          <button
            onClick={handleCreateForm}
            className="bg-green-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-green-600"
          >
            Create New Form
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              document.cookie =
                "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              navigate("/");
            }}
            className=" text-white px-4 py-2 rounded-md mb-4 bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
      {forms.length === 0 ? (
        <p>No forms available.</p>
      ) : (
        <ul className="list-disc">
          {forms.map((form, index) => (
            <div
              key={index}
              className="max-w-sm mx-auto overflow-hidden shadow-md rounded-md"
            >
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  Title: {form.title}
                </h3>

                <div className="mt-4 flex justify-between">
                  {/* Link to individual form using form ID */}
                  <Link to={`/form/${form._id}`}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                      Edit Form
                    </button>
                  </Link>
                  <Link to={`/response/${form._id}`}>
                    <button className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">
                      View
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      handleCopyLink(form._id);
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Share
                  </button>
                  <button
                    onClick={() => deleteForm(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FormsPage;
