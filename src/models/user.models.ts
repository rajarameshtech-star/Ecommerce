export interface registerDto {
    email : string,
    password : string,
    roles : string[]
}

export interface loginDto{
    email :string,
    password : string
}


export interface Address {
    id: string | null;
    vtc:string;
    pin:number;
    landmark:string;
    phoneNumber:string;
    apartment:string;
    type: "Home" | "Work" | "Other";
    userId:string | null;
}