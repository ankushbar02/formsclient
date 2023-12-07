// api.js
export const getFormData = async (formId, token) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}getFormData/${formId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const formData = await response.json();
        return formData;
      } else {
        
        console.error("Request failed");
        return null;
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      return null;
    }
  };
  