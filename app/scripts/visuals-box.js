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
          url: 'https://visuals.azureedge.net/dev/' + this.props.visualDevGallery.visual.guid + '.json',
          dataType: 'json',
          type: 'get',
          cache: false,
          success: function(result, status, xhr) {
            var visual = result;
            visual.date = xhr.getResponseHeader('Last-Modified');
            visual.headers = xhr.getAllResponseHeaders();
            st.visualDevCDN = visual;
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.visualDevGallery.visual.guid, status, err.toString());
          }.bind(this)
        }),
        $.ajax({
          url: 'https://visuals.azureedge.net/dxt/' + this.props.visualDevGallery.visual.guid + '.json',
          dataType: 'json',
          type: 'get',
          cache: false,
          success: function(result, status, xhr) {
            var visual = result;
            visual.date = xhr.getResponseHeader('Last-Modified');
            visual.headers = xhr.getAllResponseHeaders();
            st.visualDxtCDN = visual;
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.visualDevGallery.visual.guid, status, err.toString());
          }.bind(this)
        }),
        $.ajax({
          url: 'https://visuals.azureedge.net/prod/' + this.props.visualDevGallery.visual.guid + '.json',
          dataType: 'json',
          type: 'get',
          cache: false,
          success: function(result, status, xhr) {
            var visual = result;
            visual.date = xhr.getResponseHeader('Last-Modified');
            visual.headers = xhr.getAllResponseHeaders();
            st.visualProdCDN = visual;
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.visualDevGallery.visual.guid, status, err.toString());
          }.bind(this)
        }),
        $.ajax({
          url: 'https://visuals2.azureedge.net/dev/' + this.props.visualDevGallery.visual.guid + '.json',
          dataType: 'json',
          type: 'get',
          cache: false,
          success: function(result, status, xhr) {
            var visual = result;
            visual.date = xhr.getResponseHeader('Last-Modified');
            visual.headers = xhr.getAllResponseHeaders();
            st.visualDevCDN2 = visual;
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.visualDevGallery.visual.guid, status, err.toString());
          }.bind(this)
        }),
        $.ajax({
          url: 'https://visuals2.azureedge.net/dxt/' + this.props.visualDevGallery.visual.guid + '.json',
          dataType: 'json',
          type: 'get',
          cache: false,
          success: function(result, status, xhr) {
            var visual = result;
            visual.date = xhr.getResponseHeader('Last-Modified');
            visual.headers = xhr.getAllResponseHeaders();
            st.visualDxtCDN2 = visual;
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.visualDevGallery.visual.guid, status, err.toString());
          }.bind(this)
        }),
        $.ajax({
          url: 'https://visuals2.azureedge.net/prod/' + this.props.visualDevGallery.visual.guid + '.json',
          dataType: 'json',
          type: 'get',
          cache: false,
          success: function(result, status, xhr) {
            var visual = result;
            visual.date = xhr.getResponseHeader('Last-Modified');
            visual.headers = xhr.getAllResponseHeaders();
            st.visualProdCDN2 = visual;
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
      var visualDefault = {
        visual: {
          version: '-',
          date: '???'
        },
        headers: ''
      };
      return {
          loading: true,
          visualDevGallery: this.props.visualDevGallery,
          visualDxtGallery: this.props.visualDxtGallery,
          visualProdGallery: this.props.visualProdGallery,
          visualDevCDN: visualDefault,
          visualDxtCDN: visualDefault,
          visualProdCDN: visualDefault,
          visualDevCDN2: visualDefault,
          visualDxtCDN2: visualDefault,
          visualProdCDN2: visualDefault


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

          var versionDevCDN2 = this.state.visualDevCDN2.visual.version;
          var versionDxtCDN2 = this.state.visualDxtCDN2.visual.version;
          var versionProdCDN2 = this.state.visualProdCDN2.visual.version;

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

          var dateDevCDN2 = this.state.visualDevCDN2.date;
          if (!!this.state.visualDevCDN2.date) {
            dateDevCDN2 = utils.formatDate(this.state.visualDevCDN2.date);
          }

          var dateDxtCDN2 = this.state.visualDxtCDN2.date;
          if (!!this.state.visualDxtCDN2.date) {
            dateDxtCDN2 = utils.formatDate(this.state.visualDxtCDN2.date);
          }

          var dateProdCDN2 = this.state.visualProdCDN2.date;
          if (!!this.state.visualProdCDN2.date) {
            dateProdCDN2 = utils.formatDate(this.state.visualProdCDN2.date);
          }


          if (
                versionDevGallery !== versionDevCDN
                || versionDxtGallery !== versionDxtCDN
                || versionProdGallery !== versionProdCDN
                || versionDevGallery !== versionDevCDN2
                || versionDxtGallery !== versionDxtCDN2
                || versionProdGallery !== versionProdCDN2
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

          var strt = '';
          strt = this.state.visualDevCDN.headers.toLowerCase();
          var validDevCDN = strt === '' || !((strt.indexOf('content-type: application/json') === -1) || (strt.indexOf('last-modified: ') === -1) || (strt.indexOf('cache-control: public, max-age=') === -1));
          strt = this.state.visualDxtCDN.headers.toLowerCase();
          var validDxtCDN = strt === '' || !((strt.indexOf('content-type: application/json') === -1) || (strt.indexOf('last-modified: ') === -1) || (strt.indexOf('cache-control: public, max-age=') === -1));
          strt = this.state.visualProdCDN.headers.toLowerCase();
          var validProdCDN = strt === '' || !((strt.indexOf('content-type: application/json') === -1) || (strt.indexOf('last-modified: ') === -1) || (strt.indexOf('cache-control: public, max-age=') === -1));
          strt = this.state.visualDevCDN2.headers.toLowerCase();
          var validDevCDN2 = strt === '' || !((strt.indexOf('content-type: application/json') === -1) || (strt.indexOf('last-modified: ') === -1) || (strt.indexOf('cache-control: public, max-age=') === -1));
          strt = this.state.visualDxtCDN2.headers.toLowerCase();
          var validDxtCDN2 = strt === '' || !((strt.indexOf('content-type: application/json') === -1) || (strt.indexOf('last-modified: ') === -1) || (strt.indexOf('cache-control: public, max-age=') === -1));
          strt = this.state.visualProdCDN2.headers.toLowerCase();
          var validProdCDN2 = strt === '' || !((strt.indexOf('content-type: application/json') === -1) || (strt.indexOf('last-modified: ') === -1) || (strt.indexOf('cache-control: public, max-age=') === -1));

          return (
              <tr className={loadingClass}>
                  <td title={this.props.visualDevGallery.visual.guid}>{this.props.visualDevGallery.visual.displayName}</td>
                  <td title={'Released ' + dateDevGallery}>{versionDevGallery}</td>
                  <td title={'Released ' + dateDxtGallery}>{versionDxtGallery}</td>
                  <td title={'Released ' + dateProdGallery}>{versionProdGallery}</td>
                  <td title={'Last Modified: ' + dateDevCDN} className={ validDevCDN ? '' : 'file_errorheaders'}>
                    <span>{versionDevCDN}</span>
                    <pre>{this.state.visualDevCDN.headers}</pre>
                  </td>
                  <td title={'Last Modified: ' + dateDxtCDN} className={ validDxtCDN ? '' : 'file_errorheaders'}>
                    <span>{versionDxtCDN}</span>
                    <pre>{this.state.visualDxtCDN.headers}</pre>
                  </td>
                  <td title={'Last Modified: ' + dateProdCDN} className={ validProdCDN ? '' : 'file_errorheaders'}>
                    <span>{versionProdCDN}</span>
                    <pre>{this.state.visualProdCDN.headers}</pre>
                  </td>
                  <td title={'Last Modified: ' + dateDevCDN2} className={ validDevCDN2 ? '' : 'file_errorheaders'}>
                    <span>{versionDevCDN2}</span>
                    <pre>{this.state.visualDevCDN2.headers}</pre>
                  </td>
                  <td title={'Last Modified: ' + dateDxtCDN2} className={ validDxtCDN2 ? '' : 'file_errorheaders'}>
                    <span>{versionDxtCDN2}</span>
                    <pre>{this.state.visualDxtCDN2.headers}</pre>
                  </td>
                  <td title={'Last Modified: ' + dateProdCDN2} className={ validProdCDN2 ? '' : 'file_errorheaders'}>
                    <span>{versionProdCDN2}</span>
                    <pre>{this.state.visualProdCDN2.headers}</pre>
                  </td>
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
        var dateDevCdn2 = utils.formatDate(this.props.dataDevCdn2.date);
        var dateDxtCdn2 = utils.formatDate(this.props.dataDxtCdn2.date);
        var dateProdCdn2 = utils.formatDate(this.props.dataProdCdn2.date);

        this.props.dataDevGallery.visuals.forEach(function(visual, i) {
            const visualDXT = this.props.dataDxtGallery.visuals.find((v) => visual.visual.guid === v.visual.guid) || visualDefault;
            const visualProd = this.props.dataProdGallery.visuals.find((v) => visual.visual.guid === v.visual.guid) || visualDefault;
            rows.push(
              <Visual 
                visualDevGallery={visual} 
                visualDxtGallery={visualDXT} 
                visualProdGallery={visualProd}
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
                        <th>CDN2 dev <small>{dateDevCdn2}</small></th>
                        <th>CDN2 dxt <small>{dateDxtCdn2}</small></th>
                        <th>CDN2 prod <small>{dateProdCdn2}</small></th>
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
        url: 'https://visuals.azureedge.net/gallery-dev/visualCatalog.json',
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
        url: 'https://visuals.azureedge.net/gallery-dxt/visualCatalog.json',
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
        url: 'https://visuals.azureedge.net/gallery-prod/visualCatalog.json',
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
        url: 'https://visuals.azureedge.net/dev/approvedResources.json',
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
        url: 'https://visuals.azureedge.net/dxt/approvedResources.json',
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
        url: 'https://visuals.azureedge.net/prod/approvedResources.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataProdCdn = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('prod', err.toString());
        }.bind(this)
      }),
      // cdn 2 configs
      $.ajax({
        url: 'https://visuals2.azureedge.net/dev/approvedResources.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataDevCdn2 = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('dev', status, err.toString());
        }.bind(this)
      }),
      $.ajax({
        url: 'https://visuals2.azureedge.net/dxt/approvedResources.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataDxtCdn2 = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('dxt', status, err.toString());
        }.bind(this)
      }),
      $.ajax({
        url: 'https://visuals2.azureedge.net/prod/approvedResources.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataProdCdn2 = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
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
      dataDevCdn2: {
        visuals: []
      },
      dataDxtCdn2: {
        visuals: []
      },
      dataProdCdn2: {
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
          dataDevCdn2={this.state.dataDevCdn2} 
          dataDxtCdn2={this.state.dataDxtCdn2} 
          dataProdCdn2={this.state.dataProdCdn2} 
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