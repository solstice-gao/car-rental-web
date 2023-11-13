const TOKEN_NAME = "HZWL_TOKEN_CACHE_KEY"

const isLogin = () => {
  return !!localStorage.getItem(TOKEN_NAME);
};

const getToken = () => {
  return localStorage.getItem(TOKEN_NAME);
};

const setToken = (token: string) => {
  localStorage.setItem(TOKEN_NAME, token);
};

const setClient = (client: string) => {
  localStorage.setItem('client', client);
};

const setRoles = (roles: string[]) => {
  localStorage.setItem('roles', JSON.stringify(roles));
};

const getRoles = () => {
  return localStorage.getItem('roles');
};

const getClient = () => {
  return localStorage.getItem('client');
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_NAME);
};

const clearRoles = () => {
  localStorage.removeItem('roles');
};

export { isLogin, getToken, setToken, clearToken, setClient, getClient,setRoles,clearRoles,getRoles };
