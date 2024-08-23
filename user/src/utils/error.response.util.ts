import { InternalServerErrorException } from '@nestjs/common';

export class ErrorResponse {
  static handleError(err: any, action: string) {
    if (!(err instanceof InternalServerErrorException)) {
      throw err;
    } else {
      throw new InternalServerErrorException(`An error occurred -> ${action}`);
    }
  }
}
