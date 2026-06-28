let clientAccessToken = "";

export const setClientToken = (token: string) => {
  clientAccessToken = token;
};

export const getClientToken = () => clientAccessToken;
