const BASE_URL = "https://yoursay-16cb.onrender.com";

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
  console.log("Login attempt for:", data.email);
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  if (res.ok) {
    // Backend now returns a LoginResponse object
    const loginResponse = await res.json();
    console.log("Login response:", loginResponse);
    
    // Store JWT tokens if provided
    if (loginResponse.accessToken) {
      localStorage.setItem('authToken', loginResponse.accessToken);
    }
    if (loginResponse.refreshToken) {
      localStorage.setItem('refreshToken', loginResponse.refreshToken);
    }
    
    // Return the response with success flag based on accessGranted
    return { 
      success: loginResponse.accessGranted, 
      isAuthenticated: loginResponse.accessGranted,
      userData: loginResponse.accessGranted ? {
        email: loginResponse.email,
        zipcode: loginResponse.zipcode,
        state: loginResponse.state,
        preferences: loginResponse.preferences
      } : null,
      accessToken: loginResponse.accessToken
    };
  } else {
    return { success: false, isAuthenticated: false, message: "Login failed" };
  }
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
  console.log("Updating preferences:", data);
  const res = await fetch(`${BASE_URL}/api/users/preferences`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  // Backend returns plain text, not JSON
  const responseText = await res.text();
  console.log("Update preferences response:", responseText);
  
  // Return a consistent object format
  if (res.ok) {
    return { success: true, message: responseText };
  } else {
    return { success: false, message: responseText };
  }
}

export async function fetchLocalLegislation(zipcode) {
  const authHeaders = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/api/legislation/local/${zipcode}`, {
    headers: authHeaders
  });
  
  if (res.status === 401 || res.status === 403) {
    throw new Error(`Authentication required: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
}

export async function fetchStateLegislation(state) {
  const authHeaders = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/api/legislation/state/${state}`, {
    headers: authHeaders
  });
  
  if (res.status === 401 || res.status === 403) {
    throw new Error(`Authentication required: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
}

export async function fetchFederalLegislation() {
  const authHeaders = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/api/legislation/federal`, {
    headers: authHeaders
  });
  
  if (res.status === 401 || res.status === 403) {
    throw new Error(`Authentication required: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
}

export async function fetchRandomLegislation(zipcode, state) {
  const authHeaders = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/api/legislation/random/${zipcode}/${state}`, {
    headers: authHeaders
  });
  
  if (res.status === 401 || res.status === 403) {
    throw new Error(`Authentication required: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
}

export async function addLocalLegislation(data) {
  const authHeaders = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/api/legislation/local`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...authHeaders
    },
    body: JSON.stringify(data),
  });
  
  if (res.status === 401 || res.status === 403) {
    throw new Error(`Authentication required: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
}

export async function addVote(data) {
  console.log("Adding vote:", data);
  const authHeaders = getAuthHeaders();
  
  const res = await fetch(`${BASE_URL}/api/legislation/vote`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...authHeaders
    },
    body: JSON.stringify(data),
  });
  
  if (res.ok) {
    const result = await res.json();
    return { success: true, result };
  } else if (res.status === 401 || res.status === 403) {
    return { success: false, message: "Authentication required", authError: true };
  } else {
    const errorText = await res.text();
    return { success: false, message: errorText };
  }
}

export async function addOpinion(data) {
  console.log("Adding opinion:", data);
  const authHeaders = getAuthHeaders();
  
  const res = await fetch(`${BASE_URL}/api/legislation/opinion`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...authHeaders
    },
    body: JSON.stringify(data),
  });
  
  if (res.ok) {
    const result = await res.json();
    return { success: true, result };
  } else if (res.status === 401 || res.status === 403) {
    return { success: false, message: "Authentication required", authError: true };
  } else {
    const errorText = await res.text();
    return { success: false, message: errorText };
  }
}

export async function getUserVotes(email) {
  console.log("Fetching votes for user:", email);
  const authHeaders = getAuthHeaders();
  
  const res = await fetch(`${BASE_URL}/api/legislation/vote/${encodeURIComponent(email)}`, {
    headers: authHeaders
  });
  
  if (res.ok) {
    const votes = await res.json();
    return { success: true, votes };
  } else if (res.status === 401 || res.status === 403) {
    return { success: false, message: "Authentication required", authError: true };
  } else {
    const errorText = await res.text();
    return { success: false, message: errorText };
  }
}

export async function getUserOpinions(email) {
  console.log("Fetching opinions for user:", email);
  const authHeaders = getAuthHeaders();
  
  const res = await fetch(`${BASE_URL}/api/legislation/opinion/${encodeURIComponent(email)}`, {
    headers: authHeaders
  });
  
  if (res.ok) {
    const opinions = await res.json();
    return { success: true, opinions };
  } else if (res.status === 401 || res.status === 403) {
    return { success: false, message: "Authentication required", authError: true };
  } else {
    const errorText = await res.text();
    return { success: false, message: errorText };
  }
}

export async function getAISummary(state, billId, title) {
  console.log("Fetching AI summary for:", { state, billId, title });
  const authHeaders = getAuthHeaders();
  const requestBody = {
    state: state,
    bill_id: billId.toString(),
    title: title
  };
  
  const res = await fetch(`${BASE_URL}/api/legislation/ai`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...authHeaders
    },
    body: JSON.stringify(requestBody),
  });
  
  if (res.ok) {
    const summary = await res.text();
    return { success: true, summary };
  } else if (res.status === 401 || res.status === 403) {
    return { success: false, message: "Authentication required", authError: true };
  } else {
    const errorText = await res.text();
    return { success: false, message: errorText };
  }
}

// JWT Token validation and auth helpers
export async function validateToken(token) {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    
    if (res.ok) {
      const userData = await res.json();
      return { valid: true, user: userData };
    } else {
      return { valid: false };
    }
  } catch (error) {
    console.error("Token validation error:", error);
    return { valid: false };
  }
}

export async function refreshToken() {
  try {
    const refreshTokenValue = localStorage.getItem('refreshToken');
    if (!refreshTokenValue) return { success: false };
    
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${refreshTokenValue}`
      }
    });
    
    if (res.ok) {
      const tokens = await res.json();
      localStorage.setItem('authToken', tokens.accessToken);
      if (tokens.refreshToken) {
        localStorage.setItem('refreshToken', tokens.refreshToken);
      }
      return { success: true, accessToken: tokens.accessToken };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error("Token refresh error:", error);
    return { success: false };
  }
}

// Helper to add auth headers to API calls
export function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return token ? { "Authorization": `Bearer ${token}` } : {};
}
