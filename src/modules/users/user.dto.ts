/* eslint-disable prettier/prettier */
// import { IsNotEmpty, MinLength, IsEmail, IsEnum, MaxLength } from 'class-validator';
// import { Gender, Role } from 'src/enum/users.enum';

// export class UserDto {

//     @IsNotEmpty()
//     readonly first_name: string;

//     @IsNotEmpty()
//     readonly last_name: string;

//     @IsNotEmpty()
//     @IsEmail()
//     readonly email: string;

//     @IsNotEmpty()
//     readonly username: string;

//     @IsNotEmpty()
//     @MinLength(6)
//     @MaxLength(14)
//     readonly password: string;

//     profile_img: string;

//     @IsNotEmpty()
//     @MinLength(8)
//     @MaxLength(14)
//     readonly phone: string;

//     @IsNotEmpty()
//     readonly address: string;

//     @IsNotEmpty()
//     readonly city: string;

//     @IsNotEmpty()
//     readonly state: string;

//     @IsNotEmpty()
//     @MinLength(5)
//     @MaxLength(6)
//     readonly zip_code: string;

//     @IsNotEmpty()
//     readonly country: string;

//     @IsNotEmpty()
//     readonly birth_date: Date;

//     @IsNotEmpty()
//     readonly site_url: string;

//     @IsNotEmpty()
//     @IsEnum(Gender, {
//         message: 'gender must be either male or female',
//     })
//     readonly gender: Gender;

//     @IsNotEmpty()
//     @IsEnum(Role, {
//         message: 'Role must be either user, admin or super_admin',
//     })
//     readonly role: Role = Role?.USER;

//     @IsNotEmpty()
//     readonly ip: string = '::1';

// }


/* eslint-disable prettier/prettier */
import { IsNotEmpty, MinLength, IsEmail, IsEnum, MaxLength } from 'class-validator';
import { Gender, Role } from 'src/enum/users.enum';

export class UserDto {

    @IsNotEmpty()
    readonly first_name: string;

    @IsNotEmpty()
    readonly last_name: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    readonly username: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(14)
    readonly password: string;
    readonly profile_img: string;
    readonly phone: string;
    readonly address: string;
    readonly city: string;
    readonly state: string;
    readonly zip_code: string;
    readonly country: string;
    readonly birth_date: Date;
    readonly site_url: string;

    @IsEnum(Gender, {
        message: 'gender must be either male or female',
    })
    readonly gender: Gender = Gender?.MALE;

    @IsNotEmpty()
    @IsEnum(Role, {
        message: 'Role must be either user, admin or super_admin',
    })
    readonly role: Role = Role?.USER;

    @IsNotEmpty()
    readonly ip: string = '::1';

}