import { BACKEND_URL } from '../common/const';
interface RefreshResponse {
    success: boolean;
    token: string;
}

const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem('RToken');
    if (!refreshToken) {
        console.log('No refresh token found');
        return null;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/auth/refresh-at`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const data: RefreshResponse = await response.json();
        if (!data.success || !data.token) {
            throw new Error('Invalid refresh response');
        }

        localStorage.setItem('AToken', data.token);
        console.log('Token refreshed');
        return data.token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        localStorage.removeItem('AToken');
        localStorage.removeItem('RToken');
        return null;
    }
};

export const authFetch = async (
    url: string,
    method: string,
    body?: any,
    retryCounter: number = 0
): Promise<any> => {
    const token = localStorage.getItem('AToken');
    if (!token) {
        console.log('No token found');
        return null;
    }

    try {
        console.log('Fetching with Auth:', url);
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: body ? JSON.stringify(body) : undefined
        });

        if (!response.ok) {
            if (response.status === 401 && retryCounter < 1) {
                console.log('Unauthorized. Attempting to refresh token...');
                const newToken = await refreshAccessToken();
                if (newToken) {
                    return authFetch(url, method, body, retryCounter + 1);
                }
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
};
