import { glob } from "glob";
import { promisify } from "node:util";

const proGlob = promisify(glob);

// SUMMARY Loads all file in ./${directory_name}/every-directories/every-file-that-ends-with.ts

/**
 * Loads all typescript file in "{directory_name}/folders/files.ts"
 * @param directory_name
 * @returns
 */
async function load_file(directory_name: string) {
    const files = await proGlob(
        `${process.cwd().replace(/\\/g, "/")}/${directory_name}/**/*.ts`
    );
    files.forEach((file) => delete require.cache[require.resolve(file)]); // removes all cached imports of files
    return files;
}

export { load_file };
