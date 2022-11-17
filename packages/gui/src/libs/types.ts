export interface S3Package {
    slug: string,
    version: string,
    full_name: string,
    name: string,
    maintainer: string,
    homepage: string,
    // key: string,
    last_modified: Date | string,
}