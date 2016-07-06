import React, { Component, PropTypes } from 'react';
import s from './CustomContent.scss';
import cx from 'classnames';
import withStyles from '../../decorators/withStyles';

@withStyles(s)
class CustomContent extends Component {

	static propTypes = {
		customContent: PropTypes.object,
		context: PropTypes.object,
	}

	static contextTypes = {
		onPageNotFound: PropTypes.func.isRequired,
	};

	shouldComponentUpdate() {
		this.setState({
			notusedstate: Math.random(),
		});
		return false;
	}

	renderText() {
		if (!this.props.context.customContent || !this.props.context.customContent.contentRevisions || this.props.context.customContent.contentRevisions.length < 1) {
			return null;
		}
		const html = { __html: this.props.context.customContent.contentRevisions[0].text };
		return (
			<div dangerouslySetInnerHTML={html} />
			);
	}

	render() {
		return (
			<div className={cx(s.root)}>
				<h2>{this.props.context.customContent.title}</h2>
				{this.renderText()}
			</div>
		);
	}

}

export default CustomContent;
