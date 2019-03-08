import React, { Component } from "react";

import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const axios = require("axios");

const DoughnutChart = require("react-chartjs").Doughnut;


class Pie extends Component {

    state = {
        data: []
    }

    componentDidMount() {
        axios.get('http://localhost:4000/api/users/retrieve-user/' + this.props.auth.user.id)
        .then(res => {
            let pieData = [];
            let pieObj = {};
            const dataToUse = res.data.portfolioSheet[0];
            for (const i of dataToUse) {
                pieObj.value = i.totalUsd;
                pieObj.label = i.ticker;
                pieData.push(pieObj);
                pieObj = {};
            }
            this.setState({data: pieData});
        })
        .catch(err => console.log(err));
    }


    render() {
        
        const chartOptions = {
            //Boolean - Whether we should show a stroke on each segment
            segmentShowStroke : true,
        
            //String - The colour of each segment stroke
            segmentStrokeColor : "#fff",
        
            //Number - The width of each segment stroke
            segmentStrokeWidth : 4,
        
            //Number - The percentage of the chart that we cut out of the middle
            percentageInnerCutout : 40, // This is 0 for Pie charts
        
            //Number - Amount of animation steps
            animationSteps : 100,
        
            //String - Animation easing effect
            animationEasing : "easeOutBounce",
        
            //Boolean - Whether we animate the rotation of the Doughnut
            animateRotate : true,
        
            //Boolean - Whether we animate scaling the Doughnut from the centre
            animateScale : false,
        };

        return(
            <div className='donut-size'>
                <DoughnutChart data={this.state.data} options={chartOptions} width="1000" height="500"/>
            </div>
        )
    }
}


      
Pie.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  }
  
  const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
  });
  
  export default connect(mapStateToProps)(Pie);