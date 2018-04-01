export interface MenuState {
    topmenu: {
        currentMenuItem: string,
        submenuShowState: string
    }
}

export interface MenuAction {
    type: any;
    menuItem?: string
    className?: string
}

const initialState: MenuState = {
    topmenu: {
        currentMenuItem: 'Wallet',
        submenuShowState: ''
    }
};

export const topmenu = (state = initialState, action: MenuAction) => {
    switch(action.type) {
        case 'SET_CURRENT_MENU_ITEM':
            return state = Object.assign({}, state, {topmenu: Object.assign({}, state.topmenu, {currentMenuItem: action.menuItem})});
        case 'SET_SUBMENU_SHOW_STATE':
            return state = Object.assign({}, state, {topmenu: Object.assign({}, state.topmenu, {submenuShowState: action.className})})
        default:
            return state;
    }
};
