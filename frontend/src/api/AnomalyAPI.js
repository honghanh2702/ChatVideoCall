import AnomalyServer from "./server/AnomalyServer";

export const login = (data) => {
  return AnomalyServer.post("/user/login", data);
};
export const getUserInfo = () => {
  return AnomalyServer.get("/user");
};

