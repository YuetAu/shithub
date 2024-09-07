export const authFetch = async (url: string, method: string, body?: any, retryCounter: number = 0): Promise<any> => {
    const token = localStorage.getItem("AToken");
    if (!token) {
        console.log("No token found");
        return false;
    }
    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: body && JSON.stringify(body)
    });
    if (!response.ok) {
        if (response.status === 401 && retryCounter < 1) {
            console.log("Unauthorized");
            console.log("Try to refresh token");

            const refreshToken = localStorage.getItem("RToken");
            if (!refreshToken) {
                console.log("No refresh token found");
                return false;
            }
            const refreshResponse = await fetch("https://shithub-backend.yuetau.workers.dev/auth/refresh-at", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${refreshToken}`
                }
            });
            if (!refreshResponse.ok) {
                console.log("Failed to refresh token");
                return false;
            }
            let refreshData;
            try {
                refreshData = await refreshResponse.json();
            } catch (e) {
                console.log("Failed to parse refresh response");
                return false;
            }
            if (!refreshData || !refreshData.success || !refreshData.token) {
                console.log("Failed to get new access token");
                return false;
            }
            localStorage.setItem("AToken", refreshData.token);
            console.log("Token refreshed");
            return authFetch(url, method, body, retryCounter + 1);
        } else {
            console.log("Failed to fetch");
            return false;
        }
    }
    let data;
    try {
        data = await response.json();
    } catch (e) {
        console.log("Failed to parse response");
        return false;
    }
    return data;
}