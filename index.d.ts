import { IDevice } from "./lib/device";
export { AndroidManager, Emulator } from "./lib/android-manager";
export { IOSManager, Simulator } from "./lib/ios-manager";
export { IDevice, Device } from "./lib/device";
export { Status } from "./lib/status";
export declare function getAndroidDevices(): void;
export declare function getIOSDevices(): void;
export declare function startEmulator(emulator: IDevice, options?: any): void;
export declare function startSimulator(simulator: IDevice, options?: any): void;
/**
 * Still not impleneted
 */
export declare function killAllEmulators(): void;
export declare function killAllSimulators(): void;
export declare function killEmulator(emulator: IDevice): void;
export declare function killSimulator(simulator: IDevice): void;
/**
 * Still not implemented
 */
export declare function restartAndoidDevice(): void;
/**
 * Still not implemented
 */
export declare function restartIOSDevice(): void;
