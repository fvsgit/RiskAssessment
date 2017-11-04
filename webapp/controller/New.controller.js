sap.ui.define([
	"riskassessment/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function(BaseController, Filter, MessageToast, JSONModel) {
	"use strict";

	return BaseController.extend("riskassessment.controller.New", {

		onInit: function() {
			this.getRouter().getRoute("new").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function(oEvent) {

			var oModel = this.getView().getModel("main");
			var aAssessments = oModel.getProperty("/Assessments");
			var sNewId = (aAssessments.length + 1).toString();

			var oNewModel = new JSONModel({
				"NewEntry": {
					"Id": sNewId,
					"Name": "",
					"Description": "",
					"Status": 0,
					"Likelihood": "",
					"LikelihoodKey": "",
					"Concequence": "",
					"ConcequenceKey": "",
					"Score": 0,
					"ScoreText": "",
					"ScoreState": "None",
					"Parties": []
				}
			});
			this.getView().setModel(oNewModel, "NewModel");
		},

		onNavBack: function() {
			history.go(-1);
		},
		onPress_btnSave: function() {

			var oNewEntry = this.getView().getModel("NewModel").getProperty("/NewEntry");
			var oModel = this.getView().getModel("main");
			var aAssessments = oModel.getProperty("/Assessments");
			aAssessments.push(oNewEntry);
			oModel.setProperty("/Assessments", aAssessments);
			history.go(-1);
		},
		onPress_btnCancel: function() {
			history.go(-1);
		},
		onPress_SelectDialog: function(oEvent) {

			var oSourceId = oEvent.getSource().getId();
			var sFragmentName = "";
			var oModel = this.getView().getModel("main");
			var sModelName = "main";
			if (oSourceId.includes("btnSelectLikelihood")) {
				sFragmentName = "Likelihood";
			} else if (oSourceId.includes("btnSelectConcequence")) {
				sFragmentName = "Concequence";
			} else if (oSourceId.includes("btnAdd")) {
				sFragmentName = "AddPerson";
				oModel = new JSONModel({
					"FirstName": "",
					"LastName": "",
					"JobTitle": "",
					"Signature": "sap-icon://signature"
				});
				sModelName = "NewPersonModel";
				this.getView().setModel(oModel, sModelName);
			}

			this._oDialog = sap.ui.xmlfragment("riskassessment.fragment." + sFragmentName, this);
			this._oDialog.setModel(oModel, sModelName);

			var oDataTemplate = new sap.ui.core.CustomData({
				key: "entity",
				value: sFragmentName
			});
			this._oDialog.addCustomData(oDataTemplate);

			//Get the item bindings if the fragment contains a list
			var oItemBindings = this._oDialog.getBinding("items");
			if (oItemBindings !== undefined) {
				// clear the old search filter
				oItemBindings.filter([]);
			}

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},
		handleSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Title", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleClose: function(oEvent) {

			var oDialog = oEvent.getSource();
			var aCustomData = oDialog.getCustomData();
			var sKey = aCustomData[0].getKey();
			var sValue = aCustomData[0].getValue();

			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts !== undefined && aContexts.length) {

				if (sKey === "entity" && sValue === "Likelihood") {
					this.getView().getModel("NewModel").setProperty("/NewEntry/Likelihood", aContexts[0].getObject().Title);
					this.getView().getModel("NewModel").setProperty("/NewEntry/LikelihoodKey", aContexts[0].getObject().Id);
				} else if (sKey === "entity" && sValue === "Concequence") {
					this.getView().getModel("NewModel").setProperty("/NewEntry/Concequence", aContexts[0].getObject().Title);
					this.getView().getModel("NewModel").setProperty("/NewEntry/ConcequenceKey", aContexts[0].getObject().Id);
				}
			}
			//Get the item bindings if the fragment contains a list
			var oItemBindings = oEvent.getSource().getBinding("items");
			if (oItemBindings !== undefined) {
				// clear the old search filter
				oItemBindings.filter([]);
			}

			var sLikelihoodKey = this.getView().getModel("NewModel").getProperty("/NewEntry/LikelihoodKey");
			var sConcequenceKey = this.getView().getModel("NewModel").getProperty("/NewEntry/ConcequenceKey");
			var sMatrixKey = sLikelihoodKey + sConcequenceKey;
			if (sMatrixKey !== undefined && sMatrixKey.length === 2) {
				var aMatrix = this.getView().getModel("main").getProperty("/Matrix");
				for (var i = 0; i < aMatrix.length; i++) {
					if (aMatrix[i].Key === sMatrixKey) {
						this.getView().getModel("NewModel").setProperty("/NewEntry/Score", aMatrix[i].Score);
						this.getView().getModel("NewModel").setProperty("/NewEntry/ScoreText", aMatrix[i].ScoreText);
						this.getView().getModel("NewModel").setProperty("/NewEntry/ScoreState", aMatrix[i].State);
						break;
					}
				}
			}
		},
		onPress_PersonAddClose: function() {
			this._oDialog.close();
			var oDialog = this._oDialog;
			var aCustomData = oDialog.getCustomData();
			var sKey = aCustomData[0].getKey();
			var sValue = aCustomData[0].getValue();

			if (sKey === "entity" && sValue === "AddPerson") {
				var oNewPerson = this.getView().getModel("NewPersonModel").getData();
				var aInvolvedParties = this.getView().getModel("main").getProperty("/InvolvedParties");
				aInvolvedParties.push(oNewPerson);
				this.getView().getModel("main").setProperty("/InvolvedParties", aInvolvedParties);
			}
		},
		onDelete_lstInvolvedParties: function(oEvent) {
			var oList = oEvent.getSource();
			var oItem = oEvent.getParameter("listItem");
			var iIndex = oItem.getBindingContextPath().replace("/InvolvedParties/","");
			var aInvolvedParties = this.getView().getModel("main").getProperty("/InvolvedParties");
			aInvolvedParties.splice(iIndex, 1);
			this.getView().getModel("main").setProperty("/InvolvedParties", aInvolvedParties);
		}

	});

});