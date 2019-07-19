export const messageTypes = {
    INIT: 'INIT',
    SELECT: 'SELECT',
    TURN_HOOVER_SELECT_ON: 'TURN_HOOVER_SELECT_ON',
    TURN_HOOVER_SELECT_OFF: 'TURN_HOOVER_SELECT_OFF',
    SITES_UPDATED: 'SITES_UPDATED',
    IS_SITE_SUPPORTED:'IS_SITE_SUPPORTED',
    REDIRECT_TO: 'REDIRECT_TO',
};

export interface IMessage {
    type: string,
    payload: object
}

export function createMessage(type: string, data = {}) {
    return {
        type: type,
        data: data
    }
}