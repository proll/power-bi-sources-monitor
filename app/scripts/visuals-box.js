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

var Cell = React.createClass({
  load: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'get',
      cache: false,
      success: function(result, status, xhr) {
        result.date = xhr.getResponseHeader('Last-Modified');
        result.headers = xhr.getAllResponseHeaders();
        this.setState(result);
      }.bind(this)
      // ,
      // complete: function() {checkQueue()}.bind(this)
    });
  },

  getInitialState: function() {
    return {
        loading: true,
        visual: {
          version: '-',
        },
        date: '',
        headers: ''
    };
  },

  componentDidMount: function() {
    this.load();
  },

  render: function() {
      var loadingClass = this.props.loading ? 'visual visual_loading' : 'visual';

      var strt = '';
      strt = this.state.headers.toLowerCase();
      const is_valid_visual = strt === '' || !((strt.indexOf('content-type: application/json') === -1) || (strt.indexOf('last-modified: ') === -1) || (strt.indexOf('cache-control: public, max-age=') === -1));

      return (
          <td title={`Last Modified: ${utils.formatDate(this.state.date)}`} className={ is_valid_visual ? '' : 'file_errorheaders'}>
            <span>{this.state.visual.version}</span> <a target="_blank" href={this.props.url}>↑</a>
            <pre>{this.state.headers}</pre>
          </td>
      );
  }
});

// CDN Visual
var Visual = React.createClass({
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
          visualTestGallery: this.props.visualTestGallery,
          visualDevGallery: this.props.visualDevGallery,
          visualDxtGallery: this.props.visualDxtGallery,
          visualProdGallery: this.props.visualProdGallery
      };
    },

    render: function() {
        var loadingClass = this.props.loading ? 'visual visual_loading' : 'visual';

        var versionTestGallery = this.props.visualTestGallery.visual.version;
        var versionDevGallery = this.props.visualDevGallery.visual.version;
        var versionDxtGallery = this.props.visualDxtGallery.visual.version;
        var versionProdGallery = this.props.visualProdGallery.visual.version;

        var dateTestGallery = this.state.visualTestGallery.date;
        if (!!this.props.visualTestGallery.dateLastUpdated) {
          dateTestGallery = utils.formatDate(this.props.visualTestGallery.dateLastUpdated);
        }

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

        // if (
        //       versionDevGallery !== versionDevCDN
        //       || versionDxtGallery !== versionDxtCDN
        //       || versionProdGallery !== versionProdCDN
        //       || versionDevGallery !== versionDevCDN2
        //       || versionDxtGallery !== versionDxtCDN2
        //       || versionProdGallery !== versionProdCDN2
        //   ) {
        //   loadingClass += ' visual_diverged';
        // }

        // if (
        //       versionDevGallery !== versionDxtGallery
        //       || versionDevGallery !== versionProdGallery
        //       || versionDxtGallery !== versionProdGallery
        //   ) {
        //   loadingClass += ' visual_progress';
        // }

        // if (this.props.visualDevGallery.visual.guid == 'PyramidChartCollabion1473456433387') {
        //   console.log(this.state);
        // }
        // 
        const guid = this.props.visualTestGallery.visual.guid;

        return (
            <tr className={loadingClass}>
                <td>
                  <span>{this.props.visualTestGallery.visual.displayName}</span><br/>
                  <small>{this.props.visualTestGallery.visual.guid}</small>
                </td>
                <td title={'Released ' + dateTestGallery}>{versionTestGallery}</td>
                <td title={'Released ' + dateDevGallery}>{versionDevGallery}</td>
                <td title={'Released ' + dateDxtGallery}>{versionDxtGallery}</td>
                <td title={'Released ' + dateProdGallery}>{versionProdGallery}</td>
                <Cell url={`https://visuals.azureedge.net/test/${guid}.json`}/>
                <Cell url={`https://visuals.azureedge.net/dev/${guid}.json`}/>
                <Cell url={`https://visuals.azureedge.net/dxt/${guid}.json`}/>
                <Cell url={`https://visuals.azureedge.net/prod/${guid}.json`}/>
                <Cell url={`https://visuals2.azureedge.net/test/${guid}.json`}/>
                <Cell url={`https://visuals2.azureedge.net/dev/${guid}.json`}/>
                <Cell url={`https://visuals2.azureedge.net/dxt/${guid}.json`}/>
                <Cell url={`https://visuals2.azureedge.net/prod/${guid}.json`}/>
            </tr>
        );
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

        var dateTestGallery = utils.formatDate(this.props.dataTestGallery.date);
        var dateDevGallery = utils.formatDate(this.props.dataDevGallery.date);
        var dateDxtGallery = utils.formatDate(this.props.dataDxtGallery.date);
        var dateProdGallery = utils.formatDate(this.props.dataProdGallery.date);
        var dateTestCdn = utils.formatDate(this.props.dataTestCdn.date);
        var dateDevCdn = utils.formatDate(this.props.dataDevCdn.date);
        var dateDxtCdn = utils.formatDate(this.props.dataDxtCdn.date);
        var dateProdCdn = utils.formatDate(this.props.dataProdCdn.date);
        var dateTestCdn2 = utils.formatDate(this.props.dataTestCdn2.date);
        var dateDevCdn2 = utils.formatDate(this.props.dataDevCdn2.date);
        var dateDxtCdn2 = utils.formatDate(this.props.dataDxtCdn2.date);
        var dateProdCdn2 = utils.formatDate(this.props.dataProdCdn2.date);

        this.props.dataTestGallery.visuals.forEach(function(visual, i) {
            const visualDev = this.props.dataDxtGallery.visuals.find((v) => visual.visual.guid === v.visual.guid) || visualDefault;
            const visualDXT = this.props.dataDxtGallery.visuals.find((v) => visual.visual.guid === v.visual.guid) || visualDefault;
            const visualProd = this.props.dataProdGallery.visuals.find((v) => visual.visual.guid === v.visual.guid) || visualDefault;
            rows.push(
              <Visual 
                visualTestGallery={visual} 
                visualDevGallery={visualDev} 
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
                        <th>Gallery test <small>{dateTestGallery}</small></th>
                        <th>Gallery dev <small>{dateDevGallery}</small></th>
                        <th>Gallery dxt <small>{dateDxtGallery}</small></th>
                        <th>Gallery prod <small>{dateProdGallery}</small></th>
                        <th>CDN test <small>{dateTestCdn}</small></th>
                        <th>CDN dev <small>{dateDevCdn}</small></th>
                        <th>CDN dxt <small>{dateDxtCdn}</small></th>
                        <th>CDN prod <small>{dateProdCdn}</small></th>
                        <th>CDN2 test <small>{dateTestCdn2}</small></th>
                        <th>CDN2 dev <small>{dateDevCdn2}</small></th>
                        <th>CDN2 dxt <small>{dateDxtCdn2}</small></th>
                        <th>CDN2 prod <small>{dateProdCdn2}</small></th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
                <tfoot>
                    <tr>
                        <th colSpan="10">{rows.length}</th>
                    </tr>
                </tfoot>
            </table>
        );
    }
});


// Visual Box
var VisualsBox = React.createClass({
  loadVisualConfigs: function() {
    const st = {}
    $.when(
      // gallery configs
      $.ajax({
        url: 'https://visuals.azureedge.net/gallery-test/visualCatalog.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataTestGallery = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('test', status, err.toString());
        }.bind(this)
      }),
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
        }.bind(this)
      }),
      // cdn configs
      $.ajax({
        url: 'https://visuals.azureedge.net/test/approvedResources.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataTestCdn = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this)
      }),
      $.ajax({
        url: 'https://visuals.azureedge.net/dev/approvedResources.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataDevCdn = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this)
      }),
      $.ajax({
        url: 'https://visuals.azureedge.net/dxt/approvedResources.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataDxtCdn = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this)
      }),
      $.ajax({
        url: 'https://visuals.azureedge.net/prod/approvedResources.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataProdCdn = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this)
      }),
      // cdn 2 configs
      $.ajax({
        url: 'https://visuals2.azureedge.net/test/approvedResources.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataTestCdn2 = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this)
      }),
      $.ajax({
        url: 'https://visuals2.azureedge.net/dev/approvedResources.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataDevCdn2 = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this)
      }),
      $.ajax({
        url: 'https://visuals2.azureedge.net/dxt/approvedResources.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataDxtCdn2 = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this)
      }),
      $.ajax({
        url: 'https://visuals2.azureedge.net/prod/approvedResources.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataProdCdn2 = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this)
      })
    ).done(function() {
      st.loading = false;
      this.setState(st);
    }.bind(this));
  },

  getInitialState: function() {
    return {
      dataTestGallery: {
        visuals: []
      },
      dataDevGallery: {
        visuals: []
      },
      dataDxtGallery: {
        visuals: []
      },
      dataProdGallery: {
        visuals: []
      },
      dataTestCdn: {
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
      dataTestCdn2: {
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
    this.loadVisualConfigs();
  },

  render: function() {
    return (
      <div className="visuals-box">
        <h2>Gallery - CDN Custom Visuals sources monitor</h2>
        <VisualList 
          dataTestGallery={this.state.dataTestGallery} 
          dataDevGallery={this.state.dataDevGallery} 
          dataDxtGallery={this.state.dataDxtGallery} 
          dataProdGallery={this.state.dataProdGallery} 
          dataTestCdn={this.state.dataTestCdn} 
          dataDevCdn={this.state.dataDevCdn} 
          dataDxtCdn={this.state.dataDxtCdn} 
          dataProdCdn={this.state.dataProdCdn} 
          dataTestCdn2={this.state.dataTestCdn2} 
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