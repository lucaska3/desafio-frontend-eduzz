import IBtcHistory from 'interfaces/models/btcHistory';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import apiService, { ApiService } from './api';

export class CryptoService {
  constructor(private apiService: ApiService) {}

  public buyPrice = new BehaviorSubject<number>(0);
  public sellPrice = new BehaviorSubject<number>(0);
  public getBuyPrice = this.buyPrice.asObservable();
  public getSellPrice = this.sellPrice.asObservable();

  public price(): Observable<{ buy: number; sell: number }> {
    return this.apiService.get('/btc/price').pipe(
      map(response => {
        this.buyPrice.next(response.buy);
        this.sellPrice.next(response.sell);
        return {
          buy: response.buy,
          sell: response.sell
        };
      })
    );
  }

  public balance(): Observable<number> {
    return this.apiService.get('/btc').pipe(
      map((response: Array<any>) => {
        if (response.length < 1) return 0;
        return response.map((data: any) => data.currentBtcAmount).reduce((acc: number, data: number) => acc + data);
      })
    );
  }
  public history(): Observable<Array<IBtcHistory>> {
    let now = new Date();
    const oneDay = 60 * 60 * 24 * 1000;
    return this.apiService.get('/history').pipe(map(res => res.filter((res: any) => +now - +res.createdAt < oneDay)));
  }

  public volume(): Observable<{ buy: number; sell: number }> {
    return this.apiService.get('/volume').pipe(
      map(response => {
        return {
          buy: response.buy,
          sell: response.sell
        };
      })
    );
  }

  public position(): Observable<number> {
    return this.apiService.get('/btc');
  }

  public buy(value: number): Observable<number> {
    return this.apiService.post('/btc/purchase', { amount: value });
  }

  public sell(value: number): Observable<number> {
    return this.apiService.post('/btc/sell', { amount: value });
  }
}

const cryptoService = new CryptoService(apiService);
export default cryptoService;
