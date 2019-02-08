
  // onTickerChange = e => { 
  //   // different onChange event when the ticker is entered into form so we can send off an API call to auto generate the live prices for user reference. 
  //   let url = 'http://localhost:4000/api/wrapper/' + e.target.ticker;
  //   axios
  //     .get(url)
  //     .then(res0 => {
  //       const data = JSON.parse(res0.data);    
  //       this.setState({ wrapperPriceBtc: data['BTC'] });
  //       this.setState({ wrapperPriceUsd: data['USD'] }); 
  //       this.setState({ [e.target.name]: e.target.value });
  //       console.log(this.state.wrapperPriceBtc);
  //     }).catch(err => console.log(err));
  // }