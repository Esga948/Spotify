export interface JwtResp {
    dataUser: {
        id: string,
        name: string,
        email: string,
        aToken: string,
        expiresIn: string,
    }
}
