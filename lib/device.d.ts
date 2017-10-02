export interface IDevice {
    name: string;
    token: string;
    type: string;
    status?: string;
    startedAt?: number;
    procPid?: number;
    apiLevel?: string;
    info?: string;
    config?: string;
}
export declare class Device implements IDevice {
    private _name;
    private _apiLevel;
    private _type;
    private _token;
    private _status;
    private _procPid;
    private _startedAt?;
    private _info?;
    private _config?;
    constructor(_name: string, _apiLevel: string, _type: string, _token: string, _status: string, _procPid?: any);
    name: string;
    apiLevel: string;
    token: string;
    type: string;
    procPid: any;
    status: string;
    startedAt: number;
    info: string;
    config: string;
    toJson(): {
        name: string;
        token: string;
        type: string;
        status: string;
        startedAt: number;
        procPid: any;
        apiLevel: string;
    };
}
