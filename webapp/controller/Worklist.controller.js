sap.ui.define([
	"riskassessment/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"riskassessment/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox"
], function(BaseController, JSONModel, formatter, Filter, FilterOperator, MessageBox) {
	"use strict";

	return BaseController.extend("riskassessment.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("main").getPath();
			var oObject = this.getView().getModel("main").getProperty(sPath);
			this._showObject(oObject.Id);
		},

		/**
		 * Event handler for navigating back.
		 * We navigate back in the browser historz
		 * @public
		 */
		onNavBack: function() {
			history.go(-1);
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function(sId) {
			this.getRouter().navTo("new", {
				Id: sId
			});
		},

		onPress_btnSubmit: function() { 
			// var aRisks = this.getView().getModel("main").getProperty("/Assessments");
			// var aCount = 0;
			// for (var i = 0; i < aRisks.length; i++) {
			// 	if (aRisks[i].Status === 100) {
			// 		aCount++;
			// 	}
			// }

			// if (aCount === aRisks.length) {
				MessageBox.success("The risk assessment has been submitted");
			// } else {
			// 	MessageBox.error("All risks must be 100% completed before submitting can be done");
			// }
		},

		onPress_btnAdd: function() {
			this.getRouter().navTo("new", {
				Id: "none"
			});
		}

	});
});