import * as child_process from "child_process";
import { waitForOutput, executeCommand } from "./utils";
import { Status } from "./status";
import { IDevice } from "./device";

export class IOSManager {

    private static XCRUN = "xcrun ";
    private static SIMCTL = IOSManager.XCRUN + " simctl ";
    private static XCRUNLISTDEVICES_COMMAND = IOSManager.SIMCTL + " list devices ";
    private static BOOT_DEVICE_COMMAND = IOSManager.XCRUN + " instruments -w "
    private static BOOTED = "Booted";
    private static SHUTDOWN = "Shutdown";
    private static OSASCRIPT_QUIT_SIMULATOR_COMMAND = "osascript -e 'tell application \"Simulator\" to quit'";
    private static SIMULATOR = "simulator";
    private static IOS_DEVICE = "ios-device";

    public static getAllDevices() {
        return IOSManager.findSimulatorByParameter();
    }

    public static async startSimulator(simulator: IDevice) {
        let udid = simulator.token;
        executeCommand(IOSManager.XCRUN + " erase " + udid);
        const process = IOSManager.startSimulatorProcess(udid);

        let responce: boolean = await waitForOutput(process, /Waiting for device to boot/, new RegExp("Failed to load", "i"), 180000);
        if (responce === true) {
            IOSManager.waitUntilSimulatorBoot(udid, 180000);
            simulator.type = IOSManager.SIMULATOR;
            simulator.status = Status.free;
            simulator.procPid = process.pid;
            console.log(`Launched simulator with name: ${simulator.name}; udid: ${simulator.token}; status: ${simulator.status}`);
            await setTimeout(function () {

            }, 10000);
        } else {
            console.log("Simulator is probably already started!");
        }

        return simulator;
    }

    public static killAll() {
        const log = executeCommand("killall Simulator ");
        executeCommand(IOSManager.OSASCRIPT_QUIT_SIMULATOR_COMMAND);
    }

    public static kill(udid: string) {
        console.log(`Killing simulator with udid ${udid}`);
        executeCommand(IOSManager.SIMCTL + "  shutdown " + udid);
    }

    private static startSimulatorProcess(udid) {
        console.log("before Sim process ");

        const simProcess = child_process.spawn(IOSManager.BOOT_DEVICE_COMMAND, [udid], {
            shell: true,
            detached: false
        });

        console.log("Sim process ", simProcess);

        return simProcess;
    }

    private static findSimulatorByParameter(...args) {
        const simulators = executeCommand(IOSManager.XCRUNLISTDEVICES_COMMAND).split("\n");
        const devices: Array<IDevice> = new Array<IDevice>();

        simulators.forEach((sim) => {
            let shouldAdd = true;
            args.forEach(element => {
                if (sim.toLocaleLowerCase().includes(element.toLowerCase())) {
                    shouldAdd = shouldAdd && true;
                } else {
                    shouldAdd = false;
                }
            });

            if (shouldAdd) {
                let result = IOSManager.parseSimulator(sim);
                if (result) {
                    devices.push(IOSManager.parseSimulator(sim));
                }
            }
        });

        return devices;
    }

    private static parseSimulator(sim) {
        var parts = sim.split(" (");
        if (parts.length < 2) {
            return undefined;
        }
        const name = parts[0].trim();
        const udid = parts[1].replace(")", "").trim();
        let args = "";
        if (parts.length === 3) {
            args = parts[2].replace(")", "").trim().toLowerCase();
        }

        return new Simulator(udid, name, args, IOSManager.SIMULATOR);
    }

    // Should find a better way
    private static waitUntilSimulatorBoot(udid, timeout) {
        let booted = IOSManager.findSimulatorByParameter(udid, IOSManager.BOOTED).length > 0;
        const startTime = new Date().getTime();
        let currentTime = new Date().getTime();

        console.log("Booting simulator ...");

        while ((currentTime - startTime) < timeout && !booted) {
            currentTime = new Date().getTime();
            booted = IOSManager.findSimulatorByParameter(udid, IOSManager.BOOTED).length > 0;
        }

        if (!booted) {
            let error = "Simulator with " + udid + " failed to boot";
            console.log(error, true);
        } else {
            console.log("Simulator is booted!");
        }
    }
}

export class Simulator implements IDevice {
    private _startedAt?: number;

    constructor(private _token: string, private _name: string, private _status: string, private _type, private _procPid?) {
    }

    get token() {
        return this._token;
    }

    get type() {
        return this._type;
    }

    get procPid() {
        return this._procPid;
    }

    get status() {
        return this._status;
    }

    set status(status) {
        this._status = status;
    }

    get name() {
        return this._name;
    }

    get startedAt() {
        return this._startedAt;
    }

    set startedAt(startedAt) {
        this._startedAt = startedAt;
    }
}