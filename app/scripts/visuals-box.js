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
      // cache: false,
      success: function(result, status, xhr) {
        result.date = xhr.getResponseHeader('Last-Modified');
        result.headers = xhr.getAllResponseHeaders();
        result.loading = false;
        this.setState(result);
      }.bind(this),
      error: function() {
        this.setState({ loading: false});
      }.bind(this)
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

  componentWillUpdate: function(props, state) {
      var hdr = state.headers.toLowerCase();
      const is_valid_visual = hdr === '' || !((hdr.indexOf('content-type: application/json') === -1) || (hdr.indexOf('last-modified: ') === -1) || (hdr.indexOf('cache-control: public, max-age=') === -1));
      this.props.onLoad(this.props.env, state.visual.version, is_valid_visual);
  },

  render: function() {
      var loadingClass = this.state.loading ? 'visual visual_loading' : 'visual';
      var hdr = this.state.headers.toLowerCase();
      const is_valid_visual = hdr === '' || !((hdr.indexOf('content-type: application/json') === -1) || (hdr.indexOf('last-modified: ') === -1) || (hdr.indexOf('cache-control: public, max-age=') === -1));

      return (
          <td className={ is_valid_visual ? '' : 'file_errorheaders'} title={this.state.headers}>
            <span>{this.state.visual.version}</span> <a target="_blank" href={this.props.url}>↑</a>
          </td>
      );
  }
});

// CDN Visual
var Visual = React.createClass({
    getInitialState: function() {
      this.checkCount = 8;
      this.checkResults = [];

      var visualDefault = {
        visual: {
          version: '-',
          date: '???'
        },
        headers: ''
      };
      return {
          result: '',
          loading: true,
      };
    },

    render: function() {
        var loadingClass = this.props.loading ? 'visual visual_loading' : 'visual';

        var versionTestGallery = this.props.visualTestGallery.visual.version;
        var versionDevGallery = this.props.visualDevGallery.visual.version;
        var versionDxtGallery = this.props.visualDxtGallery.visual.version;
        var versionProdGallery = this.props.visualProdGallery.visual.version;

        if (!!this.props.visualTestGallery.dateLastUpdated) {
          var dateTestGallery = utils.formatDate(this.props.visualTestGallery.dateLastUpdated);
        }

        if (!!this.props.visualDevGallery.dateLastUpdated) {
          var dateDevGallery = utils.formatDate(this.props.visualDevGallery.dateLastUpdated);
        }

        if (!!this.props.visualDxtGallery.dateLastUpdated) {
          var dateDxtGallery = utils.formatDate(this.props.visualDxtGallery.dateLastUpdated);
        }

        if (!!this.props.visualProdGallery.dateLastUpdated) {
          var dateProdGallery = utils.formatDate(this.props.visualProdGallery.dateLastUpdated);
        }

        const guid = this.props.visualTestGallery.visual.guid;

        var rowClass = 'visual';
        var resultMessage = '';
        switch(this.state.result) {
          case 'progress':
            rowClass += ' visual_progress';
            resultMessage = '✅  Visual version is different, it\'s traveling with trains';
            break;

          case 'diverged':
            rowClass += ' visual_diverged';
            resultMessage = '❌  Alert! Visual version is different on gallery or cdn';
            break;

          default: 
            resultMessage = '✅';
        }


        return (
            <tr className={rowClass}>
                <td>
                  <span>{this.props.visualTestGallery.visual.displayName}</span><br/>
                  <small>{this.props.visualTestGallery.visual.guid}</small>
                  <p>{resultMessage}</p>
                </td>
                <td className="separator"></td>
                <td title={'Released ' + dateTestGallery}>{versionTestGallery}</td>
                <td title={'Released ' + dateDevGallery}>{versionDevGallery}</td>
                <td title={'Released ' + dateDxtGallery}>{versionDxtGallery}</td>
                <td title={'Released ' + dateProdGallery}>{versionProdGallery}</td>
                <td className="separator"></td>
                <Cell url={`http://extendcustomvisual.blob.core.windows.net/test/${guid}.json`} env="test" onLoad={this.checkVisual}/>
                <Cell url={`http://extendcustomvisual.blob.core.windows.net/dev/${guid}.json`} env="dev" onLoad={this.checkVisual}/>
                <Cell url={`http://extendcustomvisual.blob.core.windows.net/dxt/${guid}.json`} env="dxt" onLoad={this.checkVisual}/>
                <Cell url={`http://extendcustomvisual.blob.core.windows.net/prod/${guid}.json`} env="prod" onLoad={this.checkVisual}/>
                <td className="separator"></td>
                <Cell url={`https://visuals.azureedge.net/test/${guid}.json`} env="test" onLoad={this.checkVisual}/>
                <Cell url={`https://visuals.azureedge.net/dev/${guid}.json`} env="dev" onLoad={this.checkVisual}/>
                <Cell url={`https://visuals.azureedge.net/dxt/${guid}.json`} env="dxt" onLoad={this.checkVisual}/>
                <Cell url={`https://visuals.azureedge.net/prod/${guid}.json`} env="prod" onLoad={this.checkVisual}/>
                <td className="separator"></td>
                <Cell url={`https://visuals2.azureedge.net/test/${guid}.json`} env="test" onLoad={this.checkVisual}/>
                <Cell url={`https://visuals2.azureedge.net/dev/${guid}.json`} env="dev" onLoad={this.checkVisual}/>
                <Cell url={`https://visuals2.azureedge.net/dxt/${guid}.json`} env="dxt" onLoad={this.checkVisual}/>
                <Cell url={`https://visuals2.azureedge.net/prod/${guid}.json`} env="prod" onLoad={this.checkVisual}/>
            </tr>
        );
    },

    checkVisual: function(env, version, isHeadersOk) {
      const that = this;
      const st = {};

      this.checkCount--;
      this.checkResults.push({
        env, 
        version,
        isHeadersOk
      });

      var galleryVersion = '0.0.0';

      // check results if all loaded
      if (!this.checkCount) {
        // progress check for all environvent - at least one different version
        if (
          this.props.visualTestGallery.visual.version !== this.props.visualDevGallery.visual.version
          || this.props.visualDevGallery.visual.version !== this.props.visualDxtGallery.visual.version
          || this.props.visualDxtGallery.visual.version !== this.props.visualProdGallery.visual.version
        ) {
          st.result = 'progress';
        } else {
          galleryVersion = this.props.visualTestGallery.visual.version;
          this.checkResults
            .reduce((acc, result) => {
              if (acc.version !== result.version || result.version !== galleryVersion || result.version !== galleryVersion) st.result = 'progress';
              return result
            });
        }

        // test env version divergation check
        galleryVersion =  this.props.visualTestGallery.visual.version;
        this.checkResults
          .filter(result => result.env === 'test')
          .reduce((acc, result) => {
            if (acc.version !== result.version || result.version !== galleryVersion || result.version !== galleryVersion) st.result = 'diverged';
            return result
          })

        // dev env version divergation check
        galleryVersion =  this.props.visualDevGallery.visual.version;
        this.checkResults
          .filter(result => result.env === 'dev')
          .reduce((acc, result) => {
            if (acc.version !== result.version || result.version !== galleryVersion || result.version !== galleryVersion) st.result = 'diverged';
            return result
          })

        // dxt env version divergation check
        galleryVersion =  this.props.visualDxtGallery.visual.version;
        this.checkResults
          .filter(result => result.env === 'dxt')
          .reduce((acc, result) => {
            if (acc.version !== result.version || result.version !== galleryVersion || result.version !== galleryVersion) st.result = 'diverged';
            return result
          })

        // dxt env version divergation check
        galleryVersion =  this.props.visualProdGallery.visual.version;
        this.checkResults
          .filter(result => result.env === 'prod')
          .reduce((acc, result) => {
            if (acc.version !== result.version || result.version !== galleryVersion || result.version !== galleryVersion) st.result = 'diverged';
            return result
          })

        that.setState(st)
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

        var dateTestGallery = utils.formatDate(this.props.dataTestGallery.date);
        var dateDevGallery = utils.formatDate(this.props.dataDevGallery.date);
        var dateDxtGallery = utils.formatDate(this.props.dataDxtGallery.date);
        var dateProdGallery = utils.formatDate(this.props.dataProdGallery.date);
        var dateTestCdnBlob = utils.formatDate(this.props.dataTestCdnBlob.date);
        var dateDevCdnBlob = utils.formatDate(this.props.dataDevCdnBlob.date);
        var dateDxtCdnBlob = utils.formatDate(this.props.dataDxtCdnBlob.date);
        var dateProdCdnBlob = utils.formatDate(this.props.dataProdCdnBlob.date);
        var dateTestCdn = utils.formatDate(this.props.dataTestCdn.date);
        var dateDevCdn = utils.formatDate(this.props.dataDevCdn.date);
        var dateDxtCdn = utils.formatDate(this.props.dataDxtCdn.date);
        var dateProdCdn = utils.formatDate(this.props.dataProdCdn.date);
        var dateTestCdn2 = utils.formatDate(this.props.dataTestCdn2.date);
        var dateDevCdn2 = utils.formatDate(this.props.dataDevCdn2.date);
        var dateDxtCdn2 = utils.formatDate(this.props.dataDxtCdn2.date);
        var dateProdCdn2 = utils.formatDate(this.props.dataProdCdn2.date);

        // TODO: make it on dataTestGallery or even calculate list of guids from all sources
        this.props.dataDevGallery.visuals.forEach(function(visual, i) {
            const visualTest = this.props.dataTestGallery.visuals.find((v) => visual.visual.guid === v.visual.guid) || visualDefault;
            const visualDXT = this.props.dataDxtGallery.visuals.find((v) => visual.visual.guid === v.visual.guid) || visualDefault;
            const visualProd = this.props.dataProdGallery.visuals.find((v) => visual.visual.guid === v.visual.guid) || visualDefault;
            rows.push(
              <Visual 
                visualTestGallery={visualTest} 
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
                      <th> </th>
                      <td className="separator"></td>
                      <th colSpan="4"><span>Gallery</span></th>
                      <td className="separator"></td>
                      <th colSpan="4"><span>Blob for CDN</span></th>
                      <td className="separator"></td>
                      <th colSpan="4"><span>CDN Amakai</span></th>
                      <td className="separator"></td>
                      <th colSpan="4"><span>CDN Verizon</span></th>
                    </tr>
                    <tr>
                        <th>Name</th>
                        <td className="separator"></td>
                        <th>
                          <span title={`Last modified: ${dateTestGallery}`}>test</span>
                          <a href="https://visuals.azureedge.net/gallery-test/visualCatalog.json" target="_blank" title="visualCatalog.json">↑</a>
                        </th>
                        <th>
                          <span title={`Last modified: ${dateDevGallery}`}>dev</span>
                          <a href="https://visuals.azureedge.net/gallery-dev/visualCatalog.json" target="_blank" title="visualCatalog.json">↑</a>
                        </th>
                        <th>
                          <span title={`Last modified: ${dateDxtGallery}`}>dxt</span>
                          <a href="https://visuals.azureedge.net/gallery-dxt/visualCatalog.json" target="_blank" title="visualCatalog.json">↑</a>
                        </th>
                        <th>
                          <span title={`Last modified: ${dateProdGallery}`}>prod</span>
                          <a href="https://visuals.azureedge.net/gallery-prod/visualCatalog.json" target="_blank" title="visualCatalog.json">↑</a>
                        </th>
                        <td className="separator"></td>
                        <th>
                          <span title={`Last modified: ${dateTestCdnBlob}`}>test</span>
                          <a href="http://extendcustomvisual.blob.core.windows.net/test/approvedResources.json" target="_blank" title="approvedResources.json">↑</a>
                        </th>
                        <th>
                          <span title={`Last modified: ${dateDevCdnBlob}`}>dev</span>
                          <a href="http://extendcustomvisual.blob.core.windows.net/dev/approvedResources.json" target="_blank" title="approvedResources.json">↑</a>
                        </th>
                        <th>
                          <span title={`Last modified: ${dateDxtCdnBlob}`}>dxt</span>
                          <a href="http://extendcustomvisual.blob.core.windows.net/dxt/approvedResources.json" target="_blank" title="approvedResources.json">↑</a>
                        </th>
                        <th>
                          <span title={`Last modified: ${dateProdCdnBlob}`}>prod</span>
                          <a href="http://extendcustomvisual.blob.core.windows.net/prod/approvedResources.json" target="_blank" title="approvedResources.json">↑</a>
                        </th>
                        <td className="separator"></td>
                        <th>
                          <span title={`Last modified: ${dateTestCdn}`}>test</span>
                          <a href="https://visuals.azureedge.net/test/approvedResources.json" target="_blank" title="approvedResources.json">↑</a>
                        </th>
                        <th>
                          <span title={`Last modified: ${dateDevCdn}`}>dev</span>
                          <a href="https://visuals.azureedge.net/dev/approvedResources.json" target="_blank" title="approvedResources.json">↑</a>
                        </th>
                        <th>
                          <span title={`Last modified: ${dateDxtCdn}`}>dxt</span>
                          <a href="https://visuals.azureedge.net/dxt/approvedResources.json" target="_blank" title="approvedResources.json">↑</a>
                        </th>
                        <th>
                          <span title={`Last modified: ${dateProdCdn}`}>prod</span>
                          <a href="https://visuals.azureedge.net/prod/approvedResources.json" target="_blank" title="approvedResources.json">↑</a>
                        </th>
                        <td className="separator"></td>
                        <th>
                          <span title={`Last modified: ${dateTestCdn2}`}>test</span>
                          <a href="https://visuals2.azureedge.net/test/approvedResources.json" target="_blank" title="approvedResources.json">↑</a>
                        </th>
                        <th>
                          <span title={`Last modified: ${dateDevCdn2}`}>dev</span>
                          <a href="https://visuals2.azureedge.net/dev/approvedResources.json" target="_blank" title="approvedResources.json">↑</a>
                        </th>
                        <th>
                          <span title={`Last modified: ${dateDxtCdn2}`}>dxt</span>
                          <a href="https://visuals2.azureedge.net/dxt/approvedResources.json" target="_blank" title="approvedResources.json">↑</a>
                        </th>
                        <th>
                          <span title={`Last modified: ${dateProdCdn2}`}>prod</span>
                          <a href="https://visuals2.azureedge.net/prod/approvedResources.json" target="_blank" title="approvedResources.json">↑</a>
                        </th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
                <tfoot>
                    <tr>
                        <th colSpan="14">{rows.length}</th>
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
        // cache: false,
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
        // cache: false,
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
        // cache: false,
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
        // cache: false,
        success: function(result, status, xhr) {
            st.dataProdGallery = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this)
      }),
      // blob cdn configs
      $.ajax({
        url: 'http://extendcustomvisual.blob.core.windows.net/test/approvedResources.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataTestCdnBlob = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this)
      }),
      $.ajax({
        url: 'http://extendcustomvisual.blob.core.windows.net/dev/approvedResources.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataDevCdnBlob = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this)
      }),
      $.ajax({
        url: 'http://extendcustomvisual.blob.core.windows.net/dxt/approvedResources.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataDxtCdnBlob = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this)
      }),
      $.ajax({
        url: 'http://extendcustomvisual.blob.core.windows.net/prod/approvedResources.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataProdCdnBlob = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this)
      }),
      // cdn configs
      $.ajax({
        url: 'https://visuals.azureedge.net/test/approvedResources.json',
        dataType: 'json',
        type: 'get',
        // cache: false,
        success: function(result, status, xhr) {
            st.dataTestCdn = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this)
      }),
      $.ajax({
        url: 'https://visuals.azureedge.net/dev/approvedResources.json',
        dataType: 'json',
        type: 'get',
        // cache: false,
        success: function(result, status, xhr) {
            st.dataDevCdn = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this)
      }),
      $.ajax({
        url: 'https://visuals.azureedge.net/dxt/approvedResources.json',
        dataType: 'json',
        type: 'get',
        // cache: false,
        success: function(result, status, xhr) {
            st.dataDxtCdn = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this)
      }),
      $.ajax({
        url: 'https://visuals.azureedge.net/prod/approvedResources.json',
        dataType: 'json',
        type: 'get',
        // cache: false,
        success: function(result, status, xhr) {
            st.dataProdCdn = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this)
      }),
      // cdn 2 configs
      $.ajax({
        url: 'https://visuals2.azureedge.net/test/approvedResources.json',
        dataType: 'json',
        type: 'get',
        // cache: false,
        success: function(result, status, xhr) {
            st.dataTestCdn2 = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this)
      }),
      $.ajax({
        url: 'https://visuals2.azureedge.net/dev/approvedResources.json',
        dataType: 'json',
        type: 'get',
        // cache: false,
        success: function(result, status, xhr) {
            st.dataDevCdn2 = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this)
      }),
      $.ajax({
        url: 'https://visuals2.azureedge.net/dxt/approvedResources.json',
        dataType: 'json',
        type: 'get',
        // cache: false,
        success: function(result, status, xhr) {
            st.dataDxtCdn2 = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this)
      }),
      $.ajax({
        url: 'https://visuals2.azureedge.net/prod/approvedResources.json',
        dataType: 'json',
        type: 'get',
        // cache: false,
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
      dataTestCdnBlob: {
        visuals: []
      },
      dataDevCdnBlob: {
        visuals: []
      },
      dataDxtCdnBlob: {
        visuals: []
      },
      dataProdCdnBlob: {
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
          dataTestCdnBlob={this.state.dataTestCdnBlob} 
          dataDevCdnBlob={this.state.dataDevCdnBlob} 
          dataDxtCdnBlob={this.state.dataDxtCdnBlob} 
          dataProdCdnBlob={this.state.dataProdCdnBlob} 
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