import axios from 'axios';

const API = axios.create({ baseURL: 'http://192.168.1.79:4000/api' });
export const getLevels     = () => API.get('/levels').then(res => res.data);
export const getRandomWord = lvl => API.get(`/random/${lvl}`).then(res => res.data);
export const getDetails    = (lvl, id) => API.get(`/details/${lvl}/${id}`).then(res => res.data);
