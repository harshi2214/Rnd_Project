const API_URL =
  "https://script.google.com/macros/s/AKfycbzTbQdWtqbmMmfZ1jxz-SQf_9Uav1LcaJ5TgzWJ9JifxTPTH3ZXpY30aDWRpL_HMs_p/exec";

export const fetchAllData = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const addStudent = async (data) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding student:", error);
    return null;
  }
};

export const deleteStudent = async (rollNo) => {
  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ delete: true, RollNo: rollNo }),
  });
  return await response.json();
};