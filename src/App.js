import React, { Component } from 'react';
import Modal from 'react-modal';
import rulesCategories from './data/rules.json';
import _ from 'lodash';
import { StickyContainer } from 'react-sticky';
import Category from './modules/Category';
import ReactTooltip from 'react-tooltip';

const allRules = _.flatten(
  rulesCategories.map(cat => cat.rules.map(rule => rule.name))
);

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  }
};

export default class App extends Component {
  constructor(props) {
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
      configs,
      editorContents: '',
      isEditorVisible: false,
      isEditorInvalid: false,
      rulesCategories
    };
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  onChangeEditor = evt => {
    this.setState({
      editorContents: evt.target.value
    });
  };

  onClickSave = () => {
    try {
      const customConfig = _.find(this.state.configs, { name: 'custom' });
      const contents = JSON.parse(this.state.editorContents);
      customConfig.rules = _.get(contents, 'rules', contents);

      const customRuleNames = Object.keys(customConfig.rules).filter(
        rule => !allRules.includes(rule)
      );

      const customRuleNamesWithCategory = customRuleNames.filter(name =>
        name.includes('/')
      );

      const customCategories = customRuleNamesWithCategory.reduce(
        (memo, ruleName) => {
          const categoryTitle = ruleName.split('/')[0];
          const category = memo.find(
            categories => categories.title === categoryTitle
          );
          if (!category) {
            memo.push({
              title: categoryTitle,
              rules: [{ name: ruleName }]
            });
            return memo;
          }

          category.rules.push({ name: ruleName });
          return memo;
        },
        []
      );

      this.setState({
        rulesCategories: [...this.state.rulesCategories, ...customCategories],
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
  };

  enableConfig = name => {
    const config = _.find(this.state.configs, { name });
    config.enabled = true;
    this.setState({ configs: this.state.configs });
  };

  disableConfig = name => {
    const config = _.find(this.state.configs, { name });
    config.enabled = false;
    this.setState({ configs: this.state.configs });
  };

  showEditor = () => {
    this.setState({
      isEditorVisible: true
    });
  };

  hideEditor = () => {
    this.setState({
      isEditorVisible: false
    });
  };

  render() {
    const categoryNodes = this.state.rulesCategories.map(category => {
      return (
        <Category
          key={category.title}
          title={category.title}
          rules={category.rules}
          configs={this.state.configs}
          enableConfig={this.enableConfig}
          disableConfig={this.disableConfig}
          showEditor={this.showEditor}
        />
      );
    });

    return (
      <div>
        <ReactTooltip multiline />
        <Modal
          className="modal-outer"
          style={modalStyles}
          isOpen={this.state.isEditorVisible}
          onRequestClose={this.hideEditor}
        >
          <div className="modal-inner">
            <div className="header">
              <p>
                If you are extending other configs, you can use the following to
                generate the resulting config:
                <code>node_modules/eslint/bin/eslint.js --print-config ./</code>
              </p>
            </div>
            <textarea
              onChange={this.onChangeEditor}
              placeholder="Paste ESLint rules and hit Save"
              value={this.state.editorContents}
            />
            <div className="footer">
              <button onClick={this.onClickSave}>Save</button>
              {this.state.isEditorInvalid
                ? <span className="editor-invalid">
                    The config is invalid and cannot be saved
                  </span>
                : null}
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
