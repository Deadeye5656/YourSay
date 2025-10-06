const BASE_URL = "http://localhost:8080";

export async function signupUser(data) {
  const res = await fetch(`${BASE_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  // Backend returns plain text, not JSON
  const responseText = await res.text();
  console.log("Signup response text:", responseText);
  
  // Return a consistent object format
  if (res.ok) {
    return { success: true, message: responseText };
  } else {
    return { success: false, message: responseText };
  }
}

export async function loginUser(data) {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function sendVerification(data) {
  console.log("Sending verification to:", data);
  const res = await fetch(`${BASE_URL}/api/users/send-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  // Backend returns plain text, not JSON
  const responseText = await res.text();
  
  // Return a consistent object format
  if (res.ok) {
    return { success: true, message: responseText };
  } else {
    return { success: false, message: responseText };
  }
}

export async function updatePreferences(data) {
  const res = await fetch(`${BASE_URL}/api/users/preferences`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchLocalLegislation(zipcode) {
  const res = await fetch(`${BASE_URL}/api/legislation/local/${zipcode}`);
  return res.json();
}

export async function fetchStateLegislation(state) {
    console.log("Fetching state legislation for state:", state);
    console.log("Fetch URL:", `${BASE_URL}/api/legislation/state/${state}`);
  const res = await fetch(`${BASE_URL}/api/legislation/state/${state}`);
  return res.json();
}

export async function fetchFederalLegislation() {
  const res = await fetch(`${BASE_URL}/api/legislation/federal`);
  return res.json();
}

export async function fetchRandomLegislation(zipcode, state) {
  const res = await fetch(`${BASE_URL}/api/legislation/random/${zipcode}/${state}`);
  return res.json();
}

export async function addLocalLegislation(data) {
  const res = await fetch(`${BASE_URL}/api/legislation/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
