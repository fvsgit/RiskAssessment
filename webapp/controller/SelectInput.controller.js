sap.ui.define([
	"riskassessment/controller/BaseController",
	"sap/ui/model/Filter"
], function(BaseController, Filter) {
	"use strict";

	return BaseController.extend("riskassessment.controller.SelectInput", {

		onInit: function() {
			this.getRouter().getRoute("selectInput").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {

			var sEntity = this.getView().getModel("AppModel").getProperty("/SelectInput/Entity");
			var oList = this.getView().byId("lstList");
			oList.setModel(this.getView().getModel("main"));
			oList.bindItems("/" + sEntity,
				new sap.m.StandardListItem({
					title: "{Title}",
					description: "{Description}"
				}));
		},
		onNavBack: function() {
			this._navigateBack();
		},
		onSearch: function(oEvent) {
			var oFilters;
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {

				oFilters = new Filter({
					filters: [
						new Filter("Title", sap.ui.model.FilterOperator.Contains, sQuery),
						new Filter("Description", sap.ui.model.FilterOperator.Contains, sQuery)
					],
					and: false
				});
			}

			// update list binding
			var list = this.getView().byId("lstList");
			var binding = list.getBinding("items");
			binding.filter(oFilters, "Application");
		},
		onSelectionChange: function(oEvt) {

			var oList = oEvt.getSource();
			var aContexts = oList.getSelectedContexts(true);

			var sDestinationKey = this.getView().getModel("AppModel").getProperty("/SelectInput/DestinationKey");
			var sDestinationValue = this.getView().getModel("AppModel").getProperty("/SelectInput/DestinationValue");

			this.getView().getModel("NewModel").setProperty(sDestinationKey, aContexts[0].getObject().Id);
			this.getView().getModel("NewModel").setProperty(sDestinationValue, aContexts[0].getObject().Title);

			//set the trigger in the app model
			this.getView().getModel("AppModel").setProperty("/Trigger", "SelectInput");

			this._navigateBack();
		},
		_navigateBack: function() {
			
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.publish("selectInput", "selectInputClosed", {});
			history.go(-1);
		}
	});

});