import { IsEmail, IsNotEmpty } from "class-validator"
import { Transform } from "class-transformer"

export class UserDto {

    @IsNotEmpty({ message: "emtpy `name` is not allowed" })
    @Transform(({value}) => value.trim())
    name: string

    @IsNotEmpty({ message: "emtpy `email` is not allowed" })
    @IsEmail({}, { message: "`email` address is invalid" })
    email: string

    password: string
}