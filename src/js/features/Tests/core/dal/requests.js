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

export const requestTests = () => {
    return testsArray
}

export const requestCreatedTests = () => {
    return testsArray
}

export const deleteTests = (id) => {
    return testsArray.filter(f => f.id !== id)
}

export const postNewCreatedTest = (test) => {
    console.log(test)
}
