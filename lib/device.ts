import { Status } from "./status";

export interface IDevice {
  name: string,
  token: string,
  type: string
  status?: string,
  startedAt?: number,
  procPid?: number,
  apiLevel?: string
}

export class Device implements IDevice {
  private _startedAt?: number;

  constructor(private _name: string, private _apiLevel: string, private _type: string, private _token: string, private _status: string, private _procPid?) {
    this._startedAt = -1;
  }

  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
  }

  set apiLevel(api) {
    this._apiLevel = api;
  }

  get apiLevel() {
    return this._apiLevel;
  }

  set token(token) {
    this._token = token;
  }

  get token() {
    return this._token;
  }

  set type(type) {
    this._type = type;
  }

  get type() {
    return this._type;
  }

  set procPid(proc) {
    this._procPid = proc;
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

  get startedAt() {
    return this._startedAt;
  }

  set startedAt(startedAt) {
    this._startedAt = startedAt;
  }

  public toJson() {
    return {
      name: this.name,
      token: this.token,
      type: this.type,
      status: this.status,
      startedAt: this.startedAt,
      procPid: this.procPid,
      apiLevel: this.apiLevel
    }
  }
}