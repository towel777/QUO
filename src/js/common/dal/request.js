import axios from "axios"

const testsArray = [
    {
        id: 1,
        name: 'English',
        level: 'Junior',
        time: 120,
        questions: [
            {id: 1, number: 1, description: 'What is React', condition: 'waiting', answer: ''},
            {id: 4, number: 4, description: 'What is Front-End', condition: 'waiting', answer: ''},
            {id: 2, number: 2, description: 'What is Back-End', condition: 'waiting', answer: ''},
            {id: 3, number: 3, description: 'Who are you', condition: 'waiting', answer: ''} ]
    },
    {
        id: 3,
        name: 'Back-End',
        level: 'Junior',
        time: 120,
        questions: [
            {id: 1, number: 1, description: 'What is React', condition: 'waiting', answer: ''},
            {id: 4, number: 2, description: 'What is Front-End', condition: 'waiting', answer: ''},
            {id: 2, number: 3, description: 'What is Back-End', condition: 'waiting', answer: ''},
            {id: 4, number: 4, description: 'Who are you', condition: 'waiting', answer: ''} ]
    },
    {
        id: 2,
        name: 'Front-End',
        level: 'Middle',
        time: 160,
        questions: [
            {id: 1, number: 1, description: 'What is React', condition: 'waiting', answer: ''},
            {id: 2, number: 2, description: 'What is Front-End', condition: 'waiting', answer: ''},
            {id: 3, number: 3, description: 'What is Back-End', condition: 'waiting', answer: ''},
            {id: 4, number: 4, description: 'Who are you', condition: 'waiting', answer: ''} ]
    }
]

const instance = axios.create({
    baseURL: 'https://quo-test.herokuapp.com/',
    headers: {
        'Content-Type': 'application/json'
    }

})

export const authentication = {
    postLogin (email, psw) {
        return instance.post(`auth/api/login`, {email, psw})
            .then(response => response.data)
    },
    getProfile (session_token) {
        return instance.post(`auth/api/profile`, {session_token})
            .then(response => response.data)
    },
    postNewCompany (name, employee, positions) {
        debugger
        return instance.post(`auth/api/NewCompany`, {name, employee, positions})
            .then(response => response.data)
    }
}

export const users = {
    postPosition (session_token) {
        return instance.post(`auth/api/positions`, {session_token})
            .then(response => response.data)
    },
    postNewEmployee (session_token, email, full_name, admin_status, position) {
        debugger
        return instance.post(`auth/api/NewEmployee`, {session_token, email, full_name, admin_status, position})
            .then(response => response.data)
    },
    getAllEmployeers (session_token) {
        return instance.post(`auth/api/employees`, {session_token})
            .then(response => response.data)
    }
}


export const getResultTestsData = () => {
    return testsArray
}
