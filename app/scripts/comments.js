var VisualReview = React.createClass({ 
    render: function() {
        return (
            <div>
                <p>Title: {this.props.review.title}<br></br>
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
            <div>
            <a href={"https://store.office.com/en-us/app.aspx?assetid=" + this.props.visual.assetId} >{this.props.visual.Visual}</a>
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