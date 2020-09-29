/* Helper to get the config.json from the server. Single instance of Configuration class to use for settings */
class Configuration {
  constructor() {
    this._configuration = null;
    this.getConfiguration();
  }

  HAS_FAKE_INLOG_ENABLED() {
    return (this._configuration.HAS_FAKE_INLOG_ENABLED === 'true');
  }
  BASE_URL_API() {
    return this._configuration.BACKEND_URL;
  }

  getConfiguration() {
    if (this._configuration !== null) {
      return this._configuration;
    } else {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open('GET', 'config/config.json', false);
      if (xmlhttp.overrideMimeType) {
        xmlhttp.overrideMimeType('application\\json');
      }
      xmlhttp.send();
      if (xmlhttp.status === 200) {
        this._configuration = JSON.parse(xmlhttp.responseText);
      } else {
        console.error('Could not get configuration settings');
      }
    }
  }
}
export let configuration = new Configuration();
