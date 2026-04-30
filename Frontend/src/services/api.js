const BASE_URL = 'http://127.0.0.1:3001/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

const handleResponse = async (response, url) => {
    if (!response.ok) {
        const text = await response.text();
        console.error(`API Error at ${url}:`, { status: response.status, text });
        throw new Error(`Error ${response.status} at ${url}: ${text.slice(0, 50)}`);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    } else {
        const text = await response.text();
        console.error(`Non-JSON response at ${url}:`, text);
        throw new Error(`Server returned non-JSON response at ${url}`);
    }
};

export const api = {
    // Auth
    login: async (username, password) => {
        const url = `${BASE_URL}/user/login`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return handleResponse(response, url);
    },

    // Travellers
    getTravellers: async () => {
        const url = `${BASE_URL}/traveller`;
        const response = await fetch(url, { headers: getHeaders() });
        return handleResponse(response, url);
    },
    createTraveller: async (data) => {
        const url = `${BASE_URL}/traveller`;
        const response = await fetch(url, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response, url);
    },
    updateTraveller: async (id, data) => {
        const url = `${BASE_URL}/traveller/${id}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response, url);
    },
    deleteTraveller: async (id) => {
        const url = `${BASE_URL}/traveller/${id}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse(response, url);
    },

    // Travels
    getTravels: async () => {
        const url = `${BASE_URL}/travel`;
        const response = await fetch(url, { headers: getHeaders() });
        return handleResponse(response, url);
    },
    createTravel: async (data) => {
        const url = `${BASE_URL}/travel`;
        const response = await fetch(url, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response, url);
    },
    updateTravel: async (id, data) => {
        const url = `${BASE_URL}/travel/${id}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response, url);
    },
    deleteTravel: async (id) => {
        const url = `${BASE_URL}/travel/${id}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse(response, url);
    },

    // Users (Admins)
    getUsers: async () => {
        const url = `${BASE_URL}/user`;
        const response = await fetch(url, { headers: getHeaders() });
        return handleResponse(response, url);
    },
    createUser: async (data) => {
        const url = `${BASE_URL}/user/create`;
        const response = await fetch(url, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response, url);
    },
    updateUser: async (id, data) => {
        const url = `${BASE_URL}/user/${id}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response, url);
    },
    deleteUser: async (id) => {
        const url = `${BASE_URL}/user/${id}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse(response, url);
    },

    // Registrations
    getRegistrations: async () => {
        const url = `${BASE_URL}/travels`;
        const response = await fetch(url, { headers: getHeaders() });
        return handleResponse(response, url);
    }
};
