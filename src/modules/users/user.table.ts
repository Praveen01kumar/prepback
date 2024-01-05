/* eslint-disable prettier/prettier */
// import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';
// import { v4 as uuidv4 } from 'uuid';
// import { Role } from 'src/enum/users.enum';

// @Table
// export class User extends Model<User> {

//     @PrimaryKey
//     @Default(() => uuidv4())
//     @Column({
//         type: DataType.UUID,
//         allowNull: false,
//         defaultValue: () => uuidv4(),
//     })
//     id: string;

//     @Column({
//         type: DataType.STRING,
//         allowNull: false,
//     })
//     first_name: string;

//     @Column({
//         type: DataType.STRING,
//         allowNull: false,
//     })
//     last_name: string;

//     @Column({
//         type: DataType.STRING,
//         unique: true,
//         allowNull: false,
//     })
//     email: string;

//     @Column({
//         type: DataType.STRING,
//         unique: true,
//         allowNull: false,
//     })
//     username: string;

//     @Column({
//         type: DataType.STRING,
//         allowNull: false,
//     })
//     password: string;

//     @Column({
//         type: DataType.STRING,
//         allowNull: false,
//     })
//     profile_img: string;

//     @Column({
//         type: DataType.STRING,
//         allowNull: false,
//     })
//     phone: string;

//     @Column({
//         type: DataType.STRING,
//         allowNull: false,
//     })
//     address: string;

//     @Column({
//         type: DataType.STRING,
//         allowNull: false,
//     })
//     city: string;

//     @Column({
//         type: DataType.STRING,
//         allowNull: false,
//     })
//     state: string;

//     @Column({
//         type: DataType.STRING,
//         allowNull: false,
//     })
//     zip_code: string;

//     @Column({
//         type: DataType.STRING,
//         allowNull: false,
//     })
//     country: string;

//     @Column({
//         type: DataType.DATE,
//         allowNull: false,
//     })
//     birth_date: Date;

//     @Column({
//         type: DataType.STRING,
//         allowNull: false,
//     })
//     site_url: string;

//     @Column({
//         type: DataType.ENUM,
//         values: ['male', 'female'],
//         allowNull: false,
//     })
//     gender: string;

//     @Default(Role?.USER)
//     @Column({
//         type: DataType.ENUM,
//         values: ['user', 'admin', 'super_admin'],
//         allowNull: false,
//     })
//     role: string;

//     @Default('::1')
//     @Column({
//         type: DataType.STRING,
//         allowNull: false,
//     })
//     ip: string;

// }



/* eslint-disable prettier/prettier */
import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Gender, Role } from 'src/enum/users.enum';

@Table
export class User extends Model<User> {

    @PrimaryKey
    @Default(() => uuidv4())
    @Column({
        type: DataType.UUID,
        allowNull: false,
        defaultValue: () => uuidv4(),
    })
    id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    first_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    last_name: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    username: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    profile_img: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    phone: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    address: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    city: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    state: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    zip_code: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    country: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    birth_date: Date;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    site_url: string;

    @Default(Gender?.MALE)
    @Column({
        type: DataType.ENUM,
        values: ['male', 'female'],
        allowNull: true,
    })
    gender: string;

    @Default(Role?.USER)
    @Column({
        type: DataType.ENUM,
        values: ['user', 'admin', 'super_admin'],
        allowNull: false,
    })
    role: string;

    @Default('::1')
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    ip: string;

}