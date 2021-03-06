import AppDispatcher from '../dispatchers/AppDispatcher';

class VehicleActions {
	constructor() {
		this.generateActions('getCategoryStyles', 'set', 'setShowStyleState', 'setActiveCategory', 'setStyle', 'addPartToVehicle', 'removePartFromVehicle', 'setIconParts', 'setLookupCategories');
	}
}

export default AppDispatcher.createActions(VehicleActions);
