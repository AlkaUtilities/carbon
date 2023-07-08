import config from "./config";
import fs from "fs";

const dateFilename =
    new Date().toISOString().replace(/[/\\?%*:|"<>]/g, "-") + " ";

class Logger {
    static Info(message: string): any {
        message = `INFO  ` + message;
        Logger.WriteAndSaveIfLoggingEnabled(message, true);
    }

    static Warn(message: string): any {
        message = `WARN  ` + message;
        Logger.WriteAndSaveIfLoggingEnabled(message, true);
    }

    static Error(message: string): any {
        message = `ERROR ` + message;
        Logger.WriteAndSaveIfLoggingEnabled(message, true);
    }

    static WriteAndSaveIfLoggingEnabled(
        message: string,
        show_date: boolean = true
    ): any {
        // console.log(message);
        if (!config.log.enabled) return;
        if (show_date) {
            const date = new Date();
            message =
                `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${(
                    "00" + date.getHours()
                ).slice(-2)}-${("00" + date.getMinutes()).slice(-2)}-${(
                    "00" + date.getSeconds()
                ).slice(-2)} ` + message;
        }
        // let filename = config.log.filePath;
        // filename = filename.replace('{DATE}', new Date().toISOString()).replace(/[/\\?%*:|"<>]/g, '-');
        fs.appendFileSync(
            config.log.filePath + dateFilename + ".log",
            message + "\n"
        );
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export { sleep };
