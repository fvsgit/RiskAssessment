sap.ui.define([
	"riskassessment/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(BaseController, Filter, MessageToast, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("riskassessment.controller.New", {

		onInit: function() {
			this.getRouter().getRoute("new").attachPatternMatched(this._onObjectMatched, this);
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("selectInput", "selectInputClosed", this._selectInputClosed, this);
			oEventBus.subscribe("addPerson", "addPersonClosed", this._addPersonClosed, this);
		},

		_onObjectMatched: function(oEvent) {

			var sId = oEvent.getParameter("arguments").Id;
			var oModel = this.getView().getModel("main");
			var aAssessments = oModel.getProperty("/Assessments");

			if (this._getCurrentTrigger() === "") {
				//Clear the new entry model
				this.getOwnerComponent().resetNewEntryModel();
			} else {
				//Clear the trigger in the app model
				this._setCurrentTrigger("");
			}

			if (sId === "none") {
				var sNewId = (aAssessments.length + 1).toString();
				this.getView().getModel("NewModel").setProperty("/NewEntry/Id", sNewId);
				this.getView().getModel("NewModel").setProperty("/NewEntry/Mode", "Create");
			} else {
				for (var i = 0; i < aAssessments.length; i++) {
					if (aAssessments[i].Id === sId) {
						this.getView().getModel("NewModel").setProperty("/NewEntry", aAssessments[i]);
						this.getView().getModel("NewModel").setProperty("/NewEntry/Mode", "Edit");
						break;
					}
				}
			}
		},

		onNavBack: function() {
			history.go(-1);
		},
		onPress_btnSave: function() {

			if (this.validateInputData()) {
				if (this.validateList()) {

					var sMode = this.getView().getModel("NewModel").getProperty("/NewEntry/Mode");
					if (sMode === "Create") {
						var oNewEntry = this.getView().getModel("NewModel").getProperty("/NewEntry");
						var oModel = this.getView().getModel("main");
						var aAssessments = oModel.getProperty("/Assessments");
						aAssessments.push(oNewEntry);
						oModel.setProperty("/Assessments", aAssessments);
					} else {
						var oNewEntry = this.getView().getModel("NewModel").getProperty("/NewEntry");
						var oModel = this.getView().getModel("main");
						var aAssessments = oModel.getProperty("/Assessments");
						for (var i = 0; i < aAssessments.length; i++) {
							if (aAssessments[i].Id === oNewEntry.Id) {
								aAssessments[i] = oNewEntry;
								break;
							}
						}
						oModel.setProperty("/Assessments", aAssessments);
					}
					history.go(-1);
				}
			}
		},
		onPress_btnCancel: function() {
			history.go(-1);
		},
		onPress_SelectInput: function(oEvent) {

			var oSourceId = oEvent.getSource().getId();
			var sEntity = "";
			if (oSourceId.includes("btnSelectLikelihood")) {
				sEntity = "Likelihood";
			} else if (oSourceId.includes("btnSelectConcequence")) {
				sEntity = "Concequence";
			}
			this._prepareSelectInput(sEntity);
			this.getRouter().navTo("selectInput"); 
		},
		_selectInputClosed: function(sChannel, sEvent, oData) {

			if (sChannel === "selectInput" && sEvent === "selectInputClosed") {
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
				this.validateInputData();
			}
		},
		onPress_btnAddPerson: function() {
			this.getRouter().navTo("addPerson");
		},
		_addPersonClosed: function(sChannel, sEvent, oData) {

			if (sChannel === "addPerson" && sEvent === "addPersonClosed" && oData !== undefined) { 
				var aInvolvedParties = this.getView().getModel("NewModel").getProperty("/NewEntry/Parties");
				aInvolvedParties.push(oData);
				this.getView().getModel("NewModel").setProperty("/NewEntry/Parties", aInvolvedParties);

				this.validateInputData();
				this.validateList();
			}
		},
		onDelete_lstInvolvedParties: function(oEvent) {
			var oList = oEvent.getSource();
			var oItem = oEvent.getParameter("listItem");
			var iIndex = oItem.getBindingContextPath().replace("/NewEntry/Parties/", "");
			var aInvolvedParties = this.getView().getModel("NewModel").getProperty("/NewEntry/Parties");
			aInvolvedParties.splice(iIndex, 1);
			this.getView().getModel("NewModel").setProperty("/NewEntry/Parties", aInvolvedParties);
		},

		validateInputData: function() {

			if (this.validate("mainGroup")) {
				return true;
			} else {
				return false;
			}
		},

		validateList: function() {
			return this.validate(this.getView().byId("lstInvolvedParties"));
		},

		onListValidationError: function(oEvent) {
			oEvent.getSource().addStyleClass("listError");
			MessageBox.error("Al least one involved person must be added");
		},
		onListValidationSuccess: function(oEvent) {
			oEvent.getSource().removeStyleClass("listError");
		},
		_getCurrentTrigger: function() {
			//get and return the trigger in the app model
			return this.getView().getModel("AppModel").getProperty("/Trigger");
		},
		_setCurrentTrigger: function(sTrigger) {
			//set the trigger in the app model
			this.getView().getModel("AppModel").setProperty("/Trigger", sTrigger);
		},
		_prepareSelectInput: function(sEntity) {

			var sTitle = "";
			var sDestinationKey = "";
			var sDestinationValue = "";

			if (sEntity === "Likelihood") {
				sTitle = "Select " + sEntity;
				sDestinationKey = "/NewEntry/LikelihoodKey";
				sDestinationValue = "/NewEntry/Likelihood";
			} else if (sEntity === "Concequence") {
				sTitle = "Select " + sEntity;
				sDestinationKey = "/NewEntry/ConcequenceKey";
				sDestinationValue = "/NewEntry/Concequence";
			}

			this.getView().getModel("AppModel").setProperty("/SelectInput", {
				"Entity": sEntity,
				"Title": sTitle,
				"DestinationKey": sDestinationKey,
				"DestinationValue": sDestinationValue
			});
		}
	});

});