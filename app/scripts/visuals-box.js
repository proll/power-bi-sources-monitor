var utils = {
  formatDate: function(date) {
    var dt = new Date(date);

    var minutes = dt.getMinutes();
    minutes = (minutes < 10) ? ('0' + minutes) :  minutes;

    var hours = dt.getHours();
    hours = (hours < 10) ? ('0' + hours) :  hours;

    var date = dt.getDate();
    date = (date < 10) ? ('0' + date) :  date;

    var date = dt.getDate();
    date = (date < 10) ? ('0' + date) :  date;
    
    var month = dt.getMonth();
    month = (month < 10) ? ('0' + month) :  month;
    
    var year = (dt.getFullYear() !== (new Date()).getFullYear()) ? '.' + dt.getFullYear() : '';

    return hours + ':' + minutes + ' ' + date + '.' + month + year;
  },
}

// CDN Visual
var Visual = React.createClass({

    loadVisualFromCDN: function() {
      $.when(
        $.ajax({
          url: 'http://visuals.azureedge.net/dev/' + this.props.visualGallery.visual.guid + '.json',
          dataType: 'json',
          type: 'get',
          cache: false,
          success: function(result, status, xhr) {
              var visual = result;
              visual.date = xhr.getResponseHeader('Last-Modified');
              this.setState({
                  visualDevCDN: visual
              });
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.visualGallery.visual.guid, status, err.toString());
          }.bind(this)
        }),
        $.ajax({
          url: 'http://visuals.azureedge.net/dxt/' + this.props.visualGallery.visual.guid + '.json',
          dataType: 'json',
          type: 'get',
          cache: false,
          success: function(result, status, xhr) {
              var visual = result;
              visual.date = xhr.getResponseHeader('Last-Modified');
              this.setState({
                  visualDxtCDN: visual
              });
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.visualGallery.visual.guid, status, err.toString());
          }.bind(this)
        }),
        $.ajax({
          url: 'http://visuals.azureedge.net/prod/' + this.props.visualGallery.visual.guid + '.json',
          dataType: 'json',
          type: 'get',
          cache: false,
          success: function(result, status, xhr) {
              var visual = result;
              visual.date = xhr.getResponseHeader('Last-Modified');
              this.setState({
                  visualProdCDN: visual
              });
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.visualGallery.visual.guid, status, err.toString());
          }.bind(this)
        })
      ).done(function() {
        this.setState({
          loading: false
        });
      }.bind(this));

    },

    getInitialState: function() {
        return {
            loading: true,
            visualGallery: this.props.visualGallery,
            visualDevCDN: this.props.visualDevCDN,
            visualDxtCDN: this.props.visualDxtCDN,
            visualProdCDN: this.props.visualProdCDN

        };
    },

    componentDidMount: function() {
      this.loadVisualFromCDN();
    },

    render: function() {
        if (this.props.visualGallery) {
          var loadingClass = this.props.loading ? 'visual visual_loading' : 'visual';

          var versionGallery = this.props.visualGallery.visual.version;


          var versionDevCDN = this.state.visualDevCDN.visual.version;
          var versionDxtCDN = this.state.visualDxtCDN.visual.version;
          var versionProdCDN = this.state.visualProdCDN.visual.version;

          var dateGallery = this.state.visualGallery.date;
          if (!!this.props.visualGallery.dateLastUpdated) {
            dateGallery = utils.formatDate(this.props.visualGallery.dateLastUpdated);
          }

          var dateDevCDN = this.state.visualDevCDN.date;
          if (!!this.state.visualDevCDN.date) {
            dateDevCDN = utils.formatDate(this.state.visualDevCDN.date);
          }

          var dateDxtCDN = this.state.visualDxtCDN.date;
          if (!!this.state.visualDxtCDN.date) {
            dateDxtCDN = utils.formatDate(this.state.visualDxtCDN.date);
          }

          var dateProdCDN = this.state.visualProdCDN.date;
          if (!!this.state.visualProdCDN.date) {
            dateProdCDN = utils.formatDate(this.state.visualProdCDN.date);
          }

          if (1 
            && versionDevCDN !== '???' 
            && versionDxtCDN !== '???' 
            && versionProdCDN !== '???' 
            && (0
                || versionGallery !== versionDevCDN
                || versionGallery !== versionDxtCDN
                || versionGallery !== versionProdCDN
              )
            ) {
            loadingClass += ' visual_diverged';
          }

          return (
              <tr className={loadingClass}>
                  <td title={this.props.visualGallery.visual.guid}>{this.props.visualGallery.visual.displayName}</td>
                  <td>{versionGallery} <small>({dateGallery})</small></td>
                  <td>{versionDevCDN} <small>({dateDevCDN})</small></td>
                  <td>{versionDxtCDN} <small>({dateDxtCDN})</small></td>
                  <td>{versionProdCDN} <small>({dateProdCDN})</small></td>
              </tr>
          );
        } else {
          return (
            <tr>
              <td>loading...</td>
            </tr>
          );
        }
    }
});

var VisualList = React.createClass({
    render: function() {
        var rows = [],
          visualCDNDefault = {
            visual: {
              version: '???',
              date: '???'
            }
          };

        this.props.data.forEach(function(visual, i) {
            rows.push(<Visual visualGallery={visual} visualDevCDN={visualCDNDefault} visualDxtCDN={visualCDNDefault} visualProdCDN={visualCDNDefault} key={i} />);
        }.bind(this));
        return (
            <table className="visual-list">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Gallery</th>
                        <th>CDN dev</th>
                        <th>CDN dxt</th>
                        <th>CDN prod</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
                <tfoot>
                    <tr>
                        <th colSpan="5">{rows.length}</th>
                    </tr>
                </tfoot>
            </table>
        );
    }
});


// Visual Box
var VisualsBox = React.createClass({
  loadVisualsFromGallery: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'get',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {data: []};
  },

  componentDidMount: function() {
    this.loadVisualsFromGallery();
  },

  render: function() {
    return (
      <div className="visuals-box">
        <h2>Gallery - CDN Custom Visuals sources monitor</h2>
        <VisualList data={this.state.data} />
      </div>
    );
  }
});

$(function() {
  ReactDOM.render(
    <VisualsBox url="https://visuals.azureedge.net/powerbi-visuals/visualCatalog.json"/>,
    document.getElementById('content')
  );
})