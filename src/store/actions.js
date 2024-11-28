import { SET_LANGUAGE, DELETE_EMPLOYEE, ADD_EMPLOYEE, EDIT_EMPLOYEE } from './types';

export const setLanguage = (language) => ({
    type: SET_LANGUAGE,
    payload: language
});

export const deleteEmployee = (employeeId) => ({
    type: DELETE_EMPLOYEE,
    payload: employeeId
});

export const addEmployee = (employee) => ({
    type: ADD_EMPLOYEE,
    payload: employee
});

export const updateEmployee = (employee) => ({
    type: EDIT_EMPLOYEE,
    payload: employee
});