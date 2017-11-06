sap.ui.define([
	"riskassessment/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("riskassessment.controller.AddPerson", {

		onInit: function() {
			this.getRouter().getRoute("addPerson").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {
			var oModel = new JSONModel({
				"FirstName": "",
				"LastName": "",
				"JobTitle": "",
				"Signature": "sap-icon://signature"
			});
			this.getView().setModel(oModel, "NewPersonModel");
		},
		onNavBack: function() {
			this._navigateBack();
		},
		onPress_btnAdd: function() {

			if (this.validate("addPersonGroup")) {

				var oEventBus = sap.ui.getCore().getEventBus();
				oEventBus.publish("addPerson", "addPersonClosed", this.getView().getModel("NewPersonModel").getData());
				this._navigateBack();
			}
		},
		onPress_btnCancel: function() {
			this._navigateBack();
		},
		_navigateBack: function() {
			history.go(-1);
		}
	});

});