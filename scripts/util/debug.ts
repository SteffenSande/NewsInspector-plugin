class Log {
    static debug(...log) {
        console.log("Debug",log);
    }
    static info(...log) {
        console.log("Info",log);
    }
    static error(...log) {
        console.log("Error", arguments);
    }
    static warning(...log) {
        console.log("Warning", arguments);
    }
}

export default Log;