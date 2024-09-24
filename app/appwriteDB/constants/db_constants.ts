import {APPWRITE_AVATAR_BUCKETS_ID, APPWRITE_ENDPOINT, APPWRITE_POST_ASSETS_BUCKET_ID } from "../../appwrite/appWriteConfig"

export const appWriteStorage = {
    avatarUrl: `${APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_AVATAR_BUCKETS_ID}/files`,
    assetsUrl: `${APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_POST_ASSETS_BUCKET_ID}/files`
}