import React, { Component, PropTypes } from 'react';
import s from './NotFoundPage.scss';
import withStyles from '../../decorators/withStyles';

const title = 'Page Not Found';

@withStyles(s)
class NotFoundPage extends Component {

	static contextTypes = {
		onPageNotFound: PropTypes.func.isRequired,
	};

	componentWillMount() {
		this.context.onPageNotFound();
	}

	render() {
		return (
			<div>
				<h1>{title}</h1>
				<p>Sorry, but the page you were trying to view does not exist.</p>
			</div>
		);
	}

}

export default NotFoundPage;
