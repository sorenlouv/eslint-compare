import React, {Component} from 'react'
import Modal from 'react-modal'
import _ from 'lodash'
import {StickyContainer} from 'react-sticky'
import ReactTooltip from 'react-tooltip'
import Category from './modules/Category'
import rulesCategories from './data/rules'
import ConfigBlock from './modules/ConfigBlock'

const allRules = _.flatten(
  rulesCategories.map(cat => cat.rules.map(rule => rule.name)),
)

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
}

export default class App extends Component {
  constructor(props) {
    super(props)
    const configs = [
      {
        name: 'airbnb',
        icon: require('./img/airbnb-icon.png'),
        path: 'airbnb-base.json',
        enabled: true,
        config: {},
      },
      {
        name: 'airbnb-ts-prettier',
        icon: require('./img/airbnb-icon-ts.png'),
        path: 'airbnb-typescript-prettier.json',
        enabled: true,
        config: {},
      },
      {
        name: 'eslint-recommended',
        icon: require('./img/eslint-recommended-icon.png'),
        path: 'eslint-recommended.json',
        enabled: false,
        config: {},
      },
      // {
      //   name: 'google',
      //   icon: require('./img/google-icon.png'),
      //   path: 'google.json',
      //   enabled: false,
      //   config: {},
      // },
      // {
      //   name: 'standard',
      //   icon: require('./img/standard-icon.png'),
      //   path: 'standard.json',
      //   enabled: false,
      //   config: {},
      // },
      // {
      //   name: 'nucleus-js',
      //   icon: require('./img/cvent.png'),
      //   path: 'nucleus-js.json',
      //   enabled: true,
      //   config: {},
      // },
      {
        name: 'nucleus-ts',
        icon: require('./img/cvent.png'),
        path: 'nucleus-ts.json',
        enabled: true,
        config: {},
      },
      {
        name: 'kcd',
        icon: require('./img/kcd.png'),
        path: 'kcd.json',
        enabled: true,
        config: {},
      },
      // {
      //   name: 'kcd-ts',
      //   icon: require('./img/kcd.png'),
      //   path: 'kcd-ts.json',
      //   enabled: true,
      //   config: {},
      // },
      {
        name: 'socialtables',
        icon: require('./img/socialtables.png'),
        path: 'socialtables.json',
        enabled: true,
        config: {},
      },
      {
        name: 'custom',
        icon: require('./img/add-icon.png'),
        rules: {},
        enabled: false,
        config: {},
      },
    ]

    let newRulesCategories = [...rulesCategories]
    configs.forEach(config => {
      if (config.path) {
        const data = require(`./data/configs/${config.path}`)
        config.rules = data.rules
        delete data.rules
        config.config = data
      }

      const customCategories = this.updateRulesFromConfig(config)
      if (customCategories && customCategories.length) {
        newRulesCategories = [...newRulesCategories, ...customCategories]
      }
    })
    this.state = {
      configs,
      editorContents: '',
      isEditorVisible: false,
      isEditorInvalid: false,
      rulesCategories: newRulesCategories,
    }

    //throw new Error(JSON.stringify(this.state.rulesCategories));
  }

  componentDidUpdate() {
    ReactTooltip.rebuild()
  }

  onChangeEditor = evt => {
    this.setState({
      editorContents: evt.target.value,
    })
  }

  onClickSave = () => {
    try {
      const customConfig = _.find(this.state.configs, {name: 'custom'})
      const contents = JSON.parse(this.state.editorContents)
      customConfig.rules = _.get(contents, 'rules', contents)
      delete contents.rules
      customConfig.config = _.get(contents, 'config', contents)

      const customRuleCategories = this.updateRulesFromConfig(customConfig)

      this.setState({
        configs: this.state.configs,
        isEditorVisible: false,
        isEditorInvalid: false,
        rulesCategories: [
          ...this.state.rulesCategories,
          ...customRuleCategories,
        ],
      })
    } catch (e) {
      console.error(e)
      this.setState({
        isEditorInvalid: true,
      })
    }
  }

  updateRulesFromConfig = eslintConfig => {
    console.log(eslintConfig.name)

    const customRuleNames = Object.keys(eslintConfig.rules).filter(
      rule => !allRules.includes(rule),
    )

    const customRuleNamesWithCategory = customRuleNames.filter(name =>
      name.includes('/'),
    )

    const customCategories = customRuleNamesWithCategory.reduce(
      (memo, ruleName) => {
        const categoryTitle = ruleName.split('/')[0]
        const category = memo.find(
          categories => categories.title === categoryTitle,
        )
        if (!category) {
          memo.push({
            title: categoryTitle,
            rules: [{name: ruleName}],
          })
          return memo
        }

        category.rules.push({name: ruleName})
        return memo
      },
      [],
    )

    return customCategories
  }

  enableConfig = name => {
    const config = _.find(this.state.configs, {name})
    config.enabled = true
    this.setState({configs: this.state.configs})
  }

  disableConfig = name => {
    const config = _.find(this.state.configs, {name})
    config.enabled = false
    this.setState({configs: this.state.configs})
  }

  showEditor = () => {
    this.setState({
      isEditorVisible: true,
    })
  }

  hideEditor = () => {
    this.setState({
      isEditorVisible: false,
    })
  }

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
      )
    })

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
              {this.state.isEditorInvalid ? (
                <span className="editor-invalid">
                  The config is invalid and cannot be saved
                </span>
              ) : null}
            </div>
          </div>
        </Modal>
        <StickyContainer>{categoryNodes}</StickyContainer>
        <div>
          <h2>Configs</h2>
          <div>
            <ConfigBlock configs={this.state.configs} />
          </div>
        </div>
      </div>
    )
  }
}
