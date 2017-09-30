import { IDevice, Device } from "./device";
export declare class AndroidManager {
    private static ANDROID_HOME;
    private static EMULATOR;
    private static ADB;
    private static LIST_DEVICES_COMMAND;
    private static AVD_MANAGER;
    private static LIST_AVDS;
    private static _emulatorIds;
    static getAllDevices(): Promise<Map<string, IDevice>>;
    static startEmulator(emulator: IDevice, options?: any): Promise<IDevice>;
    /**
     * Implement kill process
     * @param emulator
     */
    static kill(emulator: IDevice): void;
    /**
     * Still not implemented
     */
    static killAll(): void;
    private static waitUntilEmulatorBoot(deviceId, timeOut);
    private static checkIfEmulatorIsRunning(token);
    static emulatorId(platformVersion: any): string;
    private static startEmulatorProcess(emulator, options);
    private static loadEmulatorsIds();
    private static parseEmulators();
    private static parseAvdAsEmulator(args);
}
export declare class Emulator extends Device {
    constructor(name: string, apiLevel: any, type: any, token?: string, _status?: string, _procPid?: any);
}
