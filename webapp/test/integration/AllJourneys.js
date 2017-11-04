jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
		"sap/ui/test/Opa5",
		"riskassessment/test/integration/pages/Common",
		"sap/ui/test/opaQunit",
		"riskassessment/test/integration/pages/Worklist",
		"riskassessment/test/integration/pages/Object",
		"riskassessment/test/integration/pages/NotFound",
		"riskassessment/test/integration/pages/Browser",
		"riskassessment/test/integration/pages/App"
	], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "riskassessment.view."
	});

	sap.ui.require([
		"riskassessment/test/integration/WorklistJourney",
		"riskassessment/test/integration/ObjectJourney",
		"riskassessment/test/integration/NavigationJourney",
		"riskassessment/test/integration/NotFoundJourney"
	], function () {
		QUnit.start();
	});
});