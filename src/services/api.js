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
