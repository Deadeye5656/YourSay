const BASE_URL = "https://yoursay-16cb.onrender.com";

// Global logout handler - will be set by App.jsx
let globalLogoutHandler = null;

export function setLogoutHandler(handler) {
  globalLogoutHandler = handler;
}

function triggerLogout() {
  if (globalLogoutHandler) {
    globalLogoutHandler();
  }
}

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
  
  let res = await makeAuthenticatedRequest(`${BASE_URL}/api/users/preferences`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json"
    },
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
  let res = await makeAuthenticatedRequest(`${BASE_URL}/api/legislation/local/${zipcode}`);
  return res.json();
}

export async function fetchStateLegislation(state) {
  let res = await makeAuthenticatedRequest(`${BASE_URL}/api/legislation/state/${state}`);
  return res.json();
}

export async function fetchFederalLegislation() {
  let res = await makeAuthenticatedRequest(`${BASE_URL}/api/legislation/federal`);
  return res.json();
}

export async function fetchRandomLegislation(zipcode, state) {
  let res = await makeAuthenticatedRequest(`${BASE_URL}/api/legislation/random/${zipcode}/${state}`);
  return res.json();
}

export async function addLocalLegislation(data) {
  let res = await makeAuthenticatedRequest(`${BASE_URL}/api/legislation/local`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function addVote(data) {
  console.log("Adding vote:", data);
  
  let res = await makeAuthenticatedRequest(`${BASE_URL}/api/legislation/vote`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  });
  
  if (res.ok) {
    const result = await res.json();
    return { success: true, result };
  } else {
    const errorText = await res.text();
    return { success: false, message: errorText };
  }
}

export async function addOpinion(data) {
  console.log("Adding opinion:", data);
  
  let res = await makeAuthenticatedRequest(`${BASE_URL}/api/legislation/opinion`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  });
  
  if (res.ok) {
    const result = await res.json();
    return { success: true, result };
  } else {
    const errorText = await res.text();
    return { success: false, message: errorText };
  }
}

export async function getUserVotes(email) {
  console.log("Fetching votes for user:", email);
  
  let res = await makeAuthenticatedRequest(`${BASE_URL}/api/legislation/vote/${encodeURIComponent(email)}`);
  
  if (res.ok) {
    const votes = await res.json();
    return { success: true, votes };
  } else {
    const errorText = await res.text();
    return { success: false, message: errorText };
  }
}

export async function getUserOpinions(email) {
  console.log("Fetching opinions for user:", email);
  
  let res = await makeAuthenticatedRequest(`${BASE_URL}/api/legislation/opinion/${encodeURIComponent(email)}`);
  
  if (res.ok) {
    const opinions = await res.json();
    return { success: true, opinions };
  } else {
    const errorText = await res.text();
    return { success: false, message: errorText };
  }
}

export async function getAISummary(state, billId, title) {
  console.log("Fetching AI summary for:", { state, billId, title });
  const requestBody = {
    state: state,
    bill_id: billId.toString(),
    title: title
  };
  
  let res = await makeAuthenticatedRequest(`${BASE_URL}/api/legislation/ai`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody),
  });
  
  if (res.ok) {
    const summary = await res.text();
    return { success: true, summary };
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
    if (!refreshTokenValue) {
      clearSession();
      return { success: false };
    }
    
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
      // Refresh token is invalid or expired, clear session
      clearSession();
      return { success: false };
    }
  } catch (error) {
    console.error("Token refresh error:", error);
    clearSession();
    return { success: false };
  }
}

// Helper to add auth headers to API calls
export function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

// Check if user has valid session data
export function isSessionValid() {
  const authToken = localStorage.getItem('authToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const userEmail = localStorage.getItem('userEmail');
  const userZipcode = localStorage.getItem('userZipcode');
  const userState = localStorage.getItem('userState');
  const userPreferences = localStorage.getItem('userPreferences');
  
  // If no tokens, session is invalid
  if (!authToken && !refreshToken) {
    return false;
  }
  
  // If missing any required user data, session is invalid
  if (!userEmail || !userZipcode || !userState || !userPreferences) {
    return false;
  }
  
  return true;
}

// Clear all user session data
export function clearSession() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userZipcode');
  localStorage.removeItem('userState');
  localStorage.removeItem('userPreferences');
}

// Check session validity and clear if invalid
export function validateAndClearSession() {
  if (!isSessionValid()) {
    clearSession();
    return false;
  }
  return true;
}

// Helper function to make authenticated API calls with automatic token refresh
export async function makeAuthenticatedRequest(url, options = {}) {
  // Check if session is valid before making request
  if (!isSessionValid()) {
    clearSession();
    triggerLogout();
    throw new Error('Session expired. Please log in again.');
  }
  
  const authHeaders = getAuthHeaders();
  const requestOptions = {
    ...options,
    headers: {
      ...options.headers,
      ...authHeaders
    }
  };
  
  let res = await fetch(url, requestOptions);
  
  // If we get a 401, try to refresh the token and retry once
  if (res.status === 401) {
    const refreshResult = await refreshToken();
    if (refreshResult.success) {
      // Retry with new token
      const newAuthHeaders = getAuthHeaders();
      requestOptions.headers = {
        ...options.headers,
        ...newAuthHeaders
      };
      res = await fetch(url, requestOptions);
      
      // If still 401 after refresh, trigger logout
      if (res.status === 401 || res.status === 403) {
        clearSession();
        triggerLogout();
        throw new Error('Authentication failed. Please log in again.');
      }
    } else {
      // Refresh failed, clear session and logout
      clearSession();
      triggerLogout();
      throw new Error('Session expired. Please log in again.');
    }
  } else if (res.status === 403) {
    // 403 means forbidden - trigger logout
    clearSession();
    triggerLogout();
    throw new Error('Access forbidden. Please log in again.');
  }
  
  return res;
}
