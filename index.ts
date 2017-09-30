import { AndroidManager, Emulator } from "./lib/android-manager";
import { IOSManager, Simulator } from "./lib/ios-manager";
import { IDevice } from "./lib/device";

export { AndroidManager, Emulator } from "./lib/android-manager";
export { IOSManager, Simulator } from "./lib/ios-manager";
export { IDevice } from "./lib/device";
export { Status } from "./lib/status";

export function getAndroidDevices() {
    AndroidManager.getAllDevices();
}

export function getIOSDevices() {
    IOSManager.getAllDevices();
}

export function startEmulator(emulator: IDevice, options?) {
    AndroidManager.startEmulator(emulator, options);
}

export function startSimulator(simulator: IDevice, options?) {
    IOSManager.startSimulator(simulator);
}

/**
 * Still not impleneted
 */
export function killAllEmulators() {
    AndroidManager.killAll();
}

export function killAllSimulators() {
    IOSManager.killAll();
}

export function killEmulator(emulator: IDevice) {
    AndroidManager.kill(emulator);
}

export function killSimulator(simulator: IDevice) {
    IOSManager.kill(simulator.token);
}

/**
 * Still not implemented
 */
export function restartAndoidDevice() {
    //AndroidManager.restartDevice();
}

/**
 * Still not implemented
 */
export function restartIOSDevice() {
    //IOSManager.restartDevice();
}