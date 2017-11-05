sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createMainModel: function() {
			var oModel = new JSONModel({
				"Assessments": [{
					"Id": "1",
					"Name": "Electrical Risk",
					"Description": "Some wires are not isulated", 
					"Likelihood": "",
					"LikelihoodKey": "",
					"Concequence": "",
					"ConcequenceKey": "",
					"Score": 5,
					"ScoreText": "Low",
					"ScoreState": "None",
					"ManagerSignature": "",
					"Parties": [] 
				}, {
					"Id": "2",
					"Name": "Cemical hazard",
					"Description": "Leaks detected",
					"Likelihood": "",
					"LikelihoodKey": "",
					"Concequence": "",
					"ConcequenceKey": "",
					"Score": 12,
					"ScoreText": "Medium",
					"ScoreState": "None",
					"ManagerSignature": "",
					"Parties": [] 
				}, {
					"Id": "3",
					"Name": "Water leaks",
					"Description": "N/A",
					"Likelihood": "",
					"LikelihoodKey": "",
					"Concequence": "",
					"ConcequenceKey": "",
					"Score": 18,
					"ScoreText": "Significant",
					"ScoreState": "None",
					"ManagerSignature": "aaaa",
					"Parties": [] 
				}],
				"Likelihood": [{
					"Id": "1",
					"Title": "Rare",
					"Description": "Will only occur in exceptional circumstances"
				}, {
					"Id": "2",
					"Title": "Unlikely",
					"Description": "Not likely to occur in the foreseeable future, or within the project lifecycle"
				}, {
					"Id": "3",
					"Title": "Possible",
					"Description": "May occur in the foreseeable future, or within the project lifecycle"
				}, {
					"Id": "4",
					"Title": "Likely",
					"Description": "Likely to occur in the foreseeable future, or within the project lifecycle"
				}, {
					"Id": "5",
					"Title": "Almost Certain",
					"Description": "Almost certain to occur in the foreseeable future, or within the project lifecycle"
				}],
				"Concequence": [{
					"Id": "1",
					"Title": "Minor",
					"Description": "No treatment required"
				}, {
					"Id": "2",
					"Title": "Medium",
					"Description": "Minor injury requiring First Aid treatment (e.g. minor cuts, bruises, bumps)"
				}, {
					"Id": "3",
					"Title": "Serious",
					"Description": "Injury requiring medical treatment or lost time"
				}, {
					"Id": "4",
					"Title": "Disabling",
					"Description": "Serious injury (injuries) requiring specialist medical treatment or hospitalisation"
				}, {
					"Id": "5",
					"Title": "Fatal",
					"Description": "Loss of life, permenent disablility or multiple serious injuries"
				}],
				"Matrix": [{
					"Key": "11",
					"Score": 1,
					"ScoreText": "Low",
					"State": "Success"
				}, {
					"Key": "12",
					"Score": 3,
					"ScoreText": "Low",
					"State": "Success"
				}, {
					"Key": "13",
					"Score": 6,
					"ScoreText": "Medium",
					"State": "Warning"
				}, {
					"Key": "14",
					"Score": 10,
					"ScoreText": "Medium",
					"State": "Warning"
				}, {
					"Key": "15",
					"Score": 15,
					"ScoreText": "Significant",
					"State": "Error"
				}, {
					"Key": "21",
					"Score": 2,
					"ScoreText": "Low",
					"State": "Success"
				}, {
					"Key": "22",
					"Score": 5,
					"ScoreText": "Low",
					"State": "Success"
				}, {
					"Key": "23",
					"Score": 9,
					"ScoreText": "Medium",
					"State": "Warning"
				}, {
					"Key": "24",
					"Score": 14,
					"ScoreText": "Significant",
					"State": "Error"
				}, {
					"Key": "25",
					"Score": 19,
					"ScoreText": "Significant",
					"State": "Error"
				}, {
					"Key": "31",
					"Score": 4,
					"ScoreText": "Low",
					"State": "Success"
				}, {
					"Key": "32",
					"Score": 8,
					"ScoreText": "Medium",
					"State": "Warning"
				}, {
					"Key": "33",
					"Score": 13,
					"ScoreText": "Significant",
					"State": "Error"
				}, {
					"Key": "34",
					"Score": 18,
					"ScoreText": "Significant",
					"State": "Error"
				}, {
					"Key": "35",
					"Score": 22,
					"ScoreText": "High",
					"State": "Error"
				}, {
					"Key": "41",
					"Score": 7,
					"ScoreText": "Medium",
					"State": "Yellow"
				}, {
					"Key": "42",
					"Score": 12,
					"ScoreText": "Medium",
					"State": "Yellow"
				}, {
					"Key": "43",
					"Score": 17,
					"ScoreText": "Significant",
					"State": "Error"
				}, {
					"Key": "44",
					"Score": 21,
					"ScoreText": "High",
					"State": "Error"
				}, {
					"Key": "45",
					"Score": 24,
					"ScoreText": "High",
					"State": "Error"
				}, {
					"Key": "51",
					"Score": 11,
					"ScoreText": "Medium",
					"State": "Yellow"
				}, {
					"Key": "52",
					"Score": 16,
					"ScoreText": "Significant",
					"State": "Error"
				}, {
					"Key": "53",
					"Score": 20,
					"ScoreText": "Significant",
					"State": "Error"
				}, {
					"Key": "54",
					"Score": 23,
					"ScoreText": "High",
					"State": "Error"
				}, {
					"Key": "55",
					"Score": 25,
					"ScoreText": "High",
					"State": "Error"
				}]
			});
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		}

	};

});