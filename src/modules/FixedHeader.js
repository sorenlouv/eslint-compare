import React from 'react';
import { Sticky } from 'react-sticky';

const FixedHeader = ({
  title,
  configs,
  enableConfig,
  disableConfig,
  showEditor,
}) => {
  const editLink = (
    <a onClick={showEditor} className="edit">
      Edit
    </a>
  );
  const enabledConfigs = configs
    .filter((config) => config.enabled)
    .map((config) => {
      return (
        <td key={config.name} className="rule">
          <div className="icon-container">
            <img
              data-tip={config.name}
              onClick={() => disableConfig(config.name)}
              src={config.icon}
              height="30"
            />
            {config.name === 'custom' ? editLink : null}
          </div>
        </td>
      );
    });

  function enableAndEditConfig(name) {
    enableConfig.call(this, name);
    if (name === 'custom') {
      showEditor();
    }
  }

  const disabledConfigs = configs
    .filter((config) => !config.enabled)
    .map((config) => {
      return (
        <div key={config.name} onClick={() => enableAndEditConfig(config.name)}>
          <img data-tip={config.name} src={config.icon} height="30" />
        </div>
      );
    });

  return (
    <Sticky className="header">
      <table>
        <thead>
          <tr>
            {enabledConfigs}
            <td>
              <h2>{title}</h2>
            </td>
            <td className="disabled-configs">{disabledConfigs}</td>
          </tr>
        </thead>
      </table>
    </Sticky>
  );
};

export default FixedHeader;
