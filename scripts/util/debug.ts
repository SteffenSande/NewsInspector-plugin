class Log {
  public static debug(...log: any[]): void {
    console.log("Debug", log);
  }

  public static info(...log: any[]): void {
    console.log("Info", log);
  }

  public static error(...log: any[]): void {
    console.log("Error", arguments);
  }

  public static warning(...log: any[]): void {
    console.log("Warning", arguments);
  }
}
export default Log;
