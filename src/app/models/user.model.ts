export interface Usuario {
    usuario: string;
    empresa: string;
}

export interface LoginResponse {
    message: string;
    usuario: string;
    empresa: string
}

export interface ChangePasswordPayload {
    usuario: string;
    currentPassword: string;
    newPassword: string;
}

export interface ChangePasswordResponse {
    message: string;
}


export interface Periodo {
    ID: number;
    PERIODO: string;
    FECHA_INICIO: string;
    FECHA_FINAL: string;
}

export interface Parametrizacion {
    id: number;
    parametro: string;
    valor: number;
    fechaInicio: Date;
    fechaFinal: Date;
}
