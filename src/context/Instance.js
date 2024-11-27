import axios from 'axios';

const Instance = axios.create({
  baseURL: 'https://doflamingo-api.onrender.com/api/', 
});

export default Instance;