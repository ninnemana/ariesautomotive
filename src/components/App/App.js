import React, { Component, PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import cx from 'classnames';
import s from './App.scss';
import Header from '../Header';
import Lookup from '../Lookup';
import Footer from '../Footer';

class App extends Component {

	static propTypes = {
		context: PropTypes.shape({
			insertCss: PropTypes.func,
			onPageNotFound: PropTypes.func,
			years: PropTypes.array,
			categories: PropTypes.array,
			params: PropTypes.object,
			siteContents: PropTypes.array,
		}),
		children: PropTypes.element.isRequired,
		error: PropTypes.object,
	};

	static childContextTypes = {
		insertCss: PropTypes.func.isRequired,
		onPageNotFound: PropTypes.func.isRequired,
	};

	getChildContext() {
		const context = this.props.context;
		return {
			insertCss: context.insertCss || emptyFunction,
			onPageNotFound: context.onPageNotFound || emptyFunction,
		};
	}

	componentWillMount() {
		this.removeCss = this.props.context.insertCss(s);
	}

	componentWillUnmount() {
		this.removeCss();
	}

	render() {
		const styles = {
			background: "url('/img/bgtexture.png')",
		};
		return !this.props.error ? (
			<div className={cx(s.root)} style={styles}>
				<Header categories={this.props.context.categories} />
				<Lookup {...this.props.context} />
				<div className="children">
					{this.props.children}
				</div>
				<Footer siteContents={this.props.context.siteContents} />
			</div>
		) : this.props.children;
	}

}

export default App;
