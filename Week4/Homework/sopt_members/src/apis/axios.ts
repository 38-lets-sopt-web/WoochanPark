import axios from 'axios';

const client = axios.create({
    baseURL: 'https://sopt-server.p-e.kr',
});

export default client;
