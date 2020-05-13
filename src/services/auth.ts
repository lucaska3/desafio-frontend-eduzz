import { cacheClean } from 'helpers/rxjs-operators/cache';
import { logError } from 'helpers/rxjs-operators/logError';
import IUserToken from 'interfaces/tokens/userToken';
import * as Rx from 'rxjs';
import { catchError, distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs/operators';

import apiService, { ApiService } from './api';
import tokenService, { TokenService } from './token';

export class AuthService {
  private user$: Rx.Observable<IUserToken>;
  private openLogin$: Rx.BehaviorSubject<boolean>;

  constructor(private api: ApiService, private tokenService: TokenService) {
    this.openLogin$ = new Rx.BehaviorSubject(false);

    this.user$ = this.tokenService.getToken().pipe(
      map(token => {
        if (!token) return null;

        const user = this.tokenService.decode<IUserToken>(token);
        if (!user) return null;
        return user;
      }),
      catchError(() => Rx.of(null)),
      shareReplay(1)
    );

    this.getUser()
      .pipe(
        distinctUntilChanged((a, b) => (a || ({} as IUserToken)).id !== (b || ({} as IUserToken)).id),
        cacheClean(),
        logError()
      )
      .subscribe();
  }

  public openLogin(): void {
    this.openLogin$.next(true);
  }

  public shouldOpenLogin(): Rx.Observable<boolean> {
    return this.openLogin$.asObservable();
  }

  public login(email: string, password: string): Rx.Observable<void> {
    return this.api.post('/login', { email, password }).pipe(
      switchMap(({ token }) => this.tokenService.setToken(token)),
      map(() => this.openLogin$.next(false))
    );
  }

  public logout(): Rx.Observable<void> {
    return this.tokenService.clearToken();
  }

  public getUser(): Rx.Observable<IUserToken> {
    return this.user$;
  }

  public createAccount(name: string, email: string, password: string): Rx.Observable<void> {
    return this.api.post('/account', { name, email, password });
  }

  public isAuthenticated(): Rx.Observable<boolean> {
    return this.getUser().pipe(map(user => !!user));
  }
}

const authService = new AuthService(apiService, tokenService);
export default authService;
