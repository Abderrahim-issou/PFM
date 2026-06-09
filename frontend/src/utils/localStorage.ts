

export const saveToken = (token: string) => {
    localStorage.setItem('access_token', token);
}

export const getToken = () => {
    const token = localStorage.getItem('access_token');
    if(!token) {
        console.log('token is not available')
        return null;
    }
    return token;
}

export const removeToken = () => {
    localStorage.removeItem('access_token');
}