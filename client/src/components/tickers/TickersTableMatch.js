import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';

class TickersTableMatch extends Component {
    state = {
        products: ['one', 'two', 'three']
    }
    
  render() {
    const columns = [{
        dataField: 'buyId',
        text: 'buyID'
      }, {
        dataField: 'sellId',
        text: 'sellId'
      }, {
        dataField: 'matchId',
        text: 'matchId'
      }, {
        dataField: 'completed',
        text: 'completed'
      }, {
        dataField: 'inCompletedTrades',
        text: 'inCompletedTrades'
      }, {
        dataField: 'amount',
        text: 'amount'
      }, {
        dataField: 'priceBtc',
        text: 'priceBtc'
      }, {
        dataField: 'priceUsd',
        text: 'priceUsd'
      }, {
        dataField: 'totalBtc',
        text: 'totalBtc'
      }, {
        dataField: 'totalUsd',
        text: 'totalUsd'
      }, {
        dataField: 'date',
        text: 'date'
      }, {
        dataField: 'exchange',
        text: 'exchange'
      }, {
        dataField: 'notes',
        text: 'notes'
      }];


    return (
      <div>
        <div className='scroll-style'>
          <BootstrapTable keyField='id' data={ this.state.products } columns={ columns } striped />
        </div>
      </div>
    )
  }
}

export default TickersTableMatch;