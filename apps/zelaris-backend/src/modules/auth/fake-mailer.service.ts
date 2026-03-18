import { Injectable } from '@nestjs/common';

@Injectable()
export class FakeMailerService {
  sendPasswordRecoveryEmail(email: string, resetLink: string): void {
    console.log('===== EMAIL DE RECUPERAÇÃO DE SENHA =====');
    console.log(`Para: ${email}`);
    console.log(`Link de recuperação: ${resetLink}`);
    console.log('==========================================');
  }
}
