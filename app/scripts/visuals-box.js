var utils = {
  formatDate: function(date) {
    if (!date) return '';

    var dt = new Date(date);

    var minutes = dt.getMinutes();
    minutes = (minutes < 10) ? ('0' + minutes) :  minutes;

    var hours = dt.getHours();
    hours = (hours < 10) ? ('0' + hours) :  hours;

    var date = dt.getDate();
    date = (date < 10) ? ('0' + date) :  date;
    
    var month = dt.getMonth() + 1;
    month = (month < 10) ? ('0' + month) :  month;
    
    var year = (dt.getFullYear() !== (new Date()).getFullYear()) ? '/' + dt.getFullYear() : '';

    return date + '/' + month + year + ' ' + hours + ':' + minutes;
  },
}

// CDN Visual
var Visual = React.createClass({

    loadVisualFromCDN: function() {
      const st = {};
      $.when(
        $.ajax({
          url: 'http://visuals.azureedge.net/dev/' + this.props.visualDevGallery.visual.guid + '.json',
          dataType: 'json',
          type: 'get',
          cache: false,
          success: function(result, status, xhr) {
            var visual = result;
            visual.date = xhr.getResponseHeader('Last-Modified');
            st.visualDevCDN = visual;
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.visualDevGallery.visual.guid, status, err.toString());
          }.bind(this)
        }),
        $.ajax({
          url: 'http://visuals.azureedge.net/dxt/' + this.props.visualDevGallery.visual.guid + '.json',
          dataType: 'json',
          type: 'get',
          cache: false,
          success: function(result, status, xhr) {
            var visual = result;
            visual.date = xhr.getResponseHeader('Last-Modified');
            st.visualDxtCDN = visual;
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.visualDevGallery.visual.guid, status, err.toString());
          }.bind(this)
        }),
        $.ajax({
          url: 'http://visuals.azureedge.net/prod/' + this.props.visualDevGallery.visual.guid + '.json',
          dataType: 'json',
          type: 'get',
          cache: false,
          success: function(result, status, xhr) {
            var visual = result;
            visual.date = xhr.getResponseHeader('Last-Modified');
            st.visualProdCDN = visual;
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.visualDevGallery.visual.guid, status, err.toString());
          }.bind(this)
        })
      ).always(function() {
        st.loading = false;
        this.setState(st);
      }.bind(this));

    },

    getInitialState: function() {
        return {
            loading: true,
            visualDevGallery: this.props.visualDevGallery,
            visualDxtGallery: this.props.visualDxtGallery,
            visualProdGallery: this.props.visualProdGallery,
            visualDevCDN: this.props.visualDevCDN,
            visualDxtCDN: this.props.visualDxtCDN,
            visualProdCDN: this.props.visualProdCDN

        };
    },

    componentDidMount: function() {
      this.loadVisualFromCDN();
    },

    render: function() {
        if (this.props.visualDevGallery) {
          var loadingClass = this.props.loading ? 'visual visual_loading' : 'visual';

          var versionDevGallery = this.props.visualDevGallery.visual.version;
          var versionDxtGallery = this.props.visualDxtGallery.visual.version;
          var versionProdGallery = this.props.visualProdGallery.visual.version;

          var versionDevCDN = this.state.visualDevCDN.visual.version;
          var versionDxtCDN = this.state.visualDxtCDN.visual.version;
          var versionProdCDN = this.state.visualProdCDN.visual.version;

          var dateDevGallery = this.state.visualDevGallery.date;
          if (!!this.props.visualDevGallery.dateLastUpdated) {
            dateDevGallery = utils.formatDate(this.props.visualDevGallery.dateLastUpdated);
          }

          var dateDxtGallery = this.state.visualDxtGallery.date;
          if (!!this.props.visualDxtGallery.dateLastUpdated) {
            dateDxtGallery = utils.formatDate(this.props.visualDxtGallery.dateLastUpdated);
          }

          var dateProdGallery = this.state.visualProdGallery.date;
          if (!!this.props.visualProdGallery.dateLastUpdated) {
            dateProdGallery = utils.formatDate(this.props.visualProdGallery.dateLastUpdated);
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

          if (
                versionDevGallery !== versionDevCDN
                || versionDxtGallery !== versionDxtCDN
                || versionProdGallery !== versionProdCDN
            ) {
            loadingClass += ' visual_diverged';
          }

          if (
                versionDevGallery !== versionDxtGallery
                || versionDevGallery !== versionProdGallery
                || versionDxtGallery !== versionProdGallery
            ) {
            loadingClass += ' visual_progress';
          }

          return (
              <tr className={loadingClass}>
                  <td title={this.props.visualDevGallery.visual.guid}>{this.props.visualDevGallery.visual.displayName}</td>
                  <td title={'Released ' + dateDevGallery}>{versionDevGallery}</td>
                  <td title={'Released ' + dateDxtGallery}>{versionDxtGallery}</td>
                  <td title={'Released ' + dateProdGallery}>{versionProdGallery}</td>
                  <td title={'Last Modified: ' + dateDevCDN}>{versionDevCDN}</td>
                  <td title={'Last Modified: ' + dateDxtCDN}>{versionDxtCDN}</td>
                  <td title={'Last Modified: ' + dateProdCDN}>{versionProdCDN}</td>
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
          visualDefault = {
            visual: {
              version: '-',
              date: '???'
            }
          };

        var dateDevGallery = utils.formatDate(this.props.dataDevGallery.date);
        var dateDxtGallery = utils.formatDate(this.props.dataDxtGallery.date);
        var dateProdGallery = utils.formatDate(this.props.dataProdGallery.date);
        var dateDevCdn = utils.formatDate(this.props.dataDevCdn.date);
        var dateDxtCdn = utils.formatDate(this.props.dataDxtCdn.date);
        var dateProdCdn = utils.formatDate(this.props.dataProdCdn.date);

        this.props.dataDevGallery.visuals.forEach(function(visual, i) {
            const visualDXT = this.props.dataDxtGallery.visuals.find((v) => visual.visual.guid === v.visual.guid) || visualDefault;
            const visualProd = this.props.dataProdGallery.visuals.find((v) => visual.visual.guid === v.visual.guid) || visualDefault;
            rows.push(
              <Visual 
                visualDevGallery={visual} 
                visualDxtGallery={visualDXT} 
                visualProdGallery={visualProd} 
                visualDevCDN={visualDefault} 
                visualDxtCDN={visualDefault} 
                visualProdCDN={visualDefault} 
                key={i} />
            );
        }.bind(this));
        return (
            <table className="visual-list">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Gallery dev <small>{dateDevGallery}</small></th>
                        <th>Gallery dxt <small>{dateDxtGallery}</small></th>
                        <th>Gallery prod <small>{dateProdGallery}</small></th>
                        <th>CDN dev <small>{dateDevCdn}</small></th>
                        <th>CDN dxt <small>{dateDxtCdn}</small></th>
                        <th>CDN prod <small>{dateProdCdn}</small></th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
                <tfoot>
                    <tr>
                        <th colSpan="7">{rows.length}</th>
                    </tr>
                </tfoot>
            </table>
        );
    }
});


// Visual Box
var VisualsBox = React.createClass({
  loadVisualsFromGallery: function() {
    const st = {}
    $.when(
      // gallery configs
      $.ajax({
        url: 'http://visuals.azureedge.net/gallery-dev/visualCatalog.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataDevGallery = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('dev', status, err.toString());
        }.bind(this)
      }),
      $.ajax({
        url: 'http://visuals.azureedge.net/gallery-dxt/visualCatalog.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataDxtGallery = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('dxt', status, err.toString());
        }.bind(this)
      }),
      $.ajax({
        url: 'http://visuals.azureedge.net/gallery-prod/visualCatalog.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataProdGallery = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('prod', err.toString());
        }.bind(this)
      }),
      // cdn configs
      $.ajax({
        url: 'http://visuals.azureedge.net/dev/approvedResources.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataDevCdn = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('dev', status, err.toString());
        }.bind(this)
      }),
      $.ajax({
        url: 'http://visuals.azureedge.net/dxt/approvedResources.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataDxtCdn = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('dxt', status, err.toString());
        }.bind(this)
      }),
      $.ajax({
        url: 'http://visuals.azureedge.net/prod/approvedResources.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataProdCdn = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('prod', err.toString());
        }.bind(this)
      })
    ).done(function() {
      st.loading = false;
      this.setState(st);
    }.bind(this));
  },

  getInitialState: function() {
    return {
      dataDevGallery: {
        visuals: []
      },
      dataDxtGallery: {
        visuals: []
      },
      dataProdGallery: {
        visuals: []
      },
      dataDevCdn: {
        visuals: []
      },
      dataDxtCdn: {
        visuals: []
      },
      dataProdCdn: {
        visuals: []
      },
    };
  },

  componentDidMount: function() {
    this.loadVisualsFromGallery();
  },

  render: function() {
    return (
      <div className="visuals-box">
        <h2>Gallery - CDN Custom Visuals sources monitor</h2>
        <VisualList 
          dataDevGallery={this.state.dataDevGallery} 
          dataDxtGallery={this.state.dataDxtGallery} 
          dataProdGallery={this.state.dataProdGallery} 
          dataDevCdn={this.state.dataDevCdn} 
          dataDxtCdn={this.state.dataDxtCdn} 
          dataProdCdn={this.state.dataProdCdn} 
        />
      </div>
    );
  }
});

$(function() {
  ReactDOM.render(
    <VisualsBox/>,
    document.getElementById('content')
  );
})