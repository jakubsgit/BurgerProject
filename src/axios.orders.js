import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burgerburger-4f1b9.firebaseio.com/'
});

export default instance;