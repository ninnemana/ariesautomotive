import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import s from './CategoryNav.scss';
import withStyles from '../../decorators/withStyles';
import Menu from './Menu';
import Search from './Search';

@withStyles(s)
class CategoryNav extends Component {

	static propTypes = {
		className: PropTypes.string,
		categories: PropTypes.array,
		menu: PropTypes.array,
		vehicle: PropTypes.object,
		params: PropTypes.object,
	};

	constructor(props) {
		super(props);

		this.categoryToItem = this.categoryToItem.bind(this);
		this.clearOpen = this.clearOpen.bind(this);

		this.state = {
			items: [],
			menusOpen: false,
		};

		if (!props.categories) {
			return;
		}

		props.categories.map((cat) => {
			this.state.items.push(this.categoryToItem(cat));
		});

		this.state.items.push({
			title: 'Application Guides',
			to: '/appguides',
			text: 'Application Guides',
		});
	}

	categoryToItem(cat) {
		const item = {
			title: cat.title,
			to: `/category/${cat.id}/${cat.title}`,
			text: cat.title,
			children: cat.children.map(this.categoryToItem),
		};

		return item;
	}

	clearOpen(title) {
		let update = title;
		if (title === this.state.openTitle) {
			update = '';
		}
		this.setState({
			openTitle: update,
		});
	}

	render() {
		return (
			<div className={cx(s.root, this.props.className)}>
				<nav itemScope itemType="http://www.schema.org/SiteNavigationElement">
					<Menu openItem={this.clearOpen} open={this.state.menusOpen} openTitle={this.state.openTitle} isParent items={this.state.items} className={s.categories} />
				</nav>
				<Search className={s.search} />
			</div>
		);
	}

}

export default CategoryNav;
