import axios from 'axios';

const Instance = axios.create({
  baseURL: 'https://huillerie-api.onrender.com/api/', 
});

export default Instance;