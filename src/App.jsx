import React, {Component} from 'react';
import rulesCategories from './data/rules.json';
import _ from 'lodash';
import { StickyContainer, Sticky } from 'react-sticky';

const getRuleCode = (rule) => {
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
};

const getRuleLabel = (ruleCode) => {
	switch (ruleCode) {
		case 0:
			return 'off';
		case 1:
			return 'warn';
		case 2:
			return 'error';
	};
};

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

const FixedHeader = ({title, configs, enableConfig, disableConfig}) => {
	const enabledConfigs = configs.filter(config => config.enabled).map(config => {
		return <td key={config.name} onClick={disableConfig.bind(this, config.name)} className="rule"><img src={config.icon} height="30"/></td>;
	});

	const disabledConfigs = configs.filter(config => !config.enabled).map(config => {
		return <div key={config.name}><img onClick={enableConfig.bind(this, config.name)} src={config.icon} height="30"/></div>;
	});

	return (
		<Sticky className="header">
			<table>
				<thead>
					<tr>
						{enabledConfigs}
						<td><h2>{title}</h2></td>
						<td className="disabled-configs">
							{disabledConfigs}
						</td>
					</tr>
				</thead>
			</table>
		</Sticky>
	);
};

const Category = ({title, rules, configs, enableConfig, disableConfig}) => {
	const ruleNodes = rules.map((rule, i) => <Rule key={i} name={rule.name} description={rule.description} configs={configs}></Rule>);
	return (
		<div>
			<FixedHeader title={title} configs={configs} enableConfig={enableConfig} disableConfig={disableConfig}></FixedHeader>
			<table>
				<tbody>{ruleNodes}</tbody>
			</table>
		</div>
	);
};

export default class App extends Component {

	constructor (props) {
		super(props);
		const configs = [
			{
				name: 'eslint-recommended',
				icon: require('./img/eslint-recommended-icon.png'),
				rules: require('./data/configs/eslint-recommended.json'),
				enabled: true
			},
			{
				name: 'airbnb',
				icon: require('./img/airbnb-icon.png'),
				rules: require('./data/configs/airbnb.json')
			},
			{
				name: 'standard',
				icon: require('./img/standard-icon.png'),
				rules: require('./data/configs/standard.json'),
				enabled: true
			},
			{
				name: 'google',
				icon: require('./img/google-icon.png'),
				rules: require('./data/configs/google.json')
			},
			{
				name: 'tradeshift',
				icon: require('./img/tradeshift-icon.png'),
				rules: require('./data/configs/tradeshift.json')
			}
		];

		this.state = {
			configs: configs
		};
	}

	enableConfig (name) {
		const config = _.find(this.state.configs, {name: name});
		config.enabled = true;
		this.setState({configs: this.state.configs});
	}

	disableConfig (name) {
		const config = _.find(this.state.configs, {name: name});
		config.enabled = false;
		this.setState({configs: this.state.configs});
	}

	render () {
		console.log(this.state.configs.map(config => config.enabled));
		const categoryNodes = rulesCategories.map((category, i) => {
			return <Category key={i}
				title={category.title}
				rules={category.rules}
				configs={this.state.configs}
				enableConfig={this.enableConfig.bind(this)}
				disableConfig={this.disableConfig.bind(this)}>
			</Category>;
		});

		return (
			<StickyContainer>
				{categoryNodes}
			</StickyContainer>
		);
	}
}
