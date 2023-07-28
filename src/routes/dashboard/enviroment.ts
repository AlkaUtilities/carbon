import { Router } from "express";
import { client } from "../../index";
import { Server } from "socket.io";
import { setIntervalAsync, clearIntervalAsync } from "set-interval-async";
import os from "os";
import si from "systeminformation";

// const io = ioIndex.of("/enviroment");
const router = Router();

router.get("/", async (req, res) => {
    const io = req.io;
    const userAvatarURL = client.users.cache
        .get(req.user!.UserID)
        ?.displayAvatarURL({ extension: "webp" });

    let socketConnected = false;

    io.setMaxListeners(0);

    io.on("connection", async (socket: any) => {
        socketConnected = true;

        await sendUpdate(io, true);

        // Periodically update memory usage and send to clients
        const updateInterval = setIntervalAsync(async () => {
            if (socketConnected) {
                await sendUpdate(io);
            } else {
                clearIntervalAsync(updateInterval);
            }
        }, 2000);

        socket.on("disconnect", () => {
            socketConnected = false;
            clearIntervalAsync(updateInterval);
        });
    });

    res.status(200).render("dashboard/enviroment", {
        currentPage: req.baseUrl + req.url,
        userAvatarURL: userAvatarURL,
        config: client.config,
    });
});

function getMemoryUsage() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    return { totalMemory, usedMemory, freeMemory };
}

// Only allow 1 cpu usage process to run at a time (hopefully).
let cpuUsageInUse = false;
async function getCpuUsage() {
    if (cpuUsageInUse) {
        return undefined;
    }

    cpuUsageInUse = true;
    try {
        const cpuData = await si.currentLoad();
        return cpuData.currentLoad;
    } catch (err) {
        return undefined;
    } finally {
        cpuUsageInUse = false;
    }
}

async function getDiskSize() {
    const data = await si.fsSize();
    const currentDisk = data.find((disk) => __dirname.startsWith(disk.mount));

    if (currentDisk) {
        return { used: currentDisk.used, size: currentDisk.size };
    } else {
        return undefined;
    }
}

async function sendUpdate(io: Server, sendDisk = false) {
    // Check if there are any connected clients before emitting the update
    if (io.engine.clientsCount > 0) {
        // FIXME Getting these usages repeatedly can cause the script to create child processes that sometimes doesnt close automatically (atleast in windows)
        const memoryUsage = getMemoryUsage();
        const cpuUsage = await getCpuUsage();
        let disk = undefined;
        if (sendDisk) {
            disk = await getDiskSize();
        }

        io.emit("performanceUpdate", {
            memory: {
                used: memoryUsage.usedMemory,
                total: memoryUsage.totalMemory,
            },
            cpu: cpuUsage,
            storage: disk,
        });
    }
}

import { config as dotenv } from "dotenv";
dotenv({ path: __dirname + "\\..\\.env" });

export { router };
