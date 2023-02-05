export class UserData {
  userId: string = '';
  pwdOne: string = '';
  pwdTwo: string = '';
  pwdThree: string = '';

  constructor(data?: any) {
    if (!data) return;
    if (data.userId) this.userId = data.userId;
    if (data.pwdOne) this.pwdOne = data.pwdOne;
    if (data.pwdTwo) this.pwdTwo = data.pwdTwo;
    if (data.pwdThree) this.pwdThree = data.pwdThree;
  }
}
