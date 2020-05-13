import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import apiService, { ApiService } from './api';

export class AccountService {
  constructor(private apiService: ApiService) {}

  public balance(): Observable<number> {
    return this.apiService.get('/account/balance').pipe(
      map(response => {
        return response.balance;
      })
    );
  }

  public deposit(value: number): Observable<number> {
    return this.apiService.post('/account/deposit', { amount: value });
  }
}

const accountService = new AccountService(apiService);
export default accountService;
