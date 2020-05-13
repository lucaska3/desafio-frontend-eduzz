import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import subDays from 'date-fns/subDays';
import { dateFormat, timeFormat } from 'formatters/date';
import money from 'hooks/useMask/money';
import React, { Fragment, memo, useCallback, useEffect, useState } from 'react';
import { Brush, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import cryptoService from 'services/crypto';

const BtcHistory = memo(() => {
  const [data, setData] = useState([]);
  const [date, setDate] = useState({ yesterday: '', today: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const histortSubscription = cryptoService.history().subscribe(data => {
      setData(
        data
          .map(data => {
            return {
              'Valor de compra': data.buy,
              'Valor de venda': data.sell,
              'Horário': timeFormat(data.createdAt)
            };
          })
          .reverse()
      );
      setLoading(false);
    });
    const now = new Date();
    setDate({
      yesterday: dateFormat(subDays(now, 1)),
      today: dateFormat(now)
    });
    return () => {
      histortSubscription.unsubscribe();
    };
  }, []);

  const formatMoney = useCallback((value: number) => money.apply(value), []);

  return (
    <Fragment>
      <Card>
        <CardContent>
          <Typography gutterBottom variant='h5'>
            {`Historico de Preços (${date.yesterday} - ${date.today})`}
          </Typography>
          {loading && (
            <Box height={400} display='flex' justifyContent='center' alignItems='center'>
              <CircularProgress />
            </Box>
          )}
          <Box hidden={loading}>
            <ResponsiveContainer width='100%' height={400}>
              <LineChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 30 }}>
                <XAxis dataKey='Horário' />
                <YAxis domain={['dataMin', 'dataMax']} tickFormatter={formatMoney} />
                <Tooltip formatter={formatMoney} />
                <Legend />
                <Line type='monotone' dataKey='Valor de compra' stroke='#ffa600' strokeWidth={2} />
                <Line type='monotone' dataKey='Valor de venda' stroke='#003f5c' strokeWidth={2} />
                <Brush dataKey='Horário' startIndex={100} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Fragment>
  );
});

export default BtcHistory;
