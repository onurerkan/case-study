const initialState = {
    language : 'en',
    employees : JSON.parse(localStorage.getItem('employees')) || [
        {
            "name" : "Ahmet 1",
            "surname": "Sourtimes",
            "dateOfEmployment": "23/09/2022",
            "dateOfBirth": "23/09/1990",
            "phone": "+(90) 532 123 45 67",
            "email": "ahmet1@sourtimes.org",
            "department": "Analytics",
            "position": "Junior"
        },
        {
            "name" : "Ahmet 2",
            "surname": "Sourtimes",
            "dateOfEmployment": "23/09/2022",
            "dateOfBirth": "23/09/1990",
            "phone": "+(90) 532 123 45 67",
            "email": "ahmet2@sourtimes.org",
            "department": "Tech",
            "position": "Medior"
        },
        {
            "name" : "Ahmet 3",
            "surname": "Sourtimes",
            "dateOfEmployment": "23/09/2022",
            "dateOfBirth": "23/09/1990",
            "phone": "+(90) 532 123 45 67",
            "email": "ahmet3@sourtimes.org",
            "department": "Analytics",
            "position": "Junior"
        },
        {
            "name" : "Ahmet 4",
            "surname": "Sourtimes",
            "dateOfEmployment": "23/09/2022",
            "dateOfBirth": "23/09/1990",
            "phone": "+(90) 532 123 45 67",
            "email": "ahmet4@sourtimes.org",
            "department": "Analytics",
            "position": "Junior"
        },
        {
            "name" : "Ahmet 5",
            "surname": "Sourtimes",
            "dateOfEmployment": "23/09/2022",
            "dateOfBirth": "23/09/1990",
            "phone": "+(90) 532 123 45 67",
            "email": "ahmet5@sourtimes.org",
            "department": "Analytics",
            "position": "Junior"
        },
        {
            "name" : "Ahmet 6",
            "surname": "Sourtimes",
            "dateOfEmployment": "23/09/2022",
            "dateOfBirth": "23/09/1990",
            "phone": "+(90) 532 123 45 67",
            "email": "ahmet6@sourtimes.org",
            "department": "Analytics",
            "position": "Junior"
        }
        
    ]
}

export const reducers = (state = initialState, action) => {
    switch(action.type){
        case 'SET_LANGUAGE':
            return {
                ...state, 
                language: action.payload
            };
        case 'DELETE_EMPLOYEE':
            return {
                ...state,
                employees : state.employees.filter((employee , _) => employee.email !== action.payload)
            };
        case 'ADD_EMPLOYEE':
            return {
                ...state,
                employees: [...state.employees, action.payload]
            };
        case 'EDIT_EMPLOYEE':
            return {
                employees : state.employees.map((employee, index) =>
                    index === action.payload.id
                        ? { ...employee, ...action.payload.data }
                        : employee
                ),
            };
        default:
            return state;
    }
}
