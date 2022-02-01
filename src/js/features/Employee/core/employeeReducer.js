

const initialState = {
    employee: [{
        id: 2,
        fullName: 'Grisha b',
        position: 'Junior front end developer',
        email: 'mail.mailAmail.com',
        pdp: 'PDP',
        status: 'user'
    },{
        id: 3,
        fullName: 'Luyee f',
        position: 'Middle back end developer',
        email: 'mail.mailAmail.com',
        pdp: 'PDP',
        status: 'user'
    }
    ]
}

const employeeReducer = (state = initialState, action) => {

    switch (action.type){
        default:
            return state
    }
}

export default employeeReducer
