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
// import AppGuide from './components/AppGuides/AppGuide/AppGuide';
import Terms from './components/Terms';
import Warranties from './components/Warranties';
import LatestNews from './components/LatestNews';
import LatestNewsItem from './components/LatestNewsItem';
import LandingPage from './components/LandingPage';
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';
import Envision from './components/Envision/Envision';
import { iapiBase, apiBase, apiKey, brand } from './config';
import LookupActions from './actions/LookupActions';
import VehicleActions from './actions/VehicleActions';

const isBrowser = typeof window !== 'undefined';
const KEY = apiKey;
const gaOptions = { debug: true };
const MyWindowDependentLibrary = isBrowser ? ga.initialize('UA-61502306-1', gaOptions) : undefined;

const router = new Router(on => {
	on('*', async (state, next) => {
		if (!state.context) {
			state.context = {};
		}
		state.context.params = state.params;
		const slugContainer = state.params[0];
		const slug = slugContainer.replace(/\//g, '');
		if (slug === '_ahhealth' || slug.indexOf('health') >= 0) {
			return null;
		}

		const [yearResponse, catResponse, contentAllReponse, siteContentResponse] = await Promise.all([
			fetch(`/api/vehicle/category`),
			fetch(`/api/category`),
			fetch(`/api/content/all`),
			// slug !== '' ? fetch(`/api/content/slug/${slug}`) : null,
			null,
		]);

		try {
			state.context.categories = await catResponse.json();
			const vehicleResponse = await yearResponse.json();
			if (vehicleResponse.availableYears !== undefined) {
				state.context.years = vehicleResponse.availableYears;
			}
			state.context.siteContents = await contentAllReponse.json();
			const siteContent = await siteContentResponse.json();
			if (siteContent.metaDescription !== undefined && siteContent.metaTitle !== undefined) {
				const seo = {
					description: siteContent.metaDescription,
					title: siteContent.metaTitle,
				};
				state.context.seo(seo);
			} else {
				const seo = {
					description: 'From grille guards and modular Jeep bumpers to side bars, bull bars and floor liners, ARIES truck and SUV accessories offer a custom fit for your vehicle.',
					title: 'Aries Automotive',
				};
				state.context.seo(seo);
			}
		} catch (e) {
			state.context.error = e;
		}
		if (MyWindowDependentLibrary !== undefined) {
			ga.initialize('UA-61502306-1', gaOptions);
		}
		ga.pageview('arieact:' + state.path);
		const component = await next();
		return component && <App context={state.context}>{component}</App>;
	});

	on('/part/:id', async (state) => {
		state.context.id = state.params.id;
		try {
			const url = `${apiBase}/part/${state.context.id}?key=${KEY}&brandID=${brand}`;
			const featuredUrl = `${apiBase}/part/featured?brandID=${brand}&key=${KEY}`;
			const [partResp, featuredResp] = await Promise.all([
				fetch(url, {
					method: 'get',
				}),
				fetch(featuredUrl, {
					method: 'get',
				}),
			]);
			state.part = await partResp.json();
			state.featured = await featuredResp.json();
		} catch (e) {
			state.context.error = e;
		}
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
		let searchResult = {};
		let term = '';
		try {
			const searchResponse = await fetch(`${apiBase}/search/${state.params.term}?key=${KEY}&brandID=${brand}`);

			searchResult = await searchResponse.json();
			term = state.params.term;
		} catch (e) {
			state.context.error = e;
		}

		return <SearchResults context={state.context} searchResult={searchResult} term={term} />;
	});

	on('/search', async (state) => {
		let searchResult = {};
		let term = '';
		try {
			const searchResponse = await fetch(`${apiBase}/search/${state.query.term}?key=${KEY}&brandID=${brand}`);

			searchResult = await searchResponse.json();
			term = state.query.term;
		} catch (e) {
			state.context.error = e;
		}

		return <SearchResults context={state.context} searchResult={searchResult} term={term} />;
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
		try {
			const url = `${iapiBase}/envision/vehicle?key=${apiKey}&year=${state.params.year}&make=${state.params.make}&model=${state.params.model}`;
			const icon = await fetch(url, { method: 'get' }).then((result) => {
				return result.json();
			});
			if (icon.vehicleParts.length > 0) {
				state.context.vehicleParts = icon.vehicleParts;
				state.context.iconParts = icon.partNumbers;
			}
		} catch (e) {
			state.context.error = e.message;
		}
		state.context.params = state.params;
		LookupActions.set({
			year: state.params.year,
			make: state.params.make,
			model: state.params.model,
		});
		VehicleActions.set({
			year: state.params.year,
			make: state.params.make,
			model: state.params.model,
		});
		return <VehicleResults context={state.context} win={state.win} />;
	});

	on('/about', async (state) => {
		return <About context={state.context} />;
	});

	on('/appguides', async (state) => {
		return <AppGuides context={state.context} />;
	});

	on('/appguides/:guide/:page', async (state) => {
		let guide = {};
		let appGuideInfo = {};
		const collection = state.params.guide;
		const page = state.params.page;
		try {
			const [guideResponse, appGuideInfoResponse] = await Promise.all([
				fetch(`${apiBase}/vehicle/mongo/apps?key=${KEY}&brandID=${brand}&collection=${collection}&limit=1000&page=${page}`, {
					method: 'post',
					headers: {
						'Accept': 'application/json',
					},
				}),
				fetch(`${iapiBase}/appguides/guide?collection=${collection}&key=${KEY}&brandID=${brand}`, {
					method: 'get',
					headers: {
						'Accept': 'application/json',
					},
				}),
			]);

			guide = await guideResponse.json();
			appGuideInfo = await appGuideInfoResponse.json();
			guide.name = collection;
			guide.appGuide = appGuideInfo;
		} catch (e) {
			state.context.error = e;
		}
		return <AppGuides guide={guide} context={state.context} />;
	});

	on('/becomedealer', async (state) => {
		return <BecomeDealer context={state.context} />;
	});

	on('/contact', async (state) => {
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
		state.context.id = state.params.id;
		try {
			const url = `${apiBase}/news/${state.params.id}?brand=${brand}&key=${apiKey}`;
			const resp = await fetch(url);
			state.item = await resp.json();
		} catch (e) {
			state.context.error = e;
		}
		return <LatestNewsItem context={state.context} item={state.item} />;
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

	on('/lp/:id', async (state, next) => {
		state.context.id = state.params.id;
		try {
			const url = `${apiBase}/lp/${state.params.id}?brand=${brand}&key=${apiKey}`;
			const resp = await fetch(url);
			state.page = await resp.json();
		} catch (e) {
			state.context.error = e;
		}
		const comp = await next();
		return comp && <LandingPage context={state.context} page={state.page} />;
	});

	on('/', async (state) => {
		state.context.featuredProducts = [];
		state.context.testimonials = [];
		state.context.carouselImages = [
			{
				image: 'https://storage.googleapis.com/aries-website/hero-images/jeep.png',
				text: 'Never Fear the Uncertain Road',
				button_text: 'VIEW BULL BARS',
				link: '/category/332',
				order: 5,
				styles: {
					backgroundImage: 'url(https://storage.googleapis.com/aries-website/hero-images/jeep.png)',
				},
			}, {
				image: 'https://storage.googleapis.com/aries-website/hero-images/GrandCherokee.png',
				text: 'Find Out What It Means to Be a Pro',
				button_text: 'VIEW PRO SERIES',
				link: '/category/331',
				order: 2,
				styles: {
					backgroundImage: 'url(https://storage.googleapis.com/aries-website/hero-images/GrandCherokee.png)',
				},
			}, {
				image: 'https://storage.googleapis.com/aries-website/hero-images/JeepWrangler2015.png',
				text: 'Choose Your Configuration and Start Customizing',
				button_text: 'VIEW MODULAR BUMPERS',
				link: '/category/324',
				order: 3,
				styles: {
					backgroundImage: 'url(https://storage.googleapis.com/aries-website/hero-images/JeepWrangler2015.png)',
				},
			}, {
				image: 'https://storage.googleapis.com/aries-website/hero-images/Floor%20Liner%20-%20Grey%20(1).jpg',
				text: 'ARIES Unveils StyleGuard™ as New Name for Floor Liners',
				button_text: 'READ MORE',
				link: '/news/47',
				order: 1,
				styles: {
					backgroundImage: `url('https://storage.googleapis.com/aries-website/hero-images/Floor%20Liner%20-%20Grey%20(1).jpg')`,
				},
			}, {
				image: 'https://storage.googleapis.com/aries-website/hero-images/navyjeep.jpg',
				text: 'Decked Out Jeep to Be Donated to Navy SEAL Foundation',
				button_text: 'READ MORE',
				link: '/news/48',
				order: 4,
				styles: {
					backgroundImage: 'url(https://storage.googleapis.com/aries-website/hero-images/navyjeep.jpg)',
				},
			},
		];
		try {
			const featResponse = await fetch(`/api/part/featured`);
			const testResponse = await fetch(`${apiBase}/testimonials?key=${KEY}&count=2&randomize=true&brandID=${brand}`);

			state.context.featuredProducts = await featResponse.json();
			state.context.testimonials = await testResponse.json();
		} catch (e) {
			state.context.error = e;
		}

		return <Home context={state.context} />;
	});

	on('error', (state, error) => state.statusCode === 404 ?
		<App context={state.context} error={error}><NotFoundPage /></App> :
		<App context={state.context} error={error}><ErrorPage /></App>
	);
});

export default router;
