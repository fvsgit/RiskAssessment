sap.ui.define([
		"riskassessment/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("riskassessment.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);