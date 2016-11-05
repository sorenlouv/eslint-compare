import React from 'react';
import Rule from './Rule.jsx';
import FixedHeader from './FixedHeader.jsx';

const Category = ({title, rules, configs, enableConfig, disableConfig, showEditor}) => {
	const ruleNodes = rules.map((rule, i) => <Rule key={i} name={rule.name} description={rule.description} configs={configs} />);
	return (
		<div>
			<FixedHeader title={title} configs={configs} enableConfig={enableConfig} disableConfig={disableConfig} showEditor={showEditor} />
			<table>
				<tbody>{ruleNodes}</tbody>
			</table>
		</div>
	);
};

export default Category;
