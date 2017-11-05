sap.ui.define([], function() {
	"use strict";

	function ValidationException(message) {
		this.message = message;
		this.name = "ValidationException";
	}

	var Validator = function() {
		this._mCustomValidators = {
			"sap.m.List": function(oControl) {
				var oCustomData = this._getCustomData(oControl);
				var sValidationMethod = oCustomData.validationMethod;
				switch (sValidationMethod) {
					case "minSelected":
						var iMinSelect = oCustomData.minSelect;
						if (iMinSelect !== undefined) {
							if (oControl.getSelectedItems().length < iMinSelect) {
								//if not enough selections were made
								throw new ValidationException("control not valid");
							}
						} else {
							throw new ValidationException("missing validation parameter");
						}
						break;
					case "minRows":
						var iMinRows = oCustomData.minRows;
						if (iMinRows !== undefined) {
							if (oControl.getItems().length < iMinRows) {
								//if not enough selections were made
								throw new ValidationException("control not valid");
							}
						} else {
							throw new ValidationException("missing validation parameter");
						}
						break;
					default:
						throw new ValidationException("no validation method defined");
				}
			},
			"sap.m.Input": function(oControl) {
				var oCustomData = this._getCustomData(oControl);
				var sValidationMethod = oCustomData.validationMethod;
				switch (sValidationMethod) {
					case "matchEmail":
						var sRegEx = oCustomData.regEx;
						if (sRegEx !== undefined) {
							if (!sRegEx.test(oControl.getValue())) {

								//if not enough selections were made
								throw new ValidationException("control not valid");
							}
						} else {
							throw new ValidationException("missing validation parameter");
						}
						break;

					default:
						throw new ValidationException("no validation method defined");
				}
			}
		};
		this._mValidationMapping = {
			"sap.m.Input": {
				validationProperties: ["value"]
			},
			"sap.m.MaskInput": {
				validationProperties: ["value"]
			},
			"sap.m.TextArea": {
				validationProperties: ["value"]
			},
			"sap.m.Select": {
				validationProperties: ["selectedKey"]
			},
			"sap.m.DatePicker": {
				validationProperties: ["value"]
			},
			"sap.m.DateRangeSelection": {
				validationProperties: ["dateValue", "secondDateValue"]
			},
			"sap.m.List": {
				customValidator: this._mCustomValidators["sap.m.List"].bind(this)
			},
			"sap.ui.layout.form.SimpleForm": {
				isContainer: true,
				aggregations: ["form"]
			},
			"sap.ui.layout.form.Form": {
				isContainer: true,
				aggregations: ["formContainers"]
			},
			"sap.ui.layout.form.FormContainer": {
				isContainer: true,
				aggregations: ["formElements"]
			},
			"sap.m.HBox": {
				isContainer: true,
				aggregations: ["items"]
			},
			"sap.ui.layout.form.FormElement": {
				isContainer: true,
				aggregations: ["fields"]
			},
			"sap.m.Page": {
				isContainer: true,
				aggregations: ["content"]
			},
			"sap.m.semantic.DetailPage": {
				isContainer: true,
				aggregations: ["content"]
			}
		};
		this._mIgnoredControls = {
			"sap.m.SelectList": true,
			"sap.m.Popover": true,
			"sap.ui.unified.Calendar": true,
			"sap.ui.unified.calendar.Header": true,
			"sap.ui.unified.calendar.Month": true,
			"sap.ui.unified.calendar.MonthPicker": true,
			"sap.ui.unified.calendar.YearPicker": true
		};

	};

	Validator.prototype.validate = function(oControl) {
		//check if there are validation rules for the specified control
		if (this._isValidControl(oControl)) {
			if (!this._isContainer(oControl)) {
				if (!this._isIgnored(oControl)) {
					return this._validateControl(oControl);
				} else {
					return true;
				}
			} else {
				return this._validateContainer(oControl);
			}
		} else {
			return false;
		}
	};

	/** private functions **/
	Validator.prototype._isValidControl = function(oControl, bSilence) {
		if (!this._getMapping(oControl)) {
			if (!bSilence && oControl.getVisible()) {
				console.error("no rule specified for control " + this._getClassName(oControl));
			}
			return false;
		}
		return true;
	};

	Validator.prototype._isIgnored = function(oControl) {
		var sClassName = this._getClassName(oControl);
		return this._mIgnoredControls[sClassName] ? true : false;
	};

	Validator.prototype._isContainer = function(oControl) {
		return this._getMapping(oControl).isContainer;
	};

	Validator.prototype._validateControl = function(oControl) {
		var oMapping = this._getMapping(oControl);
		var bValid = true;
		var sErrorText;
		if (oMapping.customValidator) {
			//use custom validator function if defined
			try {
				oMapping.customValidator(oControl);
			} catch (Exception) {
				bValid = false;
				sErrorText = Exception.message;
			}
		} else {
			//check for types first
			try {
				var aValidationProperties = oMapping["validationProperties"];
				var bHasTypeDefinition = false;
				for (var i = 0; i < aValidationProperties.length; i++) {
					if (oControl.getBinding(aValidationProperties[i]) && oControl.getBinding(aValidationProperties[i]).getType()) {
						try {
							bHasTypeDefinition = true;

							//use type validation
							var oControlBinding = oControl.getBinding(aValidationProperties[i]);
							var oExternalValue = oControl.getProperty(aValidationProperties[i]);
							var oInternalValue = oControlBinding.getType().parseValue(oExternalValue, oControlBinding.sInternalType);
							oControlBinding.getType().validateValue(oInternalValue);
						} catch (Exception) {
							bValid = false;
							sErrorText = Exception.message;
						}
					}
				}
			} catch (Exception) {
				bValid = true;
			}
		}

		if (!bHasTypeDefinition && !oMapping.customValidator) {
			//if type definition not found check for custom required tag
			//check for standard input required && custom data required
			var bRequired = oControl.getRequired ? oControl.getRequired() : false;
			var oCustomData = this._getCustomData(oControl);
			if (oCustomData) {
				if (oCustomData.required === "true") {
					bRequired = true;
				}
			}
			if (bRequired) {
				//if shorthand required is set
				for (var i = 0; i < aValidationProperties.length; i++) {
					var oExternalValue = oControl.getProperty(aValidationProperties[i]);
					if (oExternalValue === "" || oExternalValue === null) {
						bValid = false;
					}
				}
			}
		}
		if (bValid) {
			this._clearValueState(oControl);
		} else {
			//Check if the control has text defined for the value state
			var sDefinedValueStateText = oControl.getValueStateText ? oControl.getValueStateText() : undefined;
			if (sDefinedValueStateText && sDefinedValueStateText !== undefined) {
				//Overwrite the error text with the defined valueStateText
				sErrorText = sDefinedValueStateText;
			}
			this._setErrorValueState(oControl, sErrorText);
		}
		return bValid;
	};

	Validator.prototype._getCustomData = function(oControl) {
		var oData = {};
		if (oControl) {
			var aData;
			if ((aData = oControl.getCustomData()).length > 0) {
				for (var i = 0; i < aData.length; i++) {
					oData[aData[i].getKey()] = aData[i].getValue();
				}
			}
		}
		if (Object.keys(oData).length > 0) {
			//only return object if at least one key is set
			return oData;
		}
	};

	Validator.prototype._clearValueState = function(oControl) {
		oControl.setValueState ? oControl.setValueState(sap.ui.core.ValueState.None) : "";
		oControl.fireValidationSuccess({
			element: oControl
		});
	};

	Validator.prototype._setErrorValueState = function(oControl, sMessage) {
		var oMapping = this._getMapping(oControl);
		oControl.setValueState ? oControl.setValueState(sap.ui.core.ValueState.Error) : "";
		if (sMessage && sMessage !== undefined && oControl.setValueStateText && oControl.setValueStateText) {
			oControl.setValueStateText(sMessage);
		}
		var mParameters = {
			element: oControl
		};
		if (sMessage) {
			mParameters.message = sMessage;
		}
		oControl.fireValidationError(mParameters);
	};

	Validator.prototype._validateContainer = function(oContainer) {
		var bIsValid = true;
		var oMapping = this._getMapping(oContainer);
		var aKeys = oMapping.aggregations;
		//run through defined aggregations to validate the controls
		for (var i = 0; i < aKeys.length; i++) {
			var aContent = oContainer.getAggregation(aKeys[i]);
			if (aContent) {
				// aggregation "form" in simple form does not return an array, so better check twice
				if (aContent instanceof Array) {
					for (var a = 0; a < aContent.length; a++) {
						var oControl = aContent[a];
						//only validate controls that got some rules
						if (this._isValidControl(oControl, true)) {
							if (!this.validate(oControl)) {
								bIsValid = false;
							}
						}
					}
				} else {
					if (!this.validate(aContent)) {
						bIsValid = false;
					}
				}

			}
		}
		return bIsValid;
	};

	Validator.prototype._getMapping = function(oControl) {
		var sClassName = oControl.getMetadata().getName();
		return this._mValidationMapping[sClassName];
	};

	Validator.prototype._getClassName = function(oControl) {
		return oControl.getMetadata().getName();
	};

	return Validator;
});