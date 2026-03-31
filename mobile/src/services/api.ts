import axios from 'axios';

const api = axios.create({
  baseURL: 'http://SEU_IP_AQUI:8080', // Substitua pelo seu IP real
} );

export default api;
