import React from 'react';
import _ from 'lodash';

function getRuleCode(rule) {
  const ruleValue = _.isArray(rule) ? _.first(rule) : rule;

  if (_.isNumber(ruleValue)) {
    return ruleValue;
  }

  switch (ruleValue) {
    case 'off':
      return 0;
    case 'warning':
      return 1;
    case 'error':
      return 2;
  }
}

function getRuleLabel(ruleCode) {
  switch (ruleCode) {
    case 0:
      return 'off';
    case 1:
      return 'warn';
    case 2:
      return 'error';
  }
}

function formatRule(rule) {
  if (!_.isObject(rule)) {
    return rule;
  }

  return JSON.stringify(rule, null, 4);
}

function getTitleText(rule) {
  if (_.isArray(rule)) {
    const rules = rule.slice(1);
    if (rules.length === 1) {
      return formatRule(rules[0]);
    }
    return formatRule(rules);
  }
}

const Rule = ({ name, description, configs }) => {
  const ruleNodes = configs.filter(config => config.enabled).map(config => {
    const titleText = getTitleText(config.rules[name]);
    const ruleCode = getRuleCode(config.rules[name]);
    return (
      <td
        data-tip={titleText}
        key={config.name}
        className={`rule code-${ruleCode}`}
      >
        {getRuleLabel(ruleCode)}
        {titleText ? '*' : null}
      </td>
    );
  });

  return (
    <tr>
      {ruleNodes}
      <td>
        <a href={`http://eslint.org/docs/rules/${name}`}>
          {name}
        </a>
      </td>
      <td>
        {description}
      </td>
    </tr>
  );
};

export default Rule;
