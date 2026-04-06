import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt,Strategy } from "passport-jwt";
// import {WinstonLogger}
import { jwtConstants } from "./jwt.constants";
import { NullTypes } from "@prisma/client/runtime/client";

const cookieExtractor = (req: any): string | null => {
  if(req&&req.cookies){
        return req.cookies['access_token'];
  }
  return null;
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
     super({
        jwtFromRequest:cookieExtractor,
        ignoreExpiration:false,
              secretOrKey: jwtConstants.secret!,
     });
    }
    async validate(payload:any) {
        return {
            // userId:payload.sub,
            // // email:payload.email,
            // role:payload.role
            // console
            
            id: payload.id,
            name: payload.name,
            role: payload.role,
       };
     

    }
}