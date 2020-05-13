import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import bitcoin from 'hooks/useMask/bitcoin';
import React, { Fragment, memo, useCallback, useEffect, useState } from 'react';
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { map } from 'rxjs/operators';
import cryptoService from 'services/crypto';

const BtcVolume = memo(() => {
  const [volume, setVolume] = useState([{}]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const volumeSubscription = cryptoService
      .volume()
      .pipe(
        map(res => {
          return {
            'Bitcoins comprados hoje': res.buy,
            'Bitcoins vendidos hoje': res.sell,
            'title': 'Volume'
          };
        })
      )
      .subscribe(res => {
        setVolume([res]);
        setLoading(false);
      });
    return () => volumeSubscription.unsubscribe();
  }, []);

  const formatBitcoin = useCallback((value: number) => bitcoin.apply(value, 2, 2), []);

  return (
    <Fragment>
      <Card>
        <CardContent>
          <Typography gutterBottom variant='subtitle1'>
            Volume Bitcoins transacionados hoje:
          </Typography>
          {loading && (
            <Box height={190} display='flex' justifyContent='center' alignItems='center'>
              <CircularProgress />
            </Box>
          )}
          <Box hidden={loading}>
            <ResponsiveContainer width='100%' height={190}>
              <BarChart layout='vertical' data={volume} barGap={20}>
                <YAxis type='category' dataKey='title' />
                <XAxis type='number' tickFormatter={formatBitcoin} />
                <Legend />
                <Tooltip formatter={formatBitcoin} />
                <Bar dataKey='Bitcoins comprados hoje' fill='#ffa600' />
                <Bar dataKey='Bitcoins vendidos hoje' fill='#003f5c' />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Fragment>
  );
});

export default BtcVolume;
