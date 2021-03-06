import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  authnStore: service('authn-store'),
  model: function() {
    return this.get('authnStore').find('config', null, {forceReload: true}).then(function(collection) {
      return collection;
    });
  },

  setupController: function(controller, model) {
    controller.setProperties({
      model: model,
      confirmDisable: false,
      testing: false,
      organizations: this.get('session.orgs')||[],
      errors: null,
      isEnterprise: (model.get('hostname') ? true : false),
    });

    controller.set('saved',true);
  }
});
