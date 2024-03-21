
export enum StatusCode {
    SUCCESS = 200,
    INVALID_ARGUMENTS = 300,
    EXECUTE_FAIL = 301,
    LOGIN_FAIL = 302,
}

export class ApiResult {
    code: number
    status: String
    data: any

    constructor(code: number, message: string, data: any) {
        this.data = data
        this.code = code
        this.status = message
    }

    static format(code, status, data:any) {
        return new ApiResult(code, status, data)
    }
}