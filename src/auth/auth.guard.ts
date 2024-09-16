import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private JwtService: JwtService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    try {
      const token = request.cookies['access_token'];
      return this.JwtService.verify(token);
    } catch (err) {
      return false;
    }
  }
}
