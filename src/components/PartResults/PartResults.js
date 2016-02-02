import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import s from './PartResults.scss';
import withStyles from '../../decorators/withStyles';

@withStyles(s)
class PartResults extends Component {

    static propTypes = {
        className: PropTypes.string,
        context: PropTypes.shape({}),
        parts: PropTypes.array,
    };

    constructor() {
        super();

        this.state = {
            context: {},
        };
    }

    componentWillMount() {
        if (!this.props || !this.props.parts) {
            return;
        }

        this.setState({
            parts: this.props.parts,
        });
    }

    getPrice(p) {
        if (!p.pricing || p.pricing.length > 0) {
            return;
        }

        p.pricing.map((pr, i) => {
            if (pr.type === 'List' && pr.price > 0) {
                return <span key={i} className="msrp">MSRP <span className={s.priceValue}>${parseFloat(pr.price.toFixed(2))}</span></span>;
            }
        });
    }

    partImages(p) {
        if (p.images && p.images.length > 0) {
            for (let i = 0; i < p.images.length; i++) {
                const img = p.images[i];
                if (img.size === 'Grande') {
                    return img.path.Scheme + '://' + img.path.Host + img.path.Path;
                }
            }
        }

        return '/img/partImgPlaceholder.jpg';
    }

    showAttributes(p) {
        if (!p.attributes || p.attributes.length === 0) {
            return [];
        }

        const attrs = [];
        p.attributes.forEach((attr, i) => {
            attrs.push(<li key={i}><strong>{attr.name}:</strong> {attr.value}</li>);
        });

        return attrs;
    }

    render() {
        return (
            <div className={cx(s.root, this.props.className)} role="navigation">
                {this.state.parts.map((part, i) => {
                    return (
                        <div key={i} className={cx(s.product, 'row', 'well')}>
                            <div className={s.header}>
                                <span className={s.desc}>
                                    <a href={'/part/' + part._source.part_number}>{part._source.short_description}
                                        <span className={s.partNum}>{part._source.part_number}</span>
                                    </a>
                                </span>
                            </div>

                            <div className={cx(s.image, 'col-xs-12', 'col-sm-12', 'col-md-3', 'col-lg-2')}>
                                <img className="img-responsive" src={this.partImages(part._source)} alt={'Image for ' + part._source.short_description} />
                            </div>

                            <div className="side-box col-xs-12 col-sm-12 col-md-7 col-lg-8 col-offset-md-1 col-offset-lg-1">

                                <div className={s.price}>
                                    {this.getPrice(part._source)}
                                </div>
                                <div className={s.attr}>
                                    <ul>
                                        {this.showAttributes(part._source)}
                                    </ul>
                                </div>
                            </div>
                            <div className={cx(s.nav, 'col-xs-12', 'col-sm-12', 'col-md-7', 'col-lg-8', 'col-offset-md-1', 'col-offset-lg-1')}>
                                <a href="/buy" className="btn red-transparent-button" aria-controls="Where to buy" role="button" data-toggle="tab">Where To Buy</a>
                                <a href={'/part/' + part._source.part_number} className="btn red-transparent-button" aria-controls="Part details" role="button" data-toggle="tab">View Details</a>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

}

export default PartResults;
