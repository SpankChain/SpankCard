export interface WelcomePopupState {
    welcomePopupState: string
}

export interface WelcomePopupAction {
    type: any;
    className?: string
}

const initialState:WelcomePopupState = {
    welcomePopupState: 'is-active'
};

export const welcome = (state = initialState, action:WelcomePopupAction) => {
    switch(action.type) {
        case 'SET_WELCOME_POPUP_STATE':
            return state = Object.assign({}, state, {welcomePopupState: action.className});
        default:
            return state;
    }
};