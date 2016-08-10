// CDN Visual
var Visual = React.createClass({
    loadVisualFromCDN: function() {
      $.ajax({
        url: 'http://visuals.azureedge.net/prod/' + this.props.visualGallery.visual.guid + '.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function(result, status, xhr) {
            var visual = result;
            visual.date = xhr.getResponseHeader('Last-Modified');
            this.setState({
                loading: false,
                visualCDN: visual
            });
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.visualGallery.visual.guid, status, err.toString());
        }.bind(this)
      });
    },

    getInitialState: function() {
        return {
            loading: true,
            visualGallery: this.props.visualGallery,
            visualCDN: this.props.visualCDN
        };
    },

    componentDidMount: function() {
      this.loadVisualFromCDN();
    },

    render: function() {
        if (this.props.visualGallery) {
          var loadingClass = this.props.loading ? 'visual visual_loading' : 'visual';

          var versionGallery = this.props.visualGallery.visual.version;
          var versionCDN = this.state.visualCDN.visual.version;
          var dateGallery = new Date(this.props.visualGallery.dateLastUpdated);
          dateGallery = dateGallery.toLocaleString();
          var dateCDN = new Date(this.state.visualCDN.date);
          dateCDN = dateCDN.toLocaleString();

          if (versionCDN !== '???' && versionGallery !== versionCDN) {
            loadingClass += ' visual_diverged';
          }

          return (
              <tr className={loadingClass}>
                  <td title={this.props.visualGallery.visual.guid}>{this.props.visualGallery.visual.displayName}</td>
                  <td>{versionGallery}</td>
                  <td>{versionCDN}</td>
                  <td>{dateGallery}</td>
                  <td>{dateCDN}</td>
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
            rows.push(<Visual visualGallery={visual} visualCDN={visualCDNDefault} key={i} />);
        }.bind(this));
        return (
            <table className="visual-list">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Gallery version</th>
                        <th>CDN version</th>
                        <th>Gallery updated</th>
                        <th>CDN updated</th>
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
      cache: false,
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
    <VisualsBox url="https://wabieu2pbivisuals.blob.core.windows.net/powerbi-visuals/visualCatalog.json"/>,
    document.getElementById('content')
  );
})