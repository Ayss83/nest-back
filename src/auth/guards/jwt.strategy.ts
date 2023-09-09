import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        '3b21ddf7dc5fc901c2ceae4ecba090da3344d63232feb74faac601336e4830c8',
    });
  }

  async validate(payload: any) {
    return { ...payload.user }
  }
}
