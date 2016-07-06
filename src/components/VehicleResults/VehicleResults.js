import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Loader from 'react-loader';
import s from './VehicleResults.scss';
import withStyles from '../../decorators/withStyles';
import VehicleStore from '../../stores/VehicleStore';
import VehicleActions from '../../actions/VehicleActions';
import connectToStores from 'alt-utils/lib/connectToStores';
import VehicleStyle from './VehicleStyle';

@withStyles(s)
@connectToStores
class VehicleResults extends Component {

	static propTypes = {
		className: PropTypes.string,
		context: PropTypes.shape({
			params: PropTypes.shape({
				year: PropTypes.string,
				make: PropTypes.string,
				model: PropTypes.string,
			}),
		}),
		vehicle: PropTypes.shape({
			year: PropTypes.string,
			make: PropTypes.string,
			model: PropTypes.string,
		}),
		catStyleParts: PropTypes.array,
		activeCategory: PropTypes.object,
	};

	static contextTypes = {
		onPageNotFound: PropTypes.func.isRequired,
	};

	constructor() {
		super();
		this.state = {
			context: {},
		};
	}

	componentWillMount() {
		VehicleActions.set({
			year: this.props.context.params.year,
			make: this.props.context.params.make,
			model: this.props.context.params.model,
		});
	}

	static getStores() {
		return [VehicleStore];
	}

	static getPropsFromStores() {
		return VehicleStore.getState();
	}

	getCategoryStyles() {
		const output = [];
		for (const i in this.props.catStyleParts) {
			if (!this.props.catStyleParts[i]) {
				continue;
			}
			const active = this.props.activeCategory === this.props.catStyleParts[i];
			output.push(
				<li key={i} className={cx(s.categoryStyle, (active ? s.active : ''))} role="presentation">
					<a onClick={this.setActiveCategory.bind(this, this.props.catStyleParts[i])}>{this.props.catStyleParts[i].name}</a>
				</li>
			);
		}
		return output;
	}

	setActiveCategory(cat) {
		VehicleActions.setActiveCategory(cat);
	}

	renderParts() {
		return (
			<VehicleStyle
				className={s.vehicleStyle}
				category={this.props.activeCategory}
			/>
		);
	}

	render() {
		return (
			<div className={s.container}>
				<Loader loaded={(this.props.catStyleParts !== null)} top="30%" loadedClassName={s.loader}>
					<div className={cx(s.root, this.props.className)} role="navigation">
						<div className="tab-wrap">
							<ul className="nav nav-pills nav-stacked lg-tabs" role="tablist">
								{this.getCategoryStyles()}
							</ul>
						</div>
					</div>
					<div className={s.clearfix}></div>
					{this.props.activeCategory ? this.renderParts() : null}
				</Loader>
			</div>
		);
	}

}

export default VehicleResults;
