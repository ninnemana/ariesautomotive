import React from 'react';
import ga from 'react-ga';
import Router from 'react-routing/src/Router';
import fetch from './core/fetch';
import App from './components/App';
import BecomeDealer from './components/BecomeDealer';
import Product from './components/Product';
import Category from './components/Category';
import Contact from './components/Contact';
import CustomContent from './components/CustomContent';
import Home from './components/Home';
import SearchResults from './components/SearchResults';
import VehicleResults from './components/VehicleResults';
import WhereToBuy from './components/WhereToBuy';
import About from './components/About';
import AppGuides from './components/AppGuides';
import Terms from './components/Terms';
import Warranties from './components/Warranties';
import LatestNews from './components/LatestNews';
import LatestNewsItem from './components/LatestNewsItem';
import LandingPage from './components/LandingPage';
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';
import Envision from './components/Envision/Envision';
import LookupActions from './actions/LookupActions';
import VehicleStore from './stores/VehicleStore';
import ContactStore from './stores/ContactStore';
import ProductStore from './stores/ProductStore';
import GeographyStore from './stores/GeographyStore';
import CategoryStore from './stores/CategoryStore';
import SiteStore from './stores/SiteStore';
import SearchStore from './stores/SearchStore';
import { apiBase, apiKey, siteMenu } from './config';

const isBrowser = typeof window !== 'undefined';
const KEY = apiKey;
const gaOptions = { debug: true };
const MyWindowDependentLibrary = isBrowser ? ga.initialize('UA-61502306-1', gaOptions) : undefined;
// const seo = {
// 	description: 'From grille guards and modular Jeep bumpers to side bars, bull bars and floor liners, ARIES truck and SUV accessories offer a custom fit for your vehicle.',
// 	title: 'Aries Automotive',
// };

const router = new Router(on => {
	on('*', async (state, next) => {
		if (!state.context) {
			state.context = {};
		}
		state.context.params = state.params;
		state.context.siteMenu = siteMenu;
		const slug = state.params[0].replace(/\//g, '');

		// let siteContentReq = null;
		// if (slug !== '' && slug !== '_ahhealth') {
		// 	siteContentReq = fetch(`${apiBase}/site/content/${slug}?key=${KEY}&brandID=${brand.id}`);
		// }

		let vehicleReq = null;
		if (state.params && state.params[0] && state.params[0].indexOf('/vehicle') === -1) {
			vehicleReq = VehicleStore.fetchVehicle;
		}

		Promise.all([
			SiteStore.fetchPageData(slug),
			vehicleReq ? vehicleReq() : null,
			CategoryStore.fetchCategories(),
			SiteStore.fetchContentMenus(),
		]);

		// try {
		// 	const siteContent = await pageContentResp.json();
		// 	if (siteContent.metaDescription !== undefined && siteContent.metaTitle !== undefined) {
		// 		seo.description = siteContent.metaDescription;
		// 		seo.title = siteContent.metaTitle;
		// 	}
		//
		// 	state.context.seo(seo);
		// } catch (e) {
		// 	state.context.error = e;
		// }

		if (MyWindowDependentLibrary !== undefined) {
			ga.initialize('UA-61502306-1', gaOptions);
		}
		ga.pageview('aries:' + state.path);

		const component = await next();
		return component && <App context={state.context}>{component}</App>;
	});

	on('/part/:id', async (state) => {
		Promise.all([
			ProductStore.fetchFeatured(),
			ProductStore.fetchProduct(state.params.id),
		]);

		return <Product {...state} />;
	});

	on('/category/:id', async (state) => {
		try {
			const url = `${apiBase}/category/${state.params.id}?key=${KEY}`;
			const catResponse = await fetch(url, {
				method: 'get',
			});

			state.context.category = await catResponse.json();
		} catch (e) {
			state.context.error = e;
		}

		return <Category context={state.context} category={state.context.category} />;
	});

	on('/category/:id/:title', async (state) => {
		try {
			const url = `${apiBase}/category/${state.params.id}?key=${KEY}`;
			const catResponse = await fetch(url, {
				method: 'get',
			});

			state.context.category = await catResponse.json();
		} catch (e) {
			state.context.error = e;
		}

		return <Category context={state.context} category={state.context.category} />;
	});

	on('/category/:id/:title/:sub', async (state) => {
		try {
			const url = `${apiBase}/category/${state.params.id}?key=${KEY}`;
			const catResponse = await fetch(url, {
				method: 'get',
			});

			const partURL = `${apiBase}/category/${state.params.id}/parts?key=${KEY}`;
			const partResponse = await fetch(partURL, {
				method: 'get',
			});

			state.context.category = await catResponse.json();
			state.context.category.parts = await partResponse.json();
		} catch (e) {
			state.context.error = e;
		}

		return <Category context={state.context} category={state.context.category} />;
	});

	on('/search/:term', async (state) => {
		await SearchStore.fetchSearchResults(state.params.term);
		return <SearchResults context={state.context} />;
	});

	on('/search', async (state) => {
		await SearchStore.fetchSearchResults(state.query.term);
		return <SearchResults context={state.context} />;
	});

	on('/vehicle', async (state) => {
		state.context.params = state.params;
		return <VehicleResults context={state.context} />;
	});

	on('/vehicle/:year', async (state) => {
		state.context.params = state.params;
		LookupActions.set({
			year: state.params.year,
		});
		return <VehicleResults context={state.context} />;
	});

	on('/vehicle/:year/:make', async (state) => {
		state.context.params = state.params;
		LookupActions.set({
			year: state.params.year,
			make: state.params.make,
		});
		return <VehicleResults context={state.context} />;
	});

	on('/vehicle/:year/:make/:model', async (state) => {
		state.context.params = state.params;
		await VehicleStore.fetchVehicle(state.params.year, state.params.make, state.params.model);
		return <VehicleResults context={state.context} />;
	});

	on('/about', async (state) => {
		return <About context={state.context} />;
	});

	on('/appguides', async (state) => {
		return <AppGuides context={state.context} />;
	});

	on('/becomedealer', async (state) => {
		await GeographyStore.fetchCountries();
		return <BecomeDealer context={state.context} />;
	});

	on('/contact', async (state) => {
		Promise.all([
			ContactStore.fetchTypes(),
			GeographyStore.fetchCountries(),
		]);

		return <Contact context={state.context} />;
	});

	on('/terms', async (state) => {
		return <Terms context={state.context} />;
	});

	on('/news', async (state) => {
		return <LatestNews context={state.context} />;
	});

	on('/envision', async (state) => {
		const loc = typeof window !== 'undefined' ? window.location : '';
		return <Envision context={state.context} protocol={loc.protocol}/>;
	});

	on('/news/:id', async (state) => {
		SiteStore.fetchNewsItem(state.params.id);
		return <LatestNewsItem context={state.context} />;
	});

	on('/buy', async (state) => {
		state.context.id = state.params.id;
		return <WhereToBuy context={state.context} google={state.google} navigator={state.navigator} />;
	});

	on('/warranties', async (state) => {
		state.context.id = state.params.id;
		return <Warranties context={state.context} />;
	});

	on('/styleguard', (state, next) => {
		state.redirect = '/category/321/Interior/StyleGuard%20Floor%20Liners';
		next();
	});

	on('/page/:id', async (state) => {
		state.context.id = state.params.id;
		for (let i = 0; i < state.context.siteContents.length; i++) {
			if (state.context.siteContents[i].id.toString() === state.params.id) {
				state.context.customContent = state.context.siteContents[i];
			}
		}
		return <CustomContent context={state.context} />;
	});

	on('/lp/:id', async (state) => {
		SiteStore.fetchLandingPage(state.params.id);
		return <LandingPage context={state.context} />;
	});

	on('/', async (state) => {
		Promise.all([
			ProductStore.fetchFeatured(),
			SiteStore.fetchTestimonials(),
		]);

		return <Home context={state.context} />;
	});

	on('error', (state, error) => state.statusCode === 404 ?
		<App context={state.context} error={error}><NotFoundPage /></App> :
		<App context={state.context} error={error}><ErrorPage /></App>
	);
});

export default router;
