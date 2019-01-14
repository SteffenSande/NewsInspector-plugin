import Log from "../util/debug";

export interface INotification {
    title: string,
    message: string,
    url?: string,
}

class Notification {

    public static notifyUser = (notification: INotification) => {
        let notificationId = "";
        chrome.notifications.create( {
            type: "basic",
            title: notification.title,
            message: notification.message,
            iconUrl: "icons/icon.png",
        }, (id) => notificationId = id);

        if (notification.url) {
            chrome.notifications.onClicked.addListener((id) => {
                if (id === notificationId)
                    chrome.tabs.create({ url: notification.url })
            })
        }


    };
}

export default Notification;