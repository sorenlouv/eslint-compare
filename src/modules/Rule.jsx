import React from 'react';
import _ from 'lodash';

function getRuleCode (rule) {
	const ruleValue = _.isArray(rule)
		? _.first(rule)
		: rule;

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
	};
}

function getRuleLabel (ruleCode) {
	switch (ruleCode) {
		case 0:
			return 'off';
		case 1:
			return 'warn';
		case 2:
			return 'error';
	};
}

const Rule = ({name, description, configs}) => {
	const ruleNodes = configs.filter(config => config.enabled).map(config => {
		const ruleCode = getRuleCode(config.rules[name]);
		return <td key={config.name} className={'rule code-' + ruleCode}>{getRuleLabel(ruleCode)}</td>;
	});

	return (
		<tr>
			{ruleNodes}
			<td>
				<a href={'http://eslint.org/docs/rules/' + name}>{name}</a>
			</td>
			<td>{description}</td>
		</tr>
	);
};

export default Rule;
