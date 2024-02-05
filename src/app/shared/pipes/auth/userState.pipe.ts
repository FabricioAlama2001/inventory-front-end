import {Pipe, PipeTransform} from '@angular/core';
import {UserModel} from "@models/auth";

@Pipe({
  name: 'userState'
})
export class UserStatePipe implements PipeTransform {

  transform(user: UserModel): string {
    if (user.suspendedAt) return 'danger';

    if (user.maxAttempts === 0) return 'warning';

    return 'success';
  }

}
