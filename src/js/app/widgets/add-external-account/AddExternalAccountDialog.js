/**
 * Copyright 2013 Archfirst
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * app/widgets/add-external-account/AddExternalAccountDialog
 *
 * Allows user to add an external account.
 *
 * @author Alasdair Swan
 */
define(
    [
        'app/domain/ExternalAccount',
        'app/domain/Repository',
        'app/framework/AlertUtil',
        'app/framework/ErrorUtil',
        'app/framework/ModalDialog',
        'text!app/widgets/add-external-account/AddExternalAccountTemplate.html',
        'form2js',
        'jqueryToObject',
        'jqueryValidationEngineRules'
    ],
    function(ExternalAccount, Repository, AlertUtil, ErrorUtil, ModalDialog, AddExternalAccountTemplate) {
        'use strict';

        return ModalDialog.extend({
            id: 'add-external-account-dialog',
            className: 'modal theme-b',

            template: {
                name: 'AddExternalAccountTemplate',
                source: AddExternalAccountTemplate
            },

            events: {
                'click .add-account-button': 'validateForm',
                'click .close-button': 'close',
                'keypress #add-external-account-dialog': 'checkEnterKey'
            },

            initialize: function() {
                this.settings = {
                    overlayVisible: true,
                    centerInWindow: true
                };

                return this;
            },

            checkEnterKey: function(event) {
                if (event.keyCode === $.ui.keyCode.ENTER) {
                    this.validateForm();
                    return false;
                }
            },

            validateForm: function() {
                if ($('#add-external-account-form').validationEngine('validate')) {

                    // Create external account
                    var externalAccount = new ExternalAccount($('#add-external-account-form').toObject());
                    Repository.getExternalAccounts().add(externalAccount);
                    externalAccount.save(null, {
                        success: this.createExternalAccountDone,
                        error: ErrorUtil.showBackboneError
                    });
                    this.close();
                }
            },

            createExternalAccountDone: function(/*data, textStatus, jqXHR*/) {
                AlertUtil.showConfirmation('External Account Added');
                Repository.updateAccounts();
            },

            postPlace: function(){
                ModalDialog.prototype.postPlace.call(this);
                this.$el.find('form').validationEngine();
                return this;
            }
        });
    }
);