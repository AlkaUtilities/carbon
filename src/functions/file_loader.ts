import { glob } from "glob";
import { promisify } from "node:util";
import chalk from "chalk";

const proGlob = promisify(glob);

// Loads all file in ./${directory_name}/every-directories/every-file-that-ends-with.ts

/**
 * Deletes selected file from require cache and returns a string of absolute path of file for all file in %cwd%\/{directory_name}\/\*\*\/\*.(ts | js)
 * @param directory_name
 * @returns
 */
async function load_files(directory_name: string) {
    const files = await proGlob(
        `${process.cwd().replace(/\\/g, "/")}/${directory_name}/**/*.+(ts|js)`
    );
    console.log(
        chalk.green(
            `[FILE LOADER] Loading ${process
                .cwd()
                .replace(/\\/g, "/")}/${directory_name}/**/*.+(ts|js)`
        )
    );
    files.forEach((file) => delete require.cache[require.resolve(file)]); // removes all cached imports of files
    return files;
}

export { load_files };
