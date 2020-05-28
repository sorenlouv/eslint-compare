import React from 'react'
import Rule from './Rule'
import FixedHeader from './FixedHeader'

const Category = ({
  title,
  rules,
  configs,
  enableConfig,
  disableConfig,
  showEditor,
}) => {
  const ruleNodes = rules.map(rule => (
    <Rule
      key={rule.name}
      name={rule.name}
      description={rule.description}
      configs={configs}
    />
  ))
  return (
    <div>
      <FixedHeader
        title={title}
        configs={configs}
        enableConfig={enableConfig}
        disableConfig={disableConfig}
        showEditor={showEditor}
      />
      <table>
        <tbody>{ruleNodes}</tbody>
      </table>
    </div>
  )
}

export default Category
