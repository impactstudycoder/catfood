sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "catfood/productstable/model/formatter"
], function (Controller, Fragment, JSONModel, MessageBox, MessageToast, formatter) {
    "use strict";

    return Controller.extend("catfood.productstable.controller.App", {
        formatter: formatter,

        onInit: function () {
            this._oUiModel = new JSONModel({
                mode: "create",
                nameValueState: "None",
                priceValueState: "None"
            });

            this._loadUser();
        },

        _loadUser: function () {
            var oUserModel = new JSONModel({ name: "", picture: "" });

            this.getView().setModel(oUserModel, "user");

            // /user is served by srv/server.js from the Auth0 session
            fetch("/user").then(function (oResponse) {
                return oResponse.ok ? oResponse.json() : null;
            }).then(function (oUser) {
                if (oUser) {
                    oUserModel.setData(oUser);
                }
            }).catch(function () {});
        },

        onCreatePress: function () {
            var oTable = this.byId("productsTable"),
                oBinding = oTable.getBinding("items"),
                oContext = oBinding.create({
                    name: "",
                    description: "",
                    flavor: "",
                    weightInKg: null,
                    price: null,
                    currency: "USD",
                    stock: 0
                });

            // resetChanges on cancel rejects the created() promise; that's expected
            oContext.created().catch(function () {});

            this._oUiModel.setProperty("/mode", "create");
            this._openDialog(oContext);
        },

        onEditPress: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext();

            this._oUiModel.setProperty("/mode", "edit");
            this._openDialog(oContext);
        },

        onLogoutPress: function () {
            // Clears the session cookie and the Auth0 SSO session, then returns to BASE_URL
            window.location.href = "/logout";
        },

        onDeletePress: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext(),
                sName = oContext.getProperty("name"),
                oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            MessageBox.confirm(oResourceBundle.getText("msgDeleteConfirm", [sName]), {
                title: oResourceBundle.getText("msgDeleteConfirmTitle"),
                onClose: function (sAction) {
                    if (sAction !== MessageBox.Action.OK) {
                        return;
                    }
                    oContext.delete("$auto").then(function () {
                        MessageToast.show(oResourceBundle.getText("msgDeleteSuccess"));
                    }, function (oError) {
                        MessageBox.error(oError.message);
                    });
                }
            });
        },

        onDialogSavePress: function () {
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle(),
                oContext = this._oDialog.getBindingContext(),
                sName = oContext.getProperty("name"),
                fPrice = oContext.getProperty("price"),
                bValid = true;

            if (!sName) {
                this._oUiModel.setProperty("/nameValueState", "Error");
                bValid = false;
            } else {
                this._oUiModel.setProperty("/nameValueState", "None");
            }

            if (fPrice === null || fPrice === undefined || fPrice < 0) {
                this._oUiModel.setProperty("/priceValueState", "Error");
                bValid = false;
            } else {
                this._oUiModel.setProperty("/priceValueState", "None");
            }

            if (!bValid) {
                MessageToast.show(oResourceBundle.getText("msgNameRequired"));
                return;
            }

            this.getView().getModel().submitBatch("productEdit").then(function () {
                MessageToast.show(oResourceBundle.getText("msgSaveSuccess"));
            }, function (oError) {
                MessageBox.error(oError.message || oResourceBundle.getText("msgSaveError"));
            });

            this._oDialog.close();
        },

        onDialogCancelPress: function () {
            var oModel = this.getView().getModel();

            if (oModel.hasPendingChanges("productEdit")) {
                oModel.resetChanges("productEdit");
            }

            this._oDialog.close();
        },

        _openDialog: function (oContext) {
            this._oUiModel.setProperty("/nameValueState", "None");
            this._oUiModel.setProperty("/priceValueState", "None");
            this._getDialog().then(function (oDialog) {
                oDialog.setBindingContext(oContext);
                oDialog.open();
            });
        },

        _getDialog: function () {
            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    id: this.getView().getId(),
                    name: "catfood.productstable.view.ProductDialog",
                    controller: this
                }).then(function (oDialog) {
                    this._oDialog = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.setModel(this._oUiModel, "ui");
                    return oDialog;
                }.bind(this));
            }
            return this._pDialog;
        }
    });
});
