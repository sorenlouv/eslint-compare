import React from 'react'

const ConfigBlock = ({configs}) => {
  const configNodes = configs
    .filter(config => config.enabled)
    .map(config => {
      return (
        <tr>
          <th>{config.name}</th>
          <td>{JSON.stringify(config.config, null, '\t')}</td>
        </tr>
      )
    })

  return <table id="configblock">{configNodes}</table>
}

export default ConfigBlock
