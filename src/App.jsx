import React, {Component} from 'react';
import Modal from 'react-modal';
import rulesCategories from './data/rules.json';
import _ from 'lodash';
import { StickyContainer } from 'react-sticky';
import Category from './modules/Category.jsx';
import ReactTooltip from 'react-tooltip';

const modalStyles = {
	overlay: {
		backgroundColor: 'rgba(0, 0, 0, 0.75)'
	}
};

export default class App extends Component {

	constructor (props) {
		super(props);
		const configs = [
			{
				name: 'airbnb',
				icon: require('./img/airbnb-icon.png'),
				rules: require('./data/configs/airbnb-base.json'),
				enabled: true
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
				rules: require('./data/configs/google.json'),
				enabled: false
			},
			{
				name: 'standard',
				icon: require('./img/standard-icon.png'),
				rules: require('./data/configs/standard.json'),
				enabled: true
			},
			{
				name: 'custom',
				icon: require('./img/add-icon.png'),
				rules: {},
				enabled: false
			}
		];

		this.state = {
			configs: configs,
			editorContents: '',
			isEditorVisible: false,
			isEditorInvalid: false
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
				isEditorVisible: false,
				isEditorInvalid: false
			});
		} catch (e) {
			console.error(e);
			this.setState({
				isEditorInvalid: true
			});
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
				showEditor={this.showEditor.bind(this)} />;
		});

		return (
			<div>
				<ReactTooltip multiline={true} />
				<Modal
					className='modal-outer'
					style={modalStyles}
					isOpen={this.state.isEditorVisible}
					onRequestClose={this.hideEditor.bind(this)}>
					<div className='modal-inner'>
						<div className='header'>
							<p>
								If you are extending other configs, you can use the following to generate the resulting config:
								<code>eslint --print-config ./</code>
							</p>
						</div>
						<textarea onChange={this.onChangeEditor.bind(this)} placeholder='Paste ESLint rules and hit Save' value={this.state.editorContents} />
						<div className='footer'>
							<button onClick={this.onClickSave.bind(this)}>Save</button>
							{
								this.state.isEditorInvalid ? <span className='editor-invalid'>The config is invalid and cannot be saved</span> : null
							}
						</div>
					</div>
				</Modal>
				<StickyContainer>
					{categoryNodes}
				</StickyContainer>
			</div>
		);
	}
}
