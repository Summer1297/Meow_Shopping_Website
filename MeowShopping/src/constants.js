export const LOGIN_STATUS = {
    PENDING: 'pending',
    NOT_LOGGED_IN: 'notLoggedIn',
    IS_LOGGED_IN: 'loggedIn',
};

export const SERVER = {
    AUTH_MISSING: 'auth-missing',
    AUTH_INSUFFICIENT: 'auth-insufficient',
    REQUIRED_USERNAME: 'required-username',
    INVALID_USERNAME: 'invalid-username',
    USERNAME_EXISTS: 'username-exists',
    USER_NOT_FOUND: 'user-not-found',
    PRODUCT_NOT_FOUND: 'product-not-found',
    ADMIN_ONLY: 'admin-only',
    DOG_FORBIDDEN: 'dog-forbidden',
};


export const CLIENT = {
    NETWORK_ERROR: 'networkError',
    NO_SESSION: 'noSession',
    UNKNOWN_ERROR: 'unknownError',
};


export const MESSAGES = {
    [CLIENT.NETWORK_ERROR]: 'Network connection problem. Please try again',
    [CLIENT.NO_SESSION]: 'Session expired. Please login again',
    [CLIENT.UNKNOWN_ERROR]: 'An unknown error occurred. Please try again',
    [SERVER.AUTH_MISSING]: 'Please login first',
    [SERVER.AUTH_INSUFFICIENT]: 'Insufficient permissions',
    [SERVER.REQUIRED_USERNAME]: 'Username is required',
    [SERVER.INVALID_USERNAME]: 'Invalid username format',
    [SERVER.USERNAME_EXISTS]: 'Username already exists',
    [SERVER.USER_NOT_FOUND]: 'User not found. Please register first',
    [SERVER.PRODUCT_NOT_FOUND]: 'Product not found',
    [SERVER.ADMIN_ONLY]: 'Admin access only',
    [SERVER.DOG_FORBIDDEN]: 'dog is not allowed',
    default: 'Something went wrong. Please try again',
};

// Reducer Actions
export const ACTIONS = {
    SET_USER: 'SET_USER',
    SET_CART: 'SET_CART',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_SUCCESS: 'SET_SUCCESS',
    SET_SHOW_AUTH: 'SET_SHOW_AUTH',
    SET_IS_REGISTERING: 'SET_IS_REGISTERING',
    SET_IS_ADMIN: 'SET_IS_ADMIN',
    SET_SHOW_CART: 'SET_SHOW_CART',
    SET_LOGIN_MODAL: 'SET_LOGIN_MODAL',
    UPDATE_CART: 'UPDATE_CART',
    CLEAR_CART: 'CLEAR_CART',
    ADD_TO_CART: 'ADD_TO_CART',
    REMOVE_FROM_CART: 'REMOVE_FROM_CART',
};

