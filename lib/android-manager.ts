import * as child_process from "child_process";
import { waitForOutput, executeCommand } from "./utils";
import { resolve } from "path";
import { IDevice, Device } from "./device";
import { Status } from "./status";
import { Platform } from "./platform";

export class AndroidManager {
    private static ANDROID_HOME = process.env["ANDROID_HOME"];
    private static EMULATOR = resolve(AndroidManager.ANDROID_HOME, Platform.EMULATOR, Platform.EMULATOR);
    private static ADB = resolve(AndroidManager.ANDROID_HOME, "platform-tools", "adb");
    private static LIST_DEVICES_COMMAND = AndroidManager.ADB + " devices";
    private static AVD_MANAGER = resolve(AndroidManager.ANDROID_HOME, "tools", "bin", "avdmanager");
    private static LIST_AVDS = AndroidManager.AVD_MANAGER + " list avd";
    private static _emulatorIds: Map<string, string> = new Map();

    public static getAllDevices() {
        const emulators = AndroidManager.parseEmulators();

        return emulators;
    }

    public static async startEmulator(emulator: IDevice, options?) {
        if (emulator.token === undefined) {
            emulator.token = AndroidManager.emulatorId(emulator.apiLevel) || "5554";
        }
        const response = await AndroidManager.startEmulatorProcess(emulator, options);

        if (!response.response) {
            emulator.status = AndroidManager.waitUntilEmulatorBoot(emulator.token, 180000) === true ? Status.FREE : Status.SHUTDOWN;
        }

        if (emulator.status === Status.FREE) {
            emulator.startedAt = Date.now();
        }

        return emulator;
    }

    /**
     * Implement kill process
     * @param emulator 
     */
    public static kill(emulator: IDevice) {
        executeCommand(AndroidManager.ADB + " -s " + Platform.EMULATOR + "-" + emulator.token + " emu kill");
        //kill process
        if (emulator.procPid) {

        }
    }

    /**
     * Still not implemented
     */
    public static killAll() {
        const log = executeCommand("killall qemu-system-i386 ");
        const OSASCRIPT_QUIT_QEMU_PROCESS_COMMAND = "osascript -e 'tell application \"qemu-system-i386\" to quit'";

        executeCommand(OSASCRIPT_QUIT_QEMU_PROCESS_COMMAND);
    }

    private static waitUntilEmulatorBoot(deviceId, timeOut: number) {
        const startTime = new Date().getTime();
        let currentTime = new Date().getTime();
        let found = false;

        console.log("Booting emulator ...");

        while ((currentTime - startTime) < timeOut * 1000 && !found) {
            currentTime = new Date().getTime();
            found = AndroidManager.checkIfEmulatorIsRunning(Platform.EMULATOR + "-" + deviceId);

        }

        if (!found) {
            let error = deviceId + " failed to boot in " + timeOut + " seconds.";
            console.log(error, true);
        } else {
            console.log("Emilator is booted!");
        }

        return found;
    }

    private static checkIfEmulatorIsRunning(token) {
        let isBooted = executeCommand(AndroidManager.ADB + " -s " + token + " shell getprop sys.boot_completed").trim() === "1";
        if (isBooted) {
            isBooted = executeCommand(AndroidManager.ADB + " -s " + token + " shell getprop init.svc.bootanim").toLowerCase().trim() === "stopped";
        }

        return isBooted;
    }

    public static emulatorId(platformVersion) {
        return AndroidManager._emulatorIds.get(platformVersion);
    }

    private static async startEmulatorProcess(emulator, options) {
        const process = child_process.spawn(AndroidManager.EMULATOR,
            ["-avd ", emulator.name, "-port ", emulator.token], {
                shell: true,
                detached: false
            });

        let response = AndroidManager.checkIfEmulatorIsRunning(Platform.EMULATOR + "-" + emulator.token);

        emulator.procPid = process.pid;

        return { response: response, process: emulator };
    }

    private static loadEmulatorsIds() {
        AndroidManager._emulatorIds.set("4.2", "5554");
        AndroidManager._emulatorIds.set("4.3", "5556");
        AndroidManager._emulatorIds.set("4.4", "5558");
        AndroidManager._emulatorIds.set("5.0", "5560");
        AndroidManager._emulatorIds.set("5.1", "5562");
        AndroidManager._emulatorIds.set("6.0", "5564");
        AndroidManager._emulatorIds.set("7.0", "5566");
        AndroidManager._emulatorIds.set("7.1", "5568");
        AndroidManager._emulatorIds.set("8.0", "5570");
    }

    private static parseEmulators() {
        let devices = executeCommand(AndroidManager.LIST_DEVICES_COMMAND).split("\n");
        const emulators: Map<string, IDevice> = new Map<string, IDevice>();
        executeCommand(AndroidManager.LIST_AVDS).split("-----").forEach(dev => {
            if (dev.toLowerCase().includes("available android")) {
            } else {
                const emu = AndroidManager.parseAvdAsEmulator(dev);
                emulators.set(emu.name, emu);
            }
        });

        devices.forEach((dev) => {
            const numberAsString = dev.replace(/\D+/ig, '');
            try {
                const port = parseInt(numberAsString);
                const avdInfo = executeCommand("(sleep 1; echo avd name) | telnet localhost " + port).trim();

                if (port !== NaN && avdInfo !== "" && avdInfo.toLowerCase().includes("ok") && avdInfo.toLowerCase().includes("connected to localhost")) {
                    for (let key of emulators.keys()) {
                        if (avdInfo.includes(key)) {
                            emulators.get(key).status = Status.FREE;
                            emulators.get(key).token = numberAsString;
                        }
                    }
                }
            } catch (error) {
            }
        });

        return emulators;
    }

    private static parseAvdAsEmulator(args): Device {
        let name = "";
        let apiLevel = 6.0;

        args.split("\n").forEach(line => {
            if (line.toLowerCase().includes("name")) {
                name = line.split("Name: ")[1].trim();
            }
            if (line.includes("Based on: Android")) {
                apiLevel = line.split("Based on: Android")[1].split(" (")[0].trim();
            }
        });

        const emulator = new Emulator(name, apiLevel, Platform.EMULATOR, undefined, Status.SHUTDOWN);

        return emulator;
    }
}

export class Emulator extends Device {
    constructor(name: string, apiLevel, type, token?: string, status?: string, procPid?: number) {
        super(name, apiLevel, type, token, status, procPid);
    }
}