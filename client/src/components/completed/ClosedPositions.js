import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import '../../App.css';


class ClosedPositions extends Component {
    state = {
        products: [
          {
            tradeId: 1, 
            buyId: 'bitcoin',
            sellId: 'btc', 
            type: 1, 
            ticker: 3400,
            realisedPlBtc: 100, 
            realisedPlUsd: 100, 
            amount: 340000, 
            totalCostBtc: 90, 
            totalCostUsd: 1000, 
            totalSaleBtc: 1, 
            totalSaleUsd: 1, 
            averageBuyPriceBtc: 1, 
            averageBuyPriceUsd: 1, 
            averageSellPriceBtc: 'No',
            averageSellPriceUsd: 1, 
            mostRecentBuyDate: 1, 
            firstSellDate: 1, 
            tradeDuration: 2, 
            isCapitalGain: 'Notes', 
            buyCommissionCostBtc: 1, 
            buyCommissionCostUsd: 1, 
            sellCommissionCostBtc: 1, 
            sellCommissionCostUsd: 1, 
            totalCommissionCostBtc: 1,
            totalCommissionCostUsd: 1, 
            exchangesUsed: 1,
            notes: 'notes'
          }, 
        ]
    }
    
  render() {
    const data = this.state.products
    const columns = [{
        dataField: 'tradeId',
        text: 'trade id'
      }, {
        dataField: 'buyId',
        text: 'buy id'
      }, {
        dataField: 'sellId',
        text: 'sell id'
      }, {
        dataField: 'type',
        text: 'type'
      }, {
        dataField: 'ticker',
        text: 'ticker'
      }, {
        dataField: 'realisedPlBtc',
        text: 'Realised P/L BTC'
      }, {
        dataField: 'realisedPlUsd',
        text: 'Realised P/L USD'
      }, {
        dataField: 'amount',
        text: 'Amount'
      }, {
        dataField: 'totalCostBtc',
        text: 'Total Cost BTC'
      }, {
        dataField: 'totalCostUsd',
        text: 'Total Cost USD'
      }, {
        dataField: 'totalSaleBtc',
        text: 'Total Sale BTC'
      }, {
        dataField: 'totalSaleUsd',
        text: 'Total Sale USD'
      }, {
        dataField: 'averageBuyPriceBtc',
        text: 'Average Buy Price BTC'
      }, {
        dataField: 'averageBuyPriceUsd',
        text: 'Average Buy Price USD'
      }, {
        dataField: 'averageSellPriceBtc',
        text: 'Average Sell Price BTC'
      }, {
        dataField: 'averageSellPriceUsd',
        text: 'Average Sell Price USD'
      }, {
        dataField: 'mostRecentBuyDate',
        text: 'Most Recent Buy Date'
      }, {
        dataField: 'firstSellDate',
        text: 'First Sell Date'
      }, {
        dataField: 'tradeDuration',
        text: 'Trade Duration'
      }, {
        dataField: 'isCapitalGain',
        text: 'Is Capital Gain?'
      }, {
        dataField: 'buyCommissionCostBtc',
        text: 'Buy Commission Cost BTC'
      }, {
        dataField: 'buyCommissionCostUsd',
        text: 'Buy Commission Cost USD'
      }, {
        dataField: 'sellCommissionCostBtc',
        text: 'Sell Commission Cost BTC'
      }, {
        dataField: 'sellCommissionCostUsd',
        text: 'Sell Commission Cost USD'
      }, {
        dataField: 'totalCommissionCostBtc',
        text: 'Total Commission Cost BTC'
      }, {
        dataField: 'totalCommissionCostUsd',
        text: 'Total Commission Cost USD'
      }, {
        dataField: 'exchangesUsed',
        text: 'Exchanges Used'
      }, {
        dataField: 'notes',
        text: 'Notes'
      }
    ];
    return (
      <div>
        <div className='scroll-style'>
          <BootstrapTable keyField='ID' data={ data } columns={ columns } />
        </div>
      </div>
    );
  }
}

export default ClosedPositions;