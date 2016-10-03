import React, {Component} from 'react';
import Modal from 'react-modal';
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

const FixedHeader = ({title, configs, enableConfig, disableConfig, showEditor}) => {
	const editLink = <a onClick={showEditor} className="edit">Edit</a>;
	const enabledConfigs = configs.filter(config => config.enabled).map(config => {
		return (
			<td key={config.name} className="rule">
				<img onClick={disableConfig.bind(this, config.name)} title={config.name} src={config.icon} height="30"/>
				{config.name === 'custom' ? editLink : null}
			</td>
		);
	});

	const disabledConfigs = configs.filter(config => !config.enabled).map(config => {
		return (
			<div key={config.name} onClick={enableConfig.bind(this, config.name)}>
				<img title={config.name} src={config.icon} height="30"/>
			</div>
		);
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

const Category = ({title, rules, configs, enableConfig, disableConfig, showEditor}) => {
	const ruleNodes = rules.map((rule, i) => <Rule key={i} name={rule.name} description={rule.description} configs={configs}></Rule>);
	return (
		<div>
			<FixedHeader title={title} configs={configs} enableConfig={enableConfig} disableConfig={disableConfig} showEditor={showEditor}></FixedHeader>
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
				name: 'airbnb',
				icon: require('./img/airbnb-icon.png'),
				rules: require('./data/configs/airbnb-base.json')
			},
			{
				name: 'eslint-recommended',
				icon: require('./img/eslint-recommended-icon.png'),
				rules: require('./data/configs/eslint-recommended.json'),
				enabled: true
			},
			{
				name: 'google',
				icon: require('./img/google-icon.png'),
				rules: require('./data/configs/google.json')
			},
			{
				name: 'standard',
				icon: require('./img/standard-icon.png'),
				rules: require('./data/configs/standard.json')
			},
			{
				name: 'custom',
				icon: require('./img/edit-icon.png'),
				rules: {},
				enabled: true
			}
			// {
			// 	name: 'tradeshift',
			// 	icon: require('./img/tradeshift-icon.png'),
			// 	rules: require('./data/configs/tradeshift.json')
			// }
		];

		this.state = {
			configs: configs,
			editorContents: '',
			isEditorVisible: false
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

	onClickSave () {
		try {
			const customConfig = _.find(this.state.configs, {name: 'custom'});
			customConfig.rules = JSON.parse(this.state.editorContents);

			this.setState({
				configs: this.state.configs,
				isEditorVisible: false
			});
		} catch (e) {
			console.error(e);
		}
	}

	onChangeEditor (evt) {
		this.setState({
			editorContents: evt.target.value
		});
	}

	showEditor () {
		this.setState({
			isEditorVisible: true
		});
	}

	hideEditor () {
		this.setState({
			isEditorVisible: false
		});
	}

	render () {
		const categoryNodes = rulesCategories.map((category, i) => {
			return <Category key={i}
				title={category.title}
				rules={category.rules}
				configs={this.state.configs}
				enableConfig={this.enableConfig.bind(this)}
				disableConfig={this.disableConfig.bind(this)}
				showEditor={this.showEditor.bind(this)}>
			</Category>;
		});

		return (
			<div>
				<Modal
					isOpen={this.state.isEditorVisible}
					onRequestClose={this.hideEditor.bind(this)}>
					<div className="modal-inner">
						<textarea onChange={this.onChangeEditor.bind(this)} placeholder="Paste ESLint rules and hit Save" value={this.state.editorContents}/>
						<button onClick={this.onClickSave.bind(this)}>Save</button>
					</div>
				</Modal>
				<StickyContainer>
					{categoryNodes}
				</StickyContainer>
			</div>
		);
	}
}
