sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"riskassessment/utils/Validator"
], function(Controller, Validator) {
	"use strict";

	return Controller.extend("riskassessment.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function() {
			var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},
		validateFieldGroup: function(sFieldGroupId) {
			var aControls = this.getControlsByFieldGroupId(sFieldGroupId);
			if (!aControls) {
				return false;
			}
			var bValid = true;
			for (var i = 0; i < aControls; i++) {
				var oControl = aControls[i];
			}
			return bValid;
		},

		/** 
		 * This function can be called to perform input validation on any control
		 * @param sControlName - The control object to validate 
		 * @returns - Will return true or false
		 */
		validateControl: function(sControlName) {
			return this.validate(this.getView().byId(sControlName));
		},
		/** 
		 * function to validate fieldgroups and controls. utilises the Validator control
		 * @param {string|array|control} subject - subject of validation
		 * @returns
		 */
		validate: function(subject) {
			//removed function cause error state is set on each control individually
			//moved from Validator.js due to possible looping of Validator.validate function
			//sap.ui.getCore().getMessageManager().removeAllMessages();
			if (typeof subject === 'string' || subject instanceof String || subject instanceof Array) {
				// it's a string or an array
				var aControls = sap.ui.getCore().byFieldGroupId(subject);
				if (aControls && aControls.length > 0) {
					var validator = new Validator();
					var bValid = true;
					for (var i = 0; i < aControls.length; i++) {
						if (aControls[i].getVisible() && !validator.validate(aControls[i])) {
							bValid = false;
						}
					}
					return bValid;
				} else {
					console.error("no controls found for subject ");
					console.error(subject);
				}
			} else {

				var validator = new Validator();
				return validator.validate(subject);
			}
		}

	});

});