**REQUISIÇÕES POR RXJS**
*Para resultado unico*
# getter
  public balance(): Observable<number> {
    return this.apiService.get('/account/balance').pipe(
      map(response => {
        return response.balance;
      })
    );
  }
# setter
  useEffect(() => {
    AccountService.balance().subscribe(data => {
      console.log(data);
    });
  }, []);