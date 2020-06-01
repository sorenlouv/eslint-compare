import React from 'react'
import _ from 'lodash'

function getRuleCode(rule) {
  const ruleValue = _.isArray(rule) ? _.first(rule) : rule

  if (_.isNumber(ruleValue)) {
    return ruleValue
  }

  switch (ruleValue) {
    case 'off':
      return 0
    case 'warning':
    case 'warn':
      return 1
    case 'error':
      return 2
    default:
      return null
  }
}

function getUrl(fullName) {
  let prefix = ''
  let name = fullName
  let url = ''

  const arr = fullName.split('/')

  if (arr.length > 1) {
    prefix = arr[0]
    name = arr[1]
  }

  switch (prefix) {
    case 'babel':
      url = `https://github.com/babel/eslint-plugin-babel/tree/master/rules/${name}.js`
      break
    case 'react':
      url = `https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/${name}.md`
      break
    case 'import':
      url = `https://github.com/benmosher/eslint-plugin-import/tree/master/docs/rules/${name}.md`
      break
    case 'jsx-a11y':
      url = `https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/${name}.md`
      break
    case '@typescript-eslint':
      url = `https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/${name}.md`
      break
    case 'jest':
      url = `https://github.com/jest-community/eslint-plugin-jest/tree/master/docs/rules/${name}.md`
      break
    default:
      url = `http://eslint.org/docs/rules/${name}`
  }

  return url
}
function getRuleLabel(ruleCode) {
  switch (ruleCode) {
    case 0:
      return 'off'
    case 1:
      return 'warn'
    case 2:
      return 'error'
    default:
      return null
  }
}

function formatRule(rule) {
  if (!_.isObject(rule)) {
    return rule
  }

  return JSON.stringify(rule, null, 4)
}

function getTitleText(rule) {
  if (_.isArray(rule)) {
    const rules = rule.slice(1)
    if (rules.length === 1) {
      return formatRule(rules[0])
    }
    return formatRule(rules)
  }
  return null
}

const Rule = ({name, description, configs}) => {
  const ruleNodes = configs
    .filter(config => config.enabled)
    .map(config => {
      const titleText = getTitleText(config.rules[name])
      const ruleCode = getRuleCode(config.rules[name])
      return (
        <td
          data-tip={titleText}
          key={config.name}
          className={`rule code-${ruleCode}`}
        >
          {getRuleLabel(ruleCode)}
          {titleText ? '*' : null}
        </td>
      )
    })

  return (
    <tr>
      {ruleNodes}
      <td>
        <a href={getUrl(name)}>{name}</a>
      </td>
      <td>{description}</td>
    </tr>
  )
}

export default Rule
