import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import s from './VehicleStyle.scss';
import withStyles from '../../../decorators/withStyles';
import VehicleStore from '../../../stores/VehicleStore';
import VehicleActions from '../../../actions/VehicleActions';
import PartResults from '../../PartResults/PartResults';
import connectToStores from 'alt-utils/lib/connectToStores';

@withStyles(s)
@connectToStores
class VehicleStyle extends Component {
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
			categoryparts: PropTypes.object,
			style: PropTypes.string,
		}),
		// categoryparts: PropTypes.object,
		category: PropTypes.string,
		showStyle: PropTypes.bool,
		parts: PropTypes.array,
		catStyleParts: PropTypes.shape({
			name: PropTypes.string,
			category: PropTypes.shape({
				available_styles: PropTypes.shape({
					name: PropTypes.string,
					parts: PropTypes.array,
				}),
			}),
		}),
	};

	constructor() {
		super();
		this.showStyleChoices = this.showStyleChoices.bind(this);
		this.getStyleChoices = this.getStyleChoices.bind(this);
		this.showStyleChoices = this.showStyleChoices.bind(this);
		this.unhideChoices = this.unhideChoices.bind(this);
		this.setVehicleStyle = this.setVehicleStyle.bind(this);
		this.getParts = this.getParts.bind(this);
		// this.getCategoryPartsForVehicleStyle = this.getCategoryPartsForVehicleStyle.bind(this);
	}

	static getStores() {
		return [VehicleStore];
	}

	static getPropsFromStores() {
		return VehicleStore.getState();
	}

	getStyleChoices() {
		const styleOptions = [];
		let styles = {};
		styles = this.props.catStyleParts.category[this.props.catStyleParts.name].available_styles;

		for (const i in styles) {
			if (!i) {
				return styleOptions;
			}
			styleOptions.push(
				<li key={i} onClick={this.setVehicleStyle.bind(this, i)} value={i}>
					{i.toUpperCase()}
				</li>
			);
		}
		return styleOptions;
	}

	setVehicleStyle(style) {
		const v = {
			year: this.props.vehicle.year,
			make: this.props.vehicle.make,
			model: this.props.vehicle.model,
			style,
		};
		VehicleActions.set(v);
	}

	getParts() {
		const parts = this.props.catStyleParts.category[this.props.catStyleParts.name].available_styles[this.props.vehicle.style];
		if (!parts || parts.length < 1) {
			return <h3 className={s.noParts}>No parts for this style</h3>;
		}
		return (<PartResults parts={parts} className={s.partResults}/>);
	}

	unhideChoices() {
		VehicleActions.setShowStyleState(true);
	}

	showStyleChoices() {
		return (
			<div className={s.styleChoices}>
				<ul>
					{this.getStyleChoices()}
				</ul>
				<span />
			</div>
		);
	}

	render() {
		return (
			<div className={s.root}>
				<h1 className={s.categoryName}>{this.props.catStyleParts.name ? this.props.catStyleParts.name : null}</h1>
				<div className={s.greybox}>
					<div>
						<span className={s.selTopBar}>Please select a style that properly matches your vehicle.</span>
					</div>
					<div className={s.styleSelect}>
						<button className={cx('btn btn-default', s.styleButton)} type="button" data-toggle="dropdown" onClick={this.unhideChoices}>{(this.props.vehicle.style && !this.props.showStyle) ? this.props.vehicle.style : 'Select a Style'} <span className="caret"></span></button>
						{(this.props && this.props.showStyle) ? this.showStyleChoices() : null}
					</div>
				</div>
				<div>
					{this.props.vehicle.style ? this.getParts() : ''}
				</div>
			</div>
		);
	}

}

export default VehicleStyle;
