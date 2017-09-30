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
export declare class Device implements IDevice {
    private _name;
    private _apiLevel;
    private _type;
    private _token;
    private _status;
    private _procPid;
    private _startedAt?;
    constructor(_name: string, _apiLevel: any, _type: any, _token: string, _status: string, _procPid?: any);
    name: string;
    apiLevel: any;
    token: string;
    type: any;
    procPid: any;
    status: string;
    startedAt: number;
}
