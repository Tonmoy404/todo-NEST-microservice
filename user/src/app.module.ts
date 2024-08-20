import { Module } from '@nestjs/common';
import { UserController } from './app.controller';
import { UserService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class AppModule {}
