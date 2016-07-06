import React, { Component, PropTypes } from 'react';
import s from './LandingPage.scss';
import cx from 'classnames';
import withStyles from '../../decorators/withStyles';

@withStyles(s)
class LandingPage extends Component {

	static propTypes = {
		customContent: PropTypes.object,
		page: PropTypes.object,
	}

	static contextTypes = {
		onPageNotFound: PropTypes.func.isRequired,
	};

	renderText() {
		if (!this.props.page || !this.props.page.HtmlContent) {
			return null;
		}
		const html = { __html: this.props.page.HtmlContent };
		return (
			<div dangerouslySetInnerHTML={html} />
			);
	}

	render() {
		return (
			<div className={cx(s.root)}>
				<h2>{this.props.page && this.props.page.Name ? this.props.page.Name : null}</h2>
				{this.renderText()}
			</div>
		);
	}

}

export default LandingPage;
