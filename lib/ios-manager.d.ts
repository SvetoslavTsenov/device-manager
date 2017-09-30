import { IDevice, Device } from "./device";
export declare class IOSManager {
    private static XCRUN;
    private static SIMCTL;
    private static XCRUNLISTDEVICES_COMMAND;
    private static BOOT_DEVICE_COMMAND;
    private static BOOTED;
    private static SHUTDOWN;
    private static OSASCRIPT_QUIT_SIMULATOR_COMMAND;
    private static SIMULATOR;
    private static IOS_DEVICE;
    static getAllDevices(): Map<string, Device>;
    static startSimulator(simulator: IDevice): Promise<IDevice>;
    static killAll(): void;
    static kill(udid: string): void;
    private static startSimulatorProcess(udid);
    private static findSimulatorByParameter(...args);
    private static parseSimulator(sim);
    private static waitUntilSimulatorBoot(udid, timeout);
}
export declare class Simulator extends Device {
    constructor(token: string, name: string, status: string, type: any, procPid?: number);
}
