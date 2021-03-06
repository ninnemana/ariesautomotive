import React, { Component, PropTypes } from 'react';
import s from './LandingPage.scss';
import cx from 'classnames';
import withStyles from '../../decorators/withStyles';
import { brandName, brandNameShort } from '../../config';

@withStyles(s)
class LandingPage extends Component {

	static propTypes = {
		customContent: PropTypes.object,
		page: PropTypes.object,
	}

	static contextTypes = {
		onSetTitle: PropTypes.func.isRequired,
		onPageNotFound: PropTypes.func.isRequired,
		onSetMeta: PropTypes.func.isRequired,
		seo: PropTypes.func.isRequired,
	};

	static defaultProps = {
		page: {
			Name: null,
		},
	};

	componentWillMount() {
		const title = (this.props.page && this.props.page.Name) ? this.props.page.Name : brandNameShort;
		this.context.onSetTitle(title);
		this.context.onSetMeta('description', (this.props.page && this.props.page.Name ? this.props.page.Name : brandName));
		const seo = {
			title,
		};
		this.context.seo(seo);
	}

	renderText() {
		if (!this.props.page || !this.props.page.HtmlContent) {
			return null;
		}
		const html = { __html: this.props.page.HtmlContent };
		return <div dangerouslySetInnerHTML={html} />;
	}

	render() {
		return (
			<div className={cx(s.root)}>
				<h2>{this.props.page.Name || ''}</h2>
				{this.renderText()}
			</div>
		);
	}

}

export default LandingPage;
