import { Status } from "./status";
export interface IDevice {
    name: string;
    token: string;
    type: string;
    status?: Status;
    startedAt?: number;
    procPid?: number;
    platformVersion?: number;
}
