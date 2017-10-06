var VisualReview = React.createClass({
    render: function() {
        return (
            <div className="review">
                <p>Title: {this.props.review.title}<br></br>
                <RatingBar value={this.props.review.rating} size={15} scale={0.15}></RatingBar><br></br>
                {this.props.review.body}<br></br>
                Author: {this.props.review.author}<br></br>
                Date: {this.props.review.date.toLocaleString()}<br></br>
                Passed time ({this.props.review.passedTime}) {this.props.review.dateDiff.toFixed(0)}</p>
            </div>
        )
      }
});

var VisualsInfo = React.createClass({ 
    render: function() {
        return (
            <div className="visual">
            <a href={"https://store.office.com/en-us/app.aspx?assetid=" + this.props.visual.assetId} >
                <span className="visualName" >{this.props.visual.Visual}</span>
                {/* <span className={"rating"+Math.round(this.props.visual.avrRating)}> ({(this.props.visual.avrRating || 0).toFixed(1)})</span> */}
            </a>
            <RatingBar value={this.props.visual.avrRating} size={35} scale={0.3}></RatingBar>
            <ul>
                {this.props.visual.reviews.filter((rev) => !rev.comments).map(function(rev){
                return <li key={rev.reviewid}>
                        <VisualReview key={rev.reviewid} review={rev} />
                    </li>;
                })}
            </ul>
            </div>
        )
      }
});

var RatingBar = React.createClass({

    createStar: function (blueColor, index) {
        var color = (blueColor ? "blue" : "gray");
        console.log(color);
        // transform={"scale(0.3,0.3)"}
        return <g  transform={`translate(${this.props.size * index},${0})`}>
                <path 
                    transform={`translate(${-125 / (0.3 / this.props.scale)},${0})scale(${this.props.scale},${this.props.scale})`}
                    style= { {
                        "fill": color,
                        "fillOpacity" :1,
                        "fillRule": "evenodd",
                        "stroke" : "none",
                        "strokeWidth": 10,
                        "strokeLinecap": "round",
                        "strokeLinejoin": "round",
                        "strokeMiterlimit": 4,
                        "strokeDasharray": "none",
                        "strokeOpacity" : 1
                        }}
                    d="M 478.1117,4.99999 L 490.52087,43.198877 L 530.68482,43.196598 L 498.19016,66.802524 L 510.60367,105.00001 L 478.1117,81.390382 L 445.61972,105.00001 L 458.03324,66.80253 L 425.53858,43.196598 L 465.70253,43.198877 L 478.1117,4.99999 z "
                >
                </path>
            </g>
    },

    createSVG: function() {
        return <svg width={(this.props.size * 5) + "px"} height={this.props.size + "px"}>
            <g>
            {this.createStar(1 < this.props.value, 0)}
            {this.createStar(2 < this.props.value, 1)}
            {this.createStar(3 < this.props.value, 2)}
            {this.createStar(4 < this.props.value, 3)}
            {this.createStar(5 <= this.props.value, 4)}
            </g>
        </svg>
    },

    render: function() {
        return this.createSVG();
    }
    //TODO create bar with star
    //<path 
    // xmlns="http://www.w3.org/2000/svg" style="fill:gray;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:10;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 478.1117,4.99999 L 490.52087,43.198877 L 530.68482,43.196598 L 498.19016,66.802524 L 510.60367,105.00001 L 478.1117,81.390382 L 445.61972,105.00001 L 458.03324,66.80253 L 425.53858,43.196598 L 465.70253,43.198877 L 478.1117,4.99999 z "/>
})

var VisualsList = React.createClass({ 
    render: function() {
        return (
          <ul>
            {this.props.visuals.map(function(viz){
              return <li key={viz.assetid}>
                    <VisualsInfo key={viz.assetid} visual={viz} />
                  </li>;
            })}
          </ul>
        )
      }
});

$(function() {

    $.ajax({
        url: "/uncommented",
        dataType: 'json',
        type: 'get',
        success: function(result, status, xhr) {            
            ReactDOM.render(
                <VisualsList visuals={result} />,
                document.getElementById('content')
            );          
        }.bind(this),
        error: function() {
            
        }.bind(this)
    });

    
  })