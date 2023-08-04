import yaml from "js-yaml";
import fs from "fs";
import { ConfigInterface } from "./typings/config";

const config: ConfigInterface = yaml.load(
    fs.readFileSync("./config.yml", "utf-8")
) as ConfigInterface;

// const dateFilename =
//     new Date().toISOString().replace(/[/\\?%*:|"<>]/g, "-") + " ";

// class Logger {
//     static Info(message: string): any {
//         message = `INFO  ` + message;
//         Logger.WriteAndSaveIfLoggingEnabled(message, true);
//     }

//     static Warn(message: string): any {
//         message = `WARN  ` + message;
//         Logger.WriteAndSaveIfLoggingEnabled(message, true);
//     }

//     static Error(message: string): any {
//         message = `ERROR ` + message;
//         Logger.WriteAndSaveIfLoggingEnabled(message, true);
//     }

//     static WriteAndSaveIfLoggingEnabled(
//         message: string,
//         show_date: boolean = true
//     ): any {
//         // console.log(message);
//         if (!config.log.enabled) return;
//         if (show_date) {
//             const date = new Date();
//             message =
//                 `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${(
//                     "00" + date.getHours()
//                 ).slice(-2)}-${("00" + date.getMinutes()).slice(-2)}-${(
//                     "00" + date.getSeconds()
//                 ).slice(-2)} ` + message;
//         }
//         // let filename = config.log.filePath;
//         // filename = filename.replace('{DATE}', new Date().toISOString()).replace(/[/\\?%*:|"<>]/g, '-');
//         fs.appendFileSync(
//             config.log.filePath + dateFilename + ".log",
//             message + "\n"
//         );
//     }
// }

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Interpolates placeholders in a template string with corresponding values from a data object.
 * Placeholders must be in the format `{key}` and can access nested properties using dot notation.
 *
 * @param template - The template string containing placeholders to be replaced.
 * @param data - An object containing the data used for substitution.
 * @returns The template string with placeholders replaced by their corresponding values.
 */
function interpolateString(template: string, data: any): string {
    return template.replace(/\{([^}]+)\}/g, (_, key) => {
        const keys = key.trim().split(".");
        let value = data;

        for (const k of keys) {
            if (typeof value === "object" && value !== null && k in value) {
                value = value[k];
            } else {
                value = `{${key}}`; // If a key is not found, keep the placeholder as is.
                break;
            }
        }

        return value;
    });
}

export { sleep, interpolateString };
