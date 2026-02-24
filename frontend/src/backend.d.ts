import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface CreativeProject {
    id: string;
    status: ProjectStatus;
    title: string;
    creator: Principal;
    amazonUploadTimestamp?: bigint;
    createdAt: Time;
    description: string;
    updatedAt: Time;
    completionTimestamp: bigint;
    images: Array<ExternalBlob>;
}
export type Time = bigint;
export enum ProjectStatus {
    done = "done",
    inProgress = "inProgress",
    approvalPending = "approvalPending"
}
export interface backendInterface {
    createProject(id: string, title: string, description: string, completionTimestamp: bigint, amazonUploadTimestamp: bigint | null, images: Array<ExternalBlob>, status: ProjectStatus): Promise<void>;
    deleteProject(id: string): Promise<void>;
    getAllProjects(): Promise<Array<CreativeProject>>;
    getProject(id: string): Promise<CreativeProject>;
    getProjectsByCreator(creator: Principal): Promise<Array<CreativeProject>>;
    updateProject(id: string, title: string, description: string, completionTimestamp: bigint, amazonUploadTimestamp: bigint | null, images: Array<ExternalBlob>, status: ProjectStatus): Promise<void>;
}
