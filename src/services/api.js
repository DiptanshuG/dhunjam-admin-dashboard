const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/account/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    return { status: response.status, data };
  } catch (error) {
    console.error("Error during API call:", error);
    return { status: 500, error: "Internal Server Error" };
  }
};

export const fetchAdminDetails = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/account/admin/${userId}`);
    const data = await response.json();

    if (response.status === 200 && data.response === "Success") {
      return data.data;
    } else {
      console.error("Error fetching Admin Details");
      return null;
    }
  } catch (error) {
    console.error("Error during fetchAdminDetails:", error);
    return null;
  }
};

export const updateAdminPrices = async (userId, modifiedCategories) => {
  try {
    const response = await fetch(`${BASE_URL}/account/admin/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: modifiedCategories,
      }),
    });

    const data = await response.json();

    if (response.status === 200 && data.response === "Success") {
      return true;
    } else {
      console.error("Error updating prices");
      return false;
    }
  } catch (error) {
    console.error("Error during updateAdminPrices:", error);
    return false;
  }
};
