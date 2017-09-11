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

var CellGallery = React.createClass({
  getInitialState: function() {
    return {
        loading: false,
        visual: {
          version: '-',
        },
        date: !!this.props.visual.dateLastUpdated ? utils.formatDate(this.props.visual.dateLastUpdated) : '',
        headers: ''
    };
  },

  componentWillMount: function(props, state) {
      this.props.onLoad('gallery', this.props.env, this.props.visual.visual.version, '', this.props.visual.visual.displayName);
  },

  render: function() {
      var cellClass = this.state.loading ? 'cell cell_loading' : 'cell';
      cellClass += this.props.visual.metadata ? ' cell_pbiviz-tools' : '';
      return (
          <td className={cellClass} title={`Released: ${this.state.date}`}>
            <a target="_blank" href={this.props.url}>{this.props.visual.visual.version}</a>
            {}
          </td>
      );
  }
});

var CellCDN = React.createClass({
  load: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'get',
      // beforeSend: function(xhr) {
      //   xhr.setRequestHeader( "Pragma", "no-cache" );
      //   xhr.setRequestHeader( "Cache-Control", "no-cache" );
      //   xhr.setRequestHeader( "Expires", 0 );
      // },
      // cache: this.props.cache,
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
          displayName: ''
        },
        date: '',
        headers: ''
    };
  },

  componentDidMount: function() {
    this.load();
  },

  componentWillUpdate: function(props, state) {
      this.props.onLoad('cdn', this.props.env, state.visual.version, state.headers, state.visual.displayName, !!state.metadata, this.props.apiVersion);
  },

  render: function() {
      let cellClass = this.state.loading ? 'cell cell_loading' : 'cell';
      cellClass += this.props.apiVersion ? ' cell-cdn_pbiviz-tools' : '';
      return (
          <td className={cellClass} title={this.state.headers}>
            <a target="_blank" href={this.props.url}>{this.state.visual.version}</a>
            {this.props.apiVersion ? <small>v{this.props.apiVersion}</small> : ''}
          </td>
      );
  }
});


// CDN Visual
var Visual = React.createClass({
    getInitialState: function() {
      this.checkCount = 25;
      this.checkResults = [];
      this.displayName = '';

      return {
          result: '',
          loading: true,
      };
    },

    renderBadges: function(cdnOnly) {
      if (cdnOnly)
        return <mark>cdn</mark>;
      else 
        return <span><mark>gallery</mark><mark>cdn</mark></span>;
    },

    isPhantomJSApproved: function() {
      if ( (this.props.visualDevCdnBlob || {}).phantomJSApproved &&
        (this.props.visualDxtCdnBlob || {}).phantomJSApproved &&
        (this.props.visualMsitCdnBlob || {}).phantomJSApproved &&
        (this.props.visualProdCdnBlob || {}).phantomJSApproved &&
        (this.props.visualDevCdn || {}).phantomJSApproved &&
        (this.props.visualDxtCdn || {}).phantomJSApproved &&
        (this.props.visualMsitCdn || {}).phantomJSApproved &&
        (this.props.visualProdCdn || {}).phantomJSApproved &&
        (this.props.visualDevCdn2 || {}).phantomJSApproved &&
        (this.props.visualDxtCdn2 || {}).phantomJSApproved &&
        (this.props.visualMsitCdn2 || {}).phantomJSApproved &&
        (this.props.visualProdCdn2 || {}).phantomJSApproved ) {
         return "✅PhantomJS approved package"
       }
       else 
       if ( (this.props.visualDevCdnBlob || {}).phantomJSApproved ||
          (this.props.visualDxtCdnBlob || {}).phantomJSApproved ||
          (this.props.visualMsitCdnBlob || {}).phantomJSApproved ||
          (this.props.visualProdCdnBlob || {}).phantomJSApproved ||
          (this.props.visualDevCdn || {}).phantomJSApproved ||
          (this.props.visualDxtCdn || {}).phantomJSApproved ||
          (this.props.visualMsitCdn || {}).phantomJSApproved ||
          (this.props.visualProdCdn || {}).phantomJSApproved ||
          (this.props.visualDevCdn2 || {}).phantomJSApproved ||
          (this.props.visualDxtCdn2 || {}).phantomJSApproved ||
          (this.props.visualMsitCdn2 || {}).phantomJSApproved ||
          (this.props.visualProdCdn2 || {}).phantomJSApproved ) {
           return "❌Not in all CDNs PhantomJS approved package"
       }

      return "⛔No PhantomJS";
    },

    render: function() {
        const guid = this.props.guid;

        var rowClass = 'visual';
        var resultMessage = '';
        switch(this.state.result) {
          case 'progress':
            rowClass += ' visual_progress';
            resultMessage = '✅  Visual version is different, it\'s traveling with trains';
            break;

          case 'diverged test':
            rowClass += ' visual_diverged';
            resultMessage = '❌ test alert! Visual version is different on gallery or cdn';
            break;

          case 'diverged dev':
            rowClass += ' visual_diverged';
            resultMessage = '❌ dev alert! Visual version is different on gallery or cdn';
            break;

          case 'diverged dxt':
            rowClass += ' visual_diverged';
            resultMessage = '❌ dxt alert! Visual version is different on gallery or cdn';
            break;

          case 'diverged msit':
            rowClass += ' visual_diverged';
            resultMessage = '❌ msit alert! Visual version is different on gallery or cdn';
            break;

          case 'diverged prod':
            rowClass += ' visual_diverged';
            resultMessage = '❌ prod alert! Visual version is different on gallery or cdn';
            break;

          case 'headers':
            rowClass += ' visual_headers';
            resultMessage = '❌ Error in headers!';
            break;

          case 'diverged api':
            rowClass += ' visual_diverged';
            resultMessage = '❌ inconsistent version in approvedResources for visual package';
            break;

          default: 
            resultMessage = '✅ Same version in all CDNs';
        }

        if (this.props.cdnOnly) rowClass += ' visual_cdnonly';

        var isPhantomJSApprovedMessage = this.isPhantomJSApproved();

        return (
            <tr className={rowClass}>
                <td className="c5">
                  <span>{this.displayName}</span><br/>
                  <small><a target="_blank" href={`https://app.powerbi.com/visuals/show/${guid}`}>{guid}</a></small>
                  <p>{this.renderBadges(this.props.cdnOnly)}</p>
                  <p>{resultMessage}</p>
                  <p>{isPhantomJSApprovedMessage}</p>
                </td>
                <td className="separator"></td>
                <CellCDN url={`http://extendcustomvisual.blob.core.windows.net/dev/${guid}.json`} env="dev" onLoad={this.checkVisual} cache={false} apiVersion={this.props.versionDevCdnBlob}/>
                <CellCDN url={`http://extendcustomvisual.blob.core.windows.net/dxt/${guid}.json`} env="dxt" onLoad={this.checkVisual} cache={false} apiVersion={this.props.versionDxtCdnBlob}/>
                <CellCDN url={`http://extendcustomvisual.blob.core.windows.net/msit/${guid}.json`} env="msit" onLoad={this.checkVisual} cache={false} apiVersion={this.props.versionMsitCdnBlob}/>
                <CellCDN url={`http://extendcustomvisual.blob.core.windows.net/prod/${guid}.json`} env="prod" onLoad={this.checkVisual} cache={false} apiVersion={this.props.versionProdCdnBlob}/>
                <td className="separator"></td>
                <CellCDN url={`https://visuals.azureedge.net/dev/${guid}.json`} env="dev" onLoad={this.checkVisual} cache={true} apiVersion={this.props.versionDevCdn}/>
                <CellCDN url={`https://visuals.azureedge.net/dxt/${guid}.json`} env="dxt" onLoad={this.checkVisual} cache={true} apiVersion={this.props.versionDxtCdn}/>
                <CellCDN url={`https://visuals.azureedge.net/msit/${guid}.json`} env="msit" onLoad={this.checkVisual} cache={true} apiVersion={this.props.versionMsitCdn}/>
                <CellCDN url={`https://visuals.azureedge.net/prod/${guid}.json`} env="prod" onLoad={this.checkVisual} cache={true} apiVersion={this.props.versionProdCdn}/>
                <td className="separator"></td>
                <CellCDN url={`https://visuals2.azureedge.net/dev/${guid}.json`} env="dev" onLoad={this.checkVisual} cache={true} apiVersion={this.props.versionDevCdn2}/>
                <CellCDN url={`https://visuals2.azureedge.net/dxt/${guid}.json`} env="dxt" onLoad={this.checkVisual} cache={true} apiVersion={this.props.versionDxtCdn2}/>
                <CellCDN url={`https://visuals2.azureedge.net/msit/${guid}.json`} env="msit" onLoad={this.checkVisual} cache={true} apiVersion={this.props.versionMsitCdn2}/>
                <CellCDN url={`https://visuals2.azureedge.net/prod/${guid}.json`} env="prod" onLoad={this.checkVisual} cache={true} apiVersion={this.props.versionProdCdn2}/>
            </tr>
        );
    },

    checkVisual: function(type, env, version, headers, displayName, isNewApi, apiVersion) {
      const that = this;
      const st = {};

      // put displayName from a request for sources
      if (displayName && !this.displayName) this.displayName = displayName;

      this.checkCount--;

      // ignore gallery cells if this.props.cdnOnly
      if (!this.props.cdnOnly || (this.props.cdnOnly && type === 'cdn')) {
        this.checkResults.push({
          type,
          env, 
          version,
          headers,
          isNewApi,
          apiVersion
        });
      }

      var galleryVersion = '0.0.0';

      // check results if all loaded
      if (!this.checkCount) {
        // progress check for all environvent - at least one different version
        if (
          this.props.visualTestGalleryBlob.visual.version !== this.props.visualDevGalleryBlob.visual.version
          || this.props.visualDevGalleryBlob.visual.version !== this.props.visualDxtGalleryBlob.visual.version
          || this.props.visualDxtGalleryBlob.visual.version !== this.props.visualMsitGalleryBlob.visual.version
          || this.props.visualMsitGalleryBlob.visual.version !== this.props.visualProdGalleryBlob.visual.version
        ) {
          st.result = 'progress';
        }

        // test env version divergation check
        this.checkResults
          .filter(result => result.env === 'test')
          .reduce((acc, result) => {
            if (acc.version !== result.version) st.result = 'diverged test';
            return result
          })

        // dev env version divergation check
        this.checkResults
          .filter(result => result.env === 'dev')
          .reduce((acc, result) => {
            if (acc.version !== result.version) st.result = 'diverged dev';
            return result
          })

        // dxt env version divergation check
        this.checkResults
          .filter(result => result.env === 'dxt')
          .reduce((acc, result) => {
            if (acc.version !== result.version) st.result = 'diverged dxt';
            return result
          })

        // msit env version divergation check
        this.checkResults
          .filter(result => result.env === 'msit')
          .reduce((acc, result) => {
            if (acc.version !== result.version) st.result = 'diverged msit';
            return result
          })

        // prod env version divergation check
        this.checkResults
          .filter(result => result.env === 'prod')
          .reduce((acc, result) => {
            if (acc.version !== result.version) st.result = 'diverged prod';
            return result
          })

        this.checkResults
          .reduce((acc, result) => {
            if (acc) {
                var hdr = headers.toLowerCase();
                var is_valid = (hdr === '' || !((hdr.indexOf('content-type: application/json') === -1) || (hdr.indexOf('last-modified: ') === -1) || (hdr.indexOf('cache-control: public, max-age=') === -1)));
                if (!is_valid) {
                  st.result = 'headers';
                  return false;
                } else {
                  return result;
                }
            }
            return acc
          })

        // test for apiVersion in approvedResorces and new api of package
        this.checkResults
          .filter(result => result.type === 'cdn')
          .reduce((acc, result) => {
            if ((!acc.isNewApi && !!acc.apiVersion) || (acc.isNewApi && !acc.apiVersion)) st.result = 'diverged api';
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

        const dateDevGalleryBlob = utils.formatDate(this.props.dataDevGalleryBlob.date);
        const dateDxtGalleryBlob = utils.formatDate(this.props.dataDxtGalleryBlob.date);
        const dateMsitGalleryBlob = utils.formatDate(this.props.dataMsitGalleryBlob.date);
        const dateProdGalleryBlob = utils.formatDate(this.props.dataProdGalleryBlob.date);
        const dateTestGallery = utils.formatDate(this.props.dataTestGallery.date);
        const dateDevGallery = utils.formatDate(this.props.dataDevGallery.date);
        const dateDxtGallery = utils.formatDate(this.props.dataDxtGallery.date);
        const dateMsitGallery = utils.formatDate(this.props.dataMsitGallery.date);
        const dateProdGallery = utils.formatDate(this.props.dataProdGallery.date);
        const dateTestCdnBlob = utils.formatDate(this.props.dataTestCdnBlob.date);
        const dateDevCdnBlob = utils.formatDate(this.props.dataDevCdnBlob.date);
        const dateDxtCdnBlob = utils.formatDate(this.props.dataDxtCdnBlob.date);
        const dateMsitCdnBlob = utils.formatDate(this.props.dataMsitCdnBlob.date);
        const dateProdCdnBlob = utils.formatDate(this.props.dataProdCdnBlob.date);
        const dateTestCdn = utils.formatDate(this.props.dataTestCdn.date);
        const dateDevCdn = utils.formatDate(this.props.dataDevCdn.date);
        const dateDxtCdn = utils.formatDate(this.props.dataDxtCdn.date);
        const dateMsitCdn = utils.formatDate(this.props.dataMsitCdn.date);
        const dateProdCdn = utils.formatDate(this.props.dataProdCdn.date);
        const dateTestCdn2 = utils.formatDate(this.props.dataTestCdn2.date);
        const dateDevCdn2 = utils.formatDate(this.props.dataDevCdn2.date);
        const dateDxtCdn2 = utils.formatDate(this.props.dataDxtCdn2.date);
        const dateMsitCdn2 = utils.formatDate(this.props.dataMsitCdn2.date);
        const dateProdCdn2 = utils.formatDate(this.props.dataProdCdn2.date);

        // get all unique guids from all platforms
        const guidsHash = {};

        // gallery guids
        this.props.dataDevGalleryBlob.visuals.forEach(v => guidsHash[v.visual.guid] = true);
        this.props.dataDxtGalleryBlob.visuals.forEach(v => guidsHash[v.visual.guid] = true);
        this.props.dataMsitGalleryBlob.visuals.forEach(v => guidsHash[v.visual.guid] = true);
        this.props.dataProdGalleryBlob.visuals.forEach(v => guidsHash[v.visual.guid] = true);
        this.props.dataTestGallery.visuals.forEach(v => guidsHash[v.visual.guid] = true);
        this.props.dataDevGallery.visuals.forEach(v => guidsHash[v.visual.guid] = true);
        this.props.dataDxtGallery.visuals.forEach(v => guidsHash[v.visual.guid] = true);
        this.props.dataMsitGallery.visuals.forEach(v => guidsHash[v.visual.guid] = true);
        this.props.dataProdGallery.visuals.forEach(v => guidsHash[v.visual.guid] = true);

        // cdn guids
        Object.keys(this.props.dataDevCdnBlob.visuals).forEach(guid => guidsHash[guid] = true);
        Object.keys(this.props.dataDxtCdnBlob.visuals).forEach(guid => guidsHash[guid] = true);
        Object.keys(this.props.dataMsitCdnBlob.visuals).forEach(guid => guidsHash[guid] = true);
        Object.keys(this.props.dataProdCdnBlob.visuals).forEach(guid => guidsHash[guid] = true);
        Object.keys(this.props.dataTestCdn.visuals).forEach(guid => guidsHash[guid] = true);
        Object.keys(this.props.dataDevCdn.visuals).forEach(guid => guidsHash[guid] = true);
        Object.keys(this.props.dataDxtCdn.visuals).forEach(guid => guidsHash[guid] = true);
        Object.keys(this.props.dataMsitCdn.visuals).forEach(guid => guidsHash[guid] = true);
        Object.keys(this.props.dataProdCdn.visuals).forEach(guid => guidsHash[guid] = true);
        Object.keys(this.props.dataTestCdn2.visuals).forEach(guid => guidsHash[guid] = true);
        Object.keys(this.props.dataDevCdn2.visuals).forEach(guid => guidsHash[guid] = true);
        Object.keys(this.props.dataDxtCdn2.visuals).forEach(guid => guidsHash[guid] = true);
        Object.keys(this.props.dataMsitCdn2.visuals).forEach(guid => guidsHash[guid] = true);
        Object.keys(this.props.dataProdCdn2.visuals).forEach(guid => guidsHash[guid] = true);

        const galleryCount = this.props.dataTestGalleryBlob.visuals.length;
        const cdnCount = Object.keys(this.props.dataTestCdnBlob.visuals).length;
        const guids = Object.keys(guidsHash).sort();

        guids.forEach(function(guid, i) {
            const visualDevBlob = this.props.dataDevGalleryBlob.visuals.find(v => guid === v.visual.guid) || visualDefault;
            const visualDxtBlob = this.props.dataDxtGalleryBlob.visuals.find(v => guid === v.visual.guid) || visualDefault;
            const visualMsitBlob = this.props.dataMsitGalleryBlob.visuals.find(v => guid === v.visual.guid) || visualDefault;
            const visualProdBlob = this.props.dataProdGalleryBlob.visuals.find(v => guid === v.visual.guid) || visualDefault;
            const visualTest = this.props.dataTestGallery.visuals.find(v => guid === v.visual.guid) || visualDefault;
            const visualDev = this.props.dataDevGallery.visuals.find(v => guid === v.visual.guid) || visualDefault;
            const visualDxt = this.props.dataDxtGallery.visuals.find(v => guid === v.visual.guid) || visualDefault;
            const visualMsit = this.props.dataMsitGallery.visuals.find(v => guid === v.visual.guid) || visualDefault;
            const visualProd = this.props.dataProdGallery.visuals.find(v => guid === v.visual.guid) || visualDefault;
            rows.push(
              <Visual 
                guid={guid}
                visualDevGalleryBlob={visualDevBlob} 
                visualDxtGalleryBlob={visualDxtBlob} 
                visualMsitGalleryBlob={visualMsitBlob} 
                visualProdGalleryBlob={visualProdBlob}
                visualTestGallery={visualTest} 
                visualDevGallery={visualDev} 
                visualDxtGallery={visualDxt} 
                visualMsitGallery={visualMsit} 
                visualProdGallery={visualProd}
                versionDevCdnBlob={this.props.dataDevCdnBlob.visuals[guid] ? this.props.dataDevCdnBlob.visuals[guid].apiVersion : ''}
                versionDxtCdnBlob={this.props.dataDxtCdnBlob.visuals[guid] ? this.props.dataDxtCdnBlob.visuals[guid].apiVersion : ''}
                versionMsitCdnBlob={this.props.dataMsitCdnBlob.visuals[guid] ? this.props.dataMsitCdnBlob.visuals[guid].apiVersion : ''}
                versionProdCdnBlob={this.props.dataProdCdnBlob.visuals[guid] ? this.props.dataProdCdnBlob.visuals[guid].apiVersion : ''}
                versionTestCdn={this.props.dataTestCdn.visuals[guid] ? this.props.dataTestCdn.visuals[guid].apiVersion : ''}
                versionDevCdn={this.props.dataDevCdn.visuals[guid] ? this.props.dataDevCdn.visuals[guid].apiVersion : ''}
                versionDxtCdn={this.props.dataDxtCdn.visuals[guid] ? this.props.dataDxtCdn.visuals[guid].apiVersion : ''}
                versionMsitCdn={this.props.dataMsitCdn.visuals[guid] ? this.props.dataMsitCdn.visuals[guid].apiVersion : ''}
                versionProdCdn={this.props.dataProdCdn.visuals[guid] ? this.props.dataProdCdn.visuals[guid].apiVersion : ''}
                versionTestCdn2={this.props.dataTestCdn2.visuals[guid] ? this.props.dataTestCdn2.visuals[guid].apiVersion : ''}
                versionDevCdn2={this.props.dataDevCdn2.visuals[guid] ? this.props.dataDevCdn2.visuals[guid].apiVersion : ''}
                versionDxtCdn2={this.props.dataDxtCdn2.visuals[guid] ? this.props.dataDxtCdn2.visuals[guid].apiVersion : ''}
                versionMsitCdn2={this.props.dataMsitCdn2.visuals[guid] ? this.props.dataMsitCdn2.visuals[guid].apiVersion : ''}
                versionProdCdn2={this.props.dataProdCdn2.visuals[guid] ? this.props.dataProdCdn2.visuals[guid].apiVersion : ''}

                visualDevCdnBlob={this.props.dataDevCdnBlob.visuals[guid]}
                visualDxtCdnBlob={this.props.dataDxtCdnBlob.visuals[guid]}
                visualMsitCdnBlob={this.props.dataMsitCdnBlob.visuals[guid]}
                visualProdCdnBlob={this.props.dataProdCdnBlob.visuals[guid]}
                visualDevCdn={this.props.dataDevCdn.visuals[guid]}
                visualDxtCdn={this.props.dataDxtCdn.visuals[guid]}
                visualMsitCdn={this.props.dataMsitCdn.visuals[guid]}
                visualProdCdn={this.props.dataProdCdn.visuals[guid]}
                visualDevCdn2={this.props.dataDevCdn2.visuals[guid]}
                visualDxtCdn2={this.props.dataDxtCdn2.visuals[guid]}
                visualMsitCdn2={this.props.dataMsitCdn2.visuals[guid]}
                visualProdCdn2={this.props.dataProdCdn2.visuals[guid]}
                key={i} />
            );
        }.bind(this));
        return (
            <table className="visual-list">
                <thead className="visual-header-line">
                    <tr>
                      <th className="c5"> </th>
                      <td className="separator"></td>
                      <th colSpan="4" className="c4"><span>Blob for CDN →</span></th>
                      <td className="separator"></td>
                      <th colSpan="4" className="c4"><span>CDN Amakai</span></th>
                      <td className="separator"></td>
                      <th colSpan="4"className="c4"><span>CDN Verizon</span></th>
                    </tr>
                    <tr>
                        <th className="c5">Name</th>
                        <td className="separator"></td>
                        <th>
                          <a href="http://extendcustomvisual.blob.core.windows.net/dev/approvedResources.json" target="_blank" title={`approvedResources.json \nLast modified: ${dateDevCdnBlob}`}>dev</a>
                        </th>
                        <th>
                          <a href="http://extendcustomvisual.blob.core.windows.net/dxt/approvedResources.json" target="_blank" title={`approvedResources.json \nLast modified: ${dateDxtCdnBlob}`}>dxt</a>
                        </th>
                        <th>
                          <a href="http://extendcustomvisual.blob.core.windows.net/msit/approvedResources.json" target="_blank" title={`approvedResources.json \nLast modified: ${dateMsitCdnBlob}`}>msit</a>
                        </th>
                        <th>
                          <a href="http://extendcustomvisual.blob.core.windows.net/prod/approvedResources.json" target="_blank" title={`approvedResources.json \nLast modified: ${dateProdCdnBlob}`}>prod</a>
                        </th>
                        <td className="separator"></td>
                        <th>
                          <a href="https://visuals.azureedge.net/dev/approvedResources.json" target="_blank" title={`approvedResources.json \nLast modified: ${dateDevCdn}`}>dev</a>
                        </th>
                        <th>
                          <a href="https://visuals.azureedge.net/dxt/approvedResources.json" target="_blank" title={`approvedResources.json \nLast modified: ${dateDxtCdn}`}>dxt</a>
                        </th>
                        <th>
                          <a href="https://visuals.azureedge.net/msit/approvedResources.json" target="_blank" title={`approvedResources.json \nLast modified: ${dateMsitCdn}`}>msit</a>
                        </th>
                        <th>
                          <a href="https://visuals.azureedge.net/prod/approvedResources.json" target="_blank" title={`approvedResources.json \nLast modified: ${dateProdCdn}`}>prod</a>
                        </th>
                        <td className="separator"></td>
                        <th>
                          <a href="https://visuals2.azureedge.net/dev/approvedResources.json" target="_blank" title={`approvedResources.json \nLast modified: ${dateDevCdn2}`}>dev</a>
                        </th>
                        <th>
                          <a href="https://visuals2.azureedge.net/dxt/approvedResources.json" target="_blank" title={`approvedResources.json \nLast modified: ${dateDxtCdn2}`}>dxt</a>
                        </th>
                        <th>
                          <a href="https://visuals2.azureedge.net/msit/approvedResources.json" target="_blank" title={`approvedResources.json \nLast modified: ${dateMsitCdn2}`}>msit</a>
                        </th>
                        <th>
                          <a href="https://visuals2.azureedge.net/prod/approvedResources.json" target="_blank" title={`approvedResources.json \nLast modified: ${dateProdCdn2}`}>prod</a>
                        </th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
                <tfoot>
                    <tr>
                        <th className="c5">{galleryCount ? `${galleryCount} in the Gallery / ${cdnCount} in CDN` : ''}</th>
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
      // blob gallery configs
      $.ajax({
        url: 'http://extendcustomvisual.blob.core.windows.net/gallery-test/visualCatalog.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataTestGalleryBlob = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('test', status, err.toString());
        }.bind(this)
      }),
      $.ajax({
        url: 'http://extendcustomvisual.blob.core.windows.net/gallery-dev/visualCatalog.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataDevGalleryBlob = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('dev', status, err.toString());
        }.bind(this)
      }),
      $.ajax({
        url: 'http://extendcustomvisual.blob.core.windows.net/gallery-dxt/visualCatalog.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataDxtGalleryBlob = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('dxt', status, err.toString());
        }.bind(this)
      }),
      $.ajax({
        url: 'http://extendcustomvisual.blob.core.windows.net/gallery-msit/visualCatalog.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataMsitGalleryBlob = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('dxt', status, err.toString());
        }.bind(this)
      }),
      $.ajax({
        url: 'http://extendcustomvisual.blob.core.windows.net/gallery-prod/visualCatalog.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataProdGalleryBlob = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
        }.bind(this)
      }),
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
        url: 'https://visuals.azureedge.net/gallery-msit/visualCatalog.json',
        dataType: 'json',
        type: 'get',
        // cache: false,
        success: function(result, status, xhr) {
            st.dataMsitGallery = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
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
        url: 'http://extendcustomvisual.blob.core.windows.net/msit/approvedResources.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            st.dataMsitCdnBlob = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
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
        url: 'https://visuals.azureedge.net/msit/approvedResources.json',
        dataType: 'json',
        type: 'get',
        // cache: false,
        success: function(result, status, xhr) {
            st.dataMsitCdn = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
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
        url: 'https://visuals2.azureedge.net/msit/approvedResources.json',
        dataType: 'json',
        type: 'get',
        // cache: false,
        success: function(result, status, xhr) {
            st.dataMsitCdn2 = {visuals: result, date: xhr.getResponseHeader('Last-Modified')};
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
      dataTestGalleryBlob: {
        visuals: []
      },
      dataDevGalleryBlob: {
        visuals: []
      },
      dataDxtGalleryBlob: {
        visuals: []
      },
      dataMsitGalleryBlob: {
        visuals: []
      },
      dataProdGalleryBlob: {
        visuals: []
      },
      dataTestGallery: {
        visuals: []
      },
      dataDevGallery: {
        visuals: []
      },
      dataDxtGallery: {
        visuals: []
      },
      dataMsitGallery: {
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
      dataMsitCdnBlob: {
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
      dataMsitCdn: {
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
      dataMsitCdn2: {
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
        <VisualList 
          dataTestGalleryBlob={this.state.dataTestGalleryBlob} 
          dataDevGalleryBlob={this.state.dataDevGalleryBlob} 
          dataDxtGalleryBlob={this.state.dataDxtGalleryBlob} 
          dataMsitGalleryBlob={this.state.dataMsitGalleryBlob} 
          dataProdGalleryBlob={this.state.dataProdGalleryBlob} 
          dataTestGallery={this.state.dataTestGallery} 
          dataDevGallery={this.state.dataDevGallery} 
          dataDxtGallery={this.state.dataDxtGallery} 
          dataMsitGallery={this.state.dataMsitGallery} 
          dataProdGallery={this.state.dataProdGallery} 
          dataTestCdnBlob={this.state.dataTestCdnBlob} 
          dataDevCdnBlob={this.state.dataDevCdnBlob} 
          dataDxtCdnBlob={this.state.dataDxtCdnBlob} 
          dataMsitCdnBlob={this.state.dataMsitCdnBlob} 
          dataProdCdnBlob={this.state.dataProdCdnBlob} 
          dataTestCdn={this.state.dataTestCdn} 
          dataDevCdn={this.state.dataDevCdn} 
          dataDxtCdn={this.state.dataDxtCdn} 
          dataMsitCdn={this.state.dataMsitCdn} 
          dataProdCdn={this.state.dataProdCdn} 
          dataTestCdn2={this.state.dataTestCdn2} 
          dataDevCdn2={this.state.dataDevCdn2} 
          dataDxtCdn2={this.state.dataDxtCdn2} 
          dataMsitCdn2={this.state.dataMsitCdn2} 
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