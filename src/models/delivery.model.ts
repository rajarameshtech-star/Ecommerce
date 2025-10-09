
  interface RegisterDto {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    phoneNumber: string;
    roles: string[];
    additionalData: Record<string, any>;
    vehicleNumber: string;
    licenseNumber: string;
  }