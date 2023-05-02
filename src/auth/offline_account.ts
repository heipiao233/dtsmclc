import { createHash } from "crypto";
import * as uuid from "uuid";
import { Launcher } from "../launcher";
import { Account } from "./account";
import { UserData } from "./user_data";
export class OfflineAccount implements Account<UserData> {
    constructor (public data: UserData, private launcher: Launcher) {
    }

    async getLaunchGameArgs (): Promise<Map<string, string>> {
        const map: Map<string, string> = new Map();
        map.set("auth_access_token", "IT_WORKS");
        map.set("auth_session", "IT_WORKS");
        map.set("auth_player_name", this.data.name!);
        map.set("user_type", "mojang");
        map.set("user_properties", "{}");
        return map;
    }

    async prepareLaunch (): Promise<void> {
        // We don't need to do anything when use this method.
    }

    async getLaunchJVMArgs (): Promise<string[]> {
        return [];
    }

    getUserExtraContent(): Record<string, string> {
        return {
            username: this.launcher.i18n("accounts.offline.username")
        };
    }

    async readUserExtraContent (content: Map<string, string>): Promise<void> {
        this.data.name = content.get("username") ?? "Steve";
    }

    async check (): Promise<boolean> {
        return true;
    }

    getUUID (): string {
        return this.data.uuid === undefined ? genUUID("OfflinePlayer:".concat(this.data.name!)) : this.data.uuid;
    }

    toString (): string {
        return `${this.data.name} (${this.launcher.i18n("accounts.offline.name")})`;
    }
}

function genUUID (name: string): string {
    const arr = [];
    for (let i = 0, j = name.length; i < j; ++i) {
        arr.push(name.charCodeAt(i));
    }

    let bytes = new Uint8Array(arr);
    bytes = createHash("md5").update(bytes).digest();
    bytes[6] = bytes[6] & 0x0f | 0x30;
    bytes[8] = bytes[8] & 0x3f | 0x80;
    return uuid.stringify(bytes).replaceAll("-", "");
}
